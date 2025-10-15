<?php

if (!defined('ABSPATH')) {
    exit;
}

class GoGreen_AI_Scheduler_Engine {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
    }
    
    public function process_scheduling_request($data) {
        global $wpdb;
        
        $request_id = $wpdb->insert(
            $wpdb->prefix . 'gogreen_schedule_requests',
            array(
                'request_type' => $data['type'] ?? 'appointment',
                'customer_id' => $data['customer_id'] ?? null,
                'customer_email' => $data['email'],
                'customer_phone' => $data['phone'],
                'customer_name' => $data['name'],
                'service_type' => $data['service_type'],
                'preferred_date' => $data['preferred_date'],
                'preferred_time' => $data['preferred_time'] ?? 'flexible',
                'duration_minutes' => $this->estimate_duration($data['service_type']),
                'location_address' => $data['address'] ?? '',
                'special_instructions' => $data['notes'] ?? '',
                'status' => 'pending',
            ),
            array('%s', '%d', '%s', '%s', '%s', '%s', '%s', '%s', '%d', '%s', '%s', '%s')
        );
        
        if ($request_id) {
            $this->find_best_match($wpdb->insert_id);
        }
        
        return $wpdb->insert_id;
    }
    
    public function process_form_scheduling_request($entry) {
        $data = array(
            'type' => 'appointment',
            'email' => $entry['email']['value'] ?? '',
            'phone' => $entry['phone']['value'] ?? '',
            'name' => ($entry['first_name']['value'] ?? '') . ' ' . ($entry['last_name']['value'] ?? ''),
            'service_type' => $entry['service']['value'] ?? 'General Cleaning',
            'preferred_date' => $entry['date']['value'] ?? date('Y-m-d', strtotime('+2 days')),
            'preferred_time' => $entry['time']['value'] ?? 'flexible',
            'address' => $entry['address']['value'] ?? '',
            'notes' => $entry['message']['value'] ?? '',
        );
        
        return $this->process_scheduling_request($data);
    }
    
    private function find_best_match($request_id) {
        global $wpdb;
        
        $request = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$wpdb->prefix}gogreen_schedule_requests WHERE id = %d",
            $request_id
        ));
        
        if (!$request) {
            return false;
        }
        
        $matcher = GoGreen_Schedule_Matcher::get_instance();
        $match = $matcher->find_optimal_cleaner_and_time($request);
        
        if ($match && $match['confidence'] > 0) {
            $wpdb->update(
                $wpdb->prefix . 'gogreen_schedule_requests',
                array(
                    'ai_matched_cleaner_id' => $match['cleaner_id'],
                    'ai_suggested_datetime' => $match['datetime'],
                    'ai_confidence_score' => $match['confidence'],
                    'status' => 'matched',
                ),
                array('id' => $request_id),
                array('%d', '%s', '%f', '%s'),
                array('%d')
            );
            
            $auto_confirm_threshold = get_option('gogreen_ai_scheduler_auto_confirm_threshold', 90);
            
            if ($match['confidence'] >= $auto_confirm_threshold) {
                $this->auto_confirm_booking($request_id, $match);
            } else {
                $this->request_cleaner_confirmation($request_id, $match);
            }
            
            $this->trigger_pabbly_workflow('scheduling_matched', array(
                'request_id' => $request_id,
                'cleaner_id' => $match['cleaner_id'],
                'datetime' => $match['datetime'],
                'confidence' => $match['confidence'],
                'customer_email' => $request->customer_email,
                'customer_phone' => $request->customer_phone,
            ));
        } else {
            $this->alert_admin_no_match($request_id);
        }
        
        return $match;
    }
    
    private function auto_confirm_booking($request_id, $match) {
        global $wpdb;
        
        $wpdb->update(
            $wpdb->prefix . 'gogreen_schedule_requests',
            array(
                'cleaner_status' => 'auto_confirmed',
                'cleaner_confirmed_at' => current_time('mysql'),
                'status' => 'confirmed',
            ),
            array('id' => $request_id)
        );
        
        $this->create_jobber_job($request_id);
        
        $customer_notifier = GoGreen_Customer_Notification::get_instance();
        $customer_notifier->send_booking_confirmation($request_id);
        
        $cleaner_notifier = GoGreen_Cleaner_Confirmation::get_instance();
        $cleaner_notifier->notify_cleaner_assignment($request_id);
        
        do_action('gogreen_ai_scheduler_auto_confirmed', $request_id, $match);
    }
    
    private function request_cleaner_confirmation($request_id, $match) {
        $cleaner_confirmation = GoGreen_Cleaner_Confirmation::get_instance();
        $cleaner_confirmation->send_confirmation_request($request_id, $match);
        
        do_action('gogreen_ai_scheduler_cleaner_confirmation_requested', $request_id, $match);
    }
    
    private function create_jobber_job($request_id) {
        global $wpdb;
        
        $request = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$wpdb->prefix}gogreen_schedule_requests WHERE id = %d",
            $request_id
        ));
        
        if (!$request || !class_exists('GoGreen_Jobber_API')) {
            return false;
        }
        
        $sync = GoGreen_Jobber_Sync::get_instance();
        $jobber_client_id = null;
        
        if ($request->customer_id) {
            $jobber_client_id = $sync->get_jobber_client_id($request->customer_id);
        }
        
        if (!$jobber_client_id) {
            $api = GoGreen_Jobber_API::get_instance();
            $result = $api->create_client(array(
                'first_name' => explode(' ', $request->customer_name)[0],
                'last_name' => explode(' ', $request->customer_name, 2)[1] ?? '',
                'email' => $request->customer_email,
                'phone' => $request->customer_phone,
            ));
            
            if (!is_wp_error($result) && isset($result['data']['createClient']['client']['id'])) {
                $jobber_client_id = $result['data']['createClient']['client']['id'];
            }
        }
        
        if ($jobber_client_id) {
            $api = GoGreen_Jobber_API::get_instance();
            $job_result = $api->create_job(array(
                'client_id' => $jobber_client_id,
                'title' => $request->service_type,
                'start_at' => $request->ai_suggested_datetime,
                'end_at' => date('Y-m-d H:i:s', strtotime($request->ai_suggested_datetime . ' +' . $request->duration_minutes . ' minutes')),
            ));
            
            if (!is_wp_error($job_result) && isset($job_result['data']['createJob']['job']['id'])) {
                $wpdb->update(
                    $wpdb->prefix . 'gogreen_schedule_requests',
                    array('jobber_job_id' => $job_result['data']['createJob']['job']['id']),
                    array('id' => $request_id)
                );
                
                return $job_result['data']['createJob']['job']['id'];
            }
        }
        
        return false;
    }
    
    private function alert_admin_no_match($request_id) {
        global $wpdb;
        
        $request = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$wpdb->prefix}gogreen_schedule_requests WHERE id = %d",
            $request_id
        ));
        
        $admin_email = get_option('admin_email');
        $subject = 'No Cleaner Match Found - Manual Assignment Needed';
        $message = sprintf(
            "A new booking request couldn't be automatically matched:\n\n" .
            "Customer: %s\n" .
            "Service: %s\n" .
            "Preferred Date: %s\n" .
            "Preferred Time: %s\n\n" .
            "Please assign manually: %s",
            $request->customer_name,
            $request->service_type,
            $request->preferred_date,
            $request->preferred_time,
            admin_url('admin.php?page=gogreen-ai-scheduler-pending')
        );
        
        wp_mail($admin_email, $subject, $message);
        
        $this->trigger_pabbly_workflow('no_match_found', array(
            'request_id' => $request_id,
            'customer_name' => $request->customer_name,
            'customer_email' => $request->customer_email,
            'customer_phone' => $request->customer_phone,
            'service_type' => $request->service_type,
        ));
    }
    
    private function trigger_pabbly_workflow($event_type, $data) {
        $pabbly = GoGreen_Pabbly_Integration::get_instance();
        $pabbly->trigger_workflow($event_type, $data);
    }
    
    private function estimate_duration($service_type) {
        $durations = array(
            'Deep Cleaning' => 240,
            'Standard Cleaning' => 120,
            'Move-In Cleaning' => 180,
            'Move-Out Cleaning' => 180,
            'Office Cleaning' => 90,
            'Post-Construction' => 300,
        );
        
        return $durations[$service_type] ?? 120;
    }
}
