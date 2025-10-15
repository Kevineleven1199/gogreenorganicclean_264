<?php

if (!defined('ABSPATH')) {
    exit;
}

class GoGreen_Pabbly_Integration {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
    }
    
    public function trigger_workflow($event_type, $data) {
        $webhook_url = get_option('gogreen_ai_scheduler_pabbly_webhook');
        
        if (empty($webhook_url)) {
            return false;
        }
        
        $payload = array(
            'event' => $event_type,
            'timestamp' => current_time('mysql'),
            'data' => $data,
        );
        
        $response = wp_remote_post($webhook_url, array(
            'headers' => array('Content-Type' => 'application/json'),
            'body' => wp_json_encode($payload),
            'timeout' => 30,
        ));
        
        if (is_wp_error($response)) {
            error_log('Pabbly webhook failed: ' . $response->get_error_message());
            return false;
        }
        
        return true;
    }
    
    public static function handle_pabbly_webhook($request) {
        $body = json_decode($request->get_body(), true);
        
        if (!isset($body['action'])) {
            return new WP_Error('invalid_webhook', 'Missing action parameter', array('status' => 400));
        }
        
        $action = $body['action'];
        $data = $body['data'] ?? array();
        
        switch ($action) {
            case 'schedule_confirmed':
                return self::handle_schedule_confirmed($data);
            case 'schedule_declined':
                return self::handle_schedule_declined($data);
            case 'reschedule_requested':
                return self::handle_reschedule_requested($data);
            default:
                return new WP_Error('unknown_action', 'Unknown action: ' . $action, array('status' => 400));
        }
    }
    
    private static function handle_schedule_confirmed($data) {
        $request_id = $data['request_id'] ?? null;
        
        if (!$request_id) {
            return new WP_Error('missing_request_id', 'Request ID is required', array('status' => 400));
        }
        
        global $wpdb;
        $wpdb->update(
            $wpdb->prefix . 'gogreen_schedule_requests',
            array(
                'customer_confirmed_at' => current_time('mysql'),
                'status' => 'fully_confirmed',
            ),
            array('id' => $request_id)
        );
        
        do_action('gogreen_ai_scheduler_customer_confirmed', $request_id);
        
        return array(
            'success' => true,
            'message' => 'Schedule confirmed successfully',
        );
    }
    
    private static function handle_schedule_declined($data) {
        $request_id = $data['request_id'] ?? null;
        $reason = $data['reason'] ?? 'Customer declined';
        
        if (!$request_id) {
            return new WP_Error('missing_request_id', 'Request ID is required', array('status' => 400));
        }
        
        global $wpdb;
        $wpdb->update(
            $wpdb->prefix . 'gogreen_schedule_requests',
            array(
                'status' => 'declined',
                'special_instructions' => $reason,
            ),
            array('id' => $request_id)
        );
        
        $scheduler = GoGreen_AI_Scheduler_Engine::get_instance();
        $request = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$wpdb->prefix}gogreen_schedule_requests WHERE id = %d",
            $request_id
        ));
        
        if ($request) {
            $matcher = GoGreen_Schedule_Matcher::get_instance();
            $new_match = $matcher->find_optimal_cleaner_and_time($request);
            
            if ($new_match) {
                $scheduler->process_scheduling_request(array(
                    'type' => 'reschedule',
                    'customer_id' => $request->customer_id,
                    'email' => $request->customer_email,
                    'phone' => $request->customer_phone,
                    'name' => $request->customer_name,
                    'service_type' => $request->service_type,
                    'preferred_date' => $new_match['datetime'],
                    'preferred_time' => date('H:i', strtotime($new_match['datetime'])),
                ));
            }
        }
        
        return array(
            'success' => true,
            'message' => 'Schedule declined, alternative being found',
        );
    }
    
    private static function handle_reschedule_requested($data) {
        $request_id = $data['request_id'] ?? null;
        $new_date = $data['new_date'] ?? null;
        $new_time = $data['new_time'] ?? 'flexible';
        
        if (!$request_id) {
            return new WP_Error('missing_request_id', 'Request ID is required', array('status' => 400));
        }
        
        global $wpdb;
        $request = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$wpdb->prefix}gogreen_schedule_requests WHERE id = %d",
            $request_id
        ));
        
        if (!$request) {
            return new WP_Error('request_not_found', 'Request not found', array('status' => 404));
        }
        
        if ($new_date) {
            $wpdb->update(
                $wpdb->prefix . 'gogreen_schedule_requests',
                array(
                    'preferred_date' => $new_date,
                    'preferred_time' => $new_time,
                    'status' => 'rescheduling',
                ),
                array('id' => $request_id)
            );
            
            $scheduler = GoGreen_AI_Scheduler_Engine::get_instance();
            $scheduler->find_best_match($request_id);
        }
        
        return array(
            'success' => true,
            'message' => 'Reschedule request processed',
        );
    }
}
