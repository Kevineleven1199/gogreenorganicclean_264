<?php

if (!defined('ABSPATH')) {
    exit;
}

class GoGreen_Jobber_Webhooks {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
    }
    
    public static function verify_webhook($request) {
        $signature = $request->get_header('X-Jobber-Signature');
        $webhook_secret = get_option('gogreen_jobber_webhook_secret');
        
        if (empty($webhook_secret)) {
            return new WP_Error('no_webhook_secret', 'Webhook secret not configured', array('status' => 401));
        }
        
        $body = $request->get_body();
        $calculated_signature = hash_hmac('sha256', $body, $webhook_secret);
        
        if (!hash_equals($calculated_signature, $signature)) {
            return new WP_Error('invalid_signature', 'Invalid webhook signature', array('status' => 401));
        }
        
        return true;
    }
    
    public static function handle_webhook($request) {
        $body = json_decode($request->get_body(), true);
        
        if (!isset($body['event_type'])) {
            return new WP_Error('invalid_webhook', 'Invalid webhook payload', array('status' => 400));
        }
        
        $event_type = $body['event_type'];
        $data = $body['data'] ?? array();
        
        switch ($event_type) {
            case 'job.created':
                self::handle_job_created($data);
                break;
            case 'job.updated':
                self::handle_job_updated($data);
                break;
            case 'invoice.created':
                self::handle_invoice_created($data);
                break;
            case 'invoice.paid':
                self::handle_invoice_paid($data);
                break;
            case 'quote.approved':
                self::handle_quote_approved($data);
                break;
            default:
                do_action('gogreen_jobber_webhook_' . $event_type, $data);
        }
        
        return array(
            'success' => true,
            'message' => 'Webhook processed',
        );
    }
    
    private static function handle_job_created($data) {
        if (!isset($data['job_id']) || !isset($data['client_id'])) {
            return;
        }
        
        $sync = GoGreen_Jobber_Sync::get_instance();
        $user_id = $sync->get_wp_user_id($data['client_id']);
        
        if ($user_id) {
            update_user_meta($user_id, '_last_job_created', current_time('mysql'));
            
            do_action('gogreen_jobber_job_created', $user_id, $data);
        }
    }
    
    private static function handle_job_updated($data) {
        if (!isset($data['job_id']) || !isset($data['client_id'])) {
            return;
        }
        
        $sync = GoGreen_Jobber_Sync::get_instance();
        $user_id = $sync->get_wp_user_id($data['client_id']);
        
        if ($user_id) {
            do_action('gogreen_jobber_job_updated', $user_id, $data);
        }
    }
    
    private static function handle_invoice_created($data) {
        if (!isset($data['invoice_id']) || !isset($data['client_id'])) {
            return;
        }
        
        $sync = GoGreen_Jobber_Sync::get_instance();
        $user_id = $sync->get_wp_user_id($data['client_id']);
        
        if ($user_id) {
            update_user_meta($user_id, '_last_invoice_created', current_time('mysql'));
            
            do_action('gogreen_jobber_invoice_created', $user_id, $data);
        }
    }
    
    private static function handle_invoice_paid($data) {
        if (!isset($data['invoice_id']) || !isset($data['client_id'])) {
            return;
        }
        
        $sync = GoGreen_Jobber_Sync::get_instance();
        $user_id = $sync->get_wp_user_id($data['client_id']);
        
        if ($user_id) {
            update_user_meta($user_id, '_last_payment_received', current_time('mysql'));
            
            do_action('gogreen_jobber_invoice_paid', $user_id, $data);
        }
    }
    
    private static function handle_quote_approved($data) {
        if (!isset($data['quote_id']) || !isset($data['client_id'])) {
            return;
        }
        
        $sync = GoGreen_Jobber_Sync::get_instance();
        $user_id = $sync->get_wp_user_id($data['client_id']);
        
        if ($user_id) {
            do_action('gogreen_jobber_quote_approved', $user_id, $data);
        }
    }
}
