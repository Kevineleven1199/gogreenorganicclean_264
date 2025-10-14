<?php

if (!defined('ABSPATH')) {
    exit;
}

class GoGreen_OpenPhone_SMS {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        if (get_option('gogreen_openphone_enable_sms') === '1') {
            add_action('gogreen_jobber_job_created', array($this, 'send_appointment_confirmation'), 10, 2);
            add_action('gogreen_send_appointment_reminder', array($this, 'send_appointment_reminder'), 10, 2);
            add_action('gogreen_jobber_invoice_created', array($this, 'send_invoice_notification'), 10, 2);
        }
    }
    
    public function send_appointment_confirmation($user_id, $job_data) {
        $phone = $this->get_user_phone($user_id);
        
        if (empty($phone)) {
            return;
        }
        
        $user = get_userdata($user_id);
        $first_name = get_user_meta($user_id, 'first_name', true);
        $name = !empty($first_name) ? $first_name : $user->display_name;
        
        $message = sprintf(
            __('Hi %s! Your cleaning appointment has been confirmed. We will see you soon! - GoGreen Organic Clean', 'gogreen-openphone'),
            $name
        );
        
        $api = GoGreen_OpenPhone_API::get_instance();
        return $api->send_sms($phone, $message);
    }
    
    public function send_appointment_reminder($user_id, $appointment_data) {
        $phone = $this->get_user_phone($user_id);
        
        if (empty($phone)) {
            return;
        }
        
        $user = get_userdata($user_id);
        $first_name = get_user_meta($user_id, 'first_name', true);
        $name = !empty($first_name) ? $first_name : $user->display_name;
        
        $appointment_time = isset($appointment_data['start_at']) ? $appointment_data['start_at'] : 'tomorrow';
        
        $message = sprintf(
            __('Hi %s! Reminder: Your cleaning appointment is scheduled for %s. Reply CONFIRM or call us if you need to reschedule. - GoGreen Organic Clean', 'gogreen-openphone'),
            $name,
            $appointment_time
        );
        
        $api = GoGreen_OpenPhone_API::get_instance();
        return $api->send_sms($phone, $message);
    }
    
    public function send_invoice_notification($user_id, $invoice_data) {
        $phone = $this->get_user_phone($user_id);
        
        if (empty($phone)) {
            return;
        }
        
        $user = get_userdata($user_id);
        $first_name = get_user_meta($user_id, 'first_name', true);
        $name = !empty($first_name) ? $first_name : $user->display_name;
        
        $invoice_number = $invoice_data['invoice_number'] ?? '';
        
        $message = sprintf(
            __('Hi %s! Your invoice #%s is ready. View and pay online at your customer portal. Thank you! - GoGreen Organic Clean', 'gogreen-openphone'),
            $name,
            $invoice_number
        );
        
        $api = GoGreen_OpenPhone_API::get_instance();
        return $api->send_sms($phone, $message);
    }
    
    public function send_custom_sms($user_id, $message) {
        $phone = $this->get_user_phone($user_id);
        
        if (empty($phone)) {
            return new WP_Error('no_phone', __('User has no phone number', 'gogreen-openphone'));
        }
        
        $api = GoGreen_OpenPhone_API::get_instance();
        return $api->send_sms($phone, $message);
    }
    
    private function get_user_phone($user_id) {
        $phone = get_user_meta($user_id, 'billing_phone', true);
        
        if (empty($phone)) {
            $phone = get_user_meta($user_id, 'phone', true);
        }
        
        if (empty($phone)) {
            $phone = get_user_meta($user_id, 'mobile_phone', true);
        }
        
        return $this->format_phone($phone);
    }
    
    private function format_phone($phone) {
        if (empty($phone)) {
            return '';
        }
        
        $phone = preg_replace('/[^0-9+]/', '', $phone);
        
        if (strlen($phone) === 10) {
            $phone = '+1' . $phone;
        }
        
        return $phone;
    }
}
