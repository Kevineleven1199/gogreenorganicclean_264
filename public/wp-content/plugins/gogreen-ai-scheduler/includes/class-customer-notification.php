<?php

if (!defined('ABSPATH')) {
    exit;
}

class GoGreen_Customer_Notification {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
    }
    
    public function send_booking_confirmation($request_id) {
        global $wpdb;
        
        $request = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$wpdb->prefix}gogreen_schedule_requests WHERE id = %d",
            $request_id
        ));
        
        if (!$request) {
            return false;
        }
        
        $cleaner = get_userdata($request->ai_matched_cleaner_id);
        $cleaner_name = $cleaner ? $cleaner->display_name : 'Your cleaner';
        
        if ($request->customer_phone && class_exists('GoGreen_OpenPhone_API')) {
            $message = sprintf(
                "Booking Confirmed! ✅\n\n" .
                "Service: %s\n" .
                "Date: %s\n" .
                "Cleaner: %s\n\n" .
                "We'll send a reminder 24 hours before.\n\n" .
                "View details: %s\n\n" .
                "Questions? Reply or call us!\n" .
                "- GoGreen Organic Clean",
                $request->service_type,
                date('l, M j @ g:ia', strtotime($request->ai_suggested_datetime)),
                $cleaner_name,
                home_url('/client-dashboard/')
            );
            
            $api = GoGreen_OpenPhone_API::get_instance();
            $api->send_sms($request->customer_phone, $message);
        }
        
        $subject = 'Your Cleaning Appointment is Confirmed!';
        $email_message = sprintf(
            "Hi %s,\n\n" .
            "Great news! Your cleaning appointment has been confirmed.\n\n" .
            "APPOINTMENT DETAILS\n" .
            "───────────────────\n" .
            "Service: %s\n" .
            "Date & Time: %s\n" .
            "Duration: Approximately %d minutes\n" .
            "Cleaner: %s\n" .
            "Address: %s\n\n" .
            "WHAT TO EXPECT\n" .
            "───────────────\n" .
            "• Your cleaner will arrive on time with all supplies\n" .
            "• We use 100%% eco-friendly, non-toxic products\n" .
            "• All staff are background-checked and insured\n" .
            "• We'll send you a reminder 24 hours before\n\n" .
            "NEED TO RESCHEDULE?\n" .
            "───────────────────\n" .
            "No problem! Just reply to this email or text us.\n\n" .
            "View your appointment: %s\n\n" .
            "Thanks for choosing GoGreen Organic Clean!\n\n" .
            "Best regards,\n" .
            "The GoGreen Team\n\n" .
            "P.S. Don't forget - refer a friend and you both get $50 off!",
            $request->customer_name,
            $request->service_type,
            date('l, F j, Y @ g:i A', strtotime($request->ai_suggested_datetime)),
            $request->duration_minutes,
            $cleaner_name,
            $request->location_address,
            home_url('/client-dashboard/')
        );
        
        wp_mail($request->customer_email, $subject, $email_message);
        
        $this->schedule_reminder($request_id);
        
        do_action('gogreen_ai_scheduler_customer_confirmed', $request_id);
        
        return true;
    }
    
    private function schedule_reminder($request_id) {
        global $wpdb;
        
        $request = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$wpdb->prefix}gogreen_schedule_requests WHERE id = %d",
            $request_id
        ));
        
        if (!$request) {
            return false;
        }
        
        $appointment_time = strtotime($request->ai_suggested_datetime);
        $reminder_time = $appointment_time - (24 * 60 * 60);
        
        if ($reminder_time > time()) {
            wp_schedule_single_event($reminder_time, 'gogreen_send_appointment_reminder', array($request_id));
        }
        
        return true;
    }
    
    public function send_appointment_reminder($request_id) {
        global $wpdb;
        
        $request = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$wpdb->prefix}gogreen_schedule_requests WHERE id = %d",
            $request_id
        ));
        
        if (!$request || $request->status === 'cancelled') {
            return false;
        }
        
        $cleaner = get_userdata($request->ai_matched_cleaner_id);
        $cleaner_name = $cleaner ? $cleaner->display_name : 'Your cleaner';
        
        if ($request->customer_phone && class_exists('GoGreen_OpenPhone_API')) {
            $message = sprintf(
                "Reminder: Cleaning Tomorrow! 🧹\n\n" .
                "Service: %s\n" .
                "Time: %s\n" .
                "Cleaner: %s\n\n" .
                "Please ensure:\n" .
                "✓ Clear path to areas\n" .
                "✓ Pets secured\n" .
                "✓ Access arranged\n\n" .
                "Need to reschedule? Reply now!\n\n" .
                "- GoGreen Organic Clean",
                $request->service_type,
                date('g:ia', strtotime($request->ai_suggested_datetime)),
                $cleaner_name
            );
            
            $api = GoGreen_OpenPhone_API::get_instance();
            $api->send_sms($request->customer_phone, $message);
        }
        
        if (class_exists('GoGreen_Pabbly_Integration')) {
            $pabbly = GoGreen_Pabbly_Integration::get_instance();
            $pabbly->trigger_workflow('appointment_reminder_sent', array(
                'request_id' => $request_id,
                'customer_name' => $request->customer_name,
                'customer_email' => $request->customer_email,
                'customer_phone' => $request->customer_phone,
                'appointment_datetime' => $request->ai_suggested_datetime,
            ));
        }
        
        return true;
    }
    
    public static function handle_customer_confirmation($request) {
        $request_id = $request['request_id'];
        $action = $request->get_param('action');
        
        global $wpdb;
        
        if ($action === 'confirm') {
            $wpdb->update(
                $wpdb->prefix . 'gogreen_schedule_requests',
                array(
                    'customer_confirmed_at' => current_time('mysql'),
                    'status' => 'fully_confirmed',
                ),
                array('id' => $request_id)
            );
            
            return array(
                'success' => true,
                'message' => 'Appointment confirmed!',
            );
        } elseif ($action === 'reschedule') {
            return array(
                'success' => true,
                'message' => 'Reschedule request received. We\'ll contact you shortly.',
                'redirect' => home_url('/client-dashboard/'),
            );
        }
        
        return new WP_Error('invalid_action', 'Invalid action', array('status' => 400));
    }
}

add_action('gogreen_send_appointment_reminder', array('GoGreen_Customer_Notification', 'send_appointment_reminder'));
