<?php

if (!defined('ABSPATH')) {
    exit;
}

class GoGreen_Cleaner_Confirmation {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
    }
    
    public function send_confirmation_request($request_id, $match) {
        global $wpdb;
        
        $request = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$wpdb->prefix}gogreen_schedule_requests WHERE id = %d",
            $request_id
        ));
        
        if (!$request) {
            return false;
        }
        
        if (class_exists('GoGreen_OpenPhone_SMS')) {
            $cleaner = get_userdata($match['cleaner_id']);
            $cleaner_phone = get_user_meta($match['cleaner_id'], 'phone', true);
            
            if (empty($cleaner_phone)) {
                $cleaner_phone = get_user_meta($match['cleaner_id'], 'billing_phone', true);
            }
            
            if ($cleaner_phone) {
                $message = sprintf(
                    "New job match! 🎯\n\n" .
                    "Customer: %s\n" .
                    "Service: %s\n" .
                    "Date: %s\n" .
                    "Duration: %d min\n" .
                    "Confidence: %d%%\n\n" .
                    "Confirm: %s\n" .
                    "Decline: %s",
                    $request->customer_name,
                    $request->service_type,
                    date('D, M j @ g:ia', strtotime($match['datetime'])),
                    $request->duration_minutes,
                    $match['confidence'],
                    home_url('/wp-json/gogreen-ai-scheduler/v1/cleaner-confirm/' . $request_id . '?action=confirm&token=' . $this->generate_token($request_id)),
                    home_url('/wp-json/gogreen-ai-scheduler/v1/cleaner-confirm/' . $request_id . '?action=decline&token=' . $this->generate_token($request_id))
                );
                
                $sms = GoGreen_OpenPhone_SMS::get_instance();
                $sms->send_custom_sms($match['cleaner_id'], $message);
            }
        }
        
        $cleaner_email = $match['cleaner_email'];
        $subject = 'New Job Assignment - Please Confirm';
        $email_message = sprintf(
            "Hi %s,\n\n" .
            "You've been matched with a new cleaning job:\n\n" .
            "Customer: %s\n" .
            "Service Type: %s\n" .
            "Date & Time: %s\n" .
            "Estimated Duration: %d minutes\n" .
            "Address: %s\n" .
            "Special Instructions: %s\n\n" .
            "This is a %d%% confidence match based on your availability and location.\n\n" .
            "Please confirm or decline:\n" .
            "Confirm: %s\n" .
            "Decline: %s\n\n" .
            "Thanks,\nGoGreen Organic Clean",
            $match['cleaner_name'],
            $request->customer_name,
            $request->service_type,
            date('l, F j, Y @ g:i A', strtotime($match['datetime'])),
            $request->duration_minutes,
            $request->location_address,
            $request->special_instructions,
            $match['confidence'],
            home_url('/wp-json/gogreen-ai-scheduler/v1/cleaner-confirm/' . $request_id . '?action=confirm&token=' . $this->generate_token($request_id)),
            home_url('/wp-json/gogreen-ai-scheduler/v1/cleaner-confirm/' . $request_id . '?action=decline&token=' . $this->generate_token($request_id))
        );
        
        wp_mail($cleaner_email, $subject, $email_message);
        
        do_action('gogreen_ai_scheduler_cleaner_notified', $request_id, $match);
        
        return true;
    }
    
    public function notify_cleaner_assignment($request_id) {
        global $wpdb;
        
        $request = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$wpdb->prefix}gogreen_schedule_requests WHERE id = %d",
            $request_id
        ));
        
        if (!$request || !$request->ai_matched_cleaner_id) {
            return false;
        }
        
        $cleaner = get_userdata($request->ai_matched_cleaner_id);
        $cleaner_phone = get_user_meta($request->ai_matched_cleaner_id, 'phone', true);
        
        if ($cleaner_phone && class_exists('GoGreen_OpenPhone_SMS')) {
            $message = sprintf(
                "Job Confirmed! ✅\n\n" .
                "Customer: %s\n" .
                "Service: %s\n" .
                "Date: %s\n" .
                "Address: %s\n\n" .
                "Check your dashboard for details.",
                $request->customer_name,
                $request->service_type,
                date('D, M j @ g:ia', strtotime($request->ai_suggested_datetime)),
                $request->location_address
            );
            
            $sms = GoGreen_OpenPhone_SMS::get_instance();
            $sms->send_custom_sms($request->ai_matched_cleaner_id, $message);
        }
        
        return true;
    }
    
    public static function handle_confirmation($request) {
        $request_id = $request['request_id'];
        $action = $request->get_param('action');
        $token = $request->get_param('token');
        
        $expected_token = self::generate_token($request_id);
        if ($token !== $expected_token) {
            return new WP_Error('invalid_token', 'Invalid or expired confirmation link', array('status' => 401));
        }
        
        global $wpdb;
        
        if ($action === 'confirm') {
            $wpdb->update(
                $wpdb->prefix . 'gogreen_schedule_requests',
                array(
                    'cleaner_status' => 'confirmed',
                    'cleaner_confirmed_at' => current_time('mysql'),
                    'status' => 'confirmed',
                ),
                array('id' => $request_id)
            );
            
            $scheduler = GoGreen_AI_Scheduler_Engine::get_instance();
            $scheduler->create_jobber_job($request_id);
            
            $customer_notifier = GoGreen_Customer_Notification::get_instance();
            $customer_notifier->send_booking_confirmation($request_id);
            
            return array(
                'success' => true,
                'message' => 'Job confirmed! Customer has been notified.',
                'redirect' => home_url('/cleaner-dashboard/'),
            );
        } elseif ($action === 'decline') {
            $wpdb->update(
                $wpdb->prefix . 'gogreen_schedule_requests',
                array(
                    'cleaner_status' => 'declined',
                    'status' => 'finding_alternative',
                ),
                array('id' => $request_id)
            );
            
            $request_data = $wpdb->get_row($wpdb->prepare(
                "SELECT * FROM {$wpdb->prefix}gogreen_schedule_requests WHERE id = %d",
                $request_id
            ));
            
            if ($request_data) {
                $matcher = GoGreen_Schedule_Matcher::get_instance();
                $new_match = $matcher->find_optimal_cleaner_and_time($request_data);
                
                if ($new_match) {
                    $scheduler = GoGreen_AI_Scheduler_Engine::get_instance();
                    $scheduler->request_cleaner_confirmation($request_id, $new_match);
                }
            }
            
            return array(
                'success' => true,
                'message' => 'Job declined. Finding alternative cleaner...',
                'redirect' => home_url('/cleaner-dashboard/'),
            );
        }
        
        return new WP_Error('invalid_action', 'Invalid action', array('status' => 400));
    }
    
    private function generate_token($request_id) {
        return md5($request_id . wp_salt('auth'));
    }
}
