<?php

if (!defined('ABSPATH')) {
    exit;
}

class GoGreen_Jobber_Frontend {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        add_shortcode('jobber_appointments', array($this, 'appointments_shortcode'));
        add_shortcode('jobber_invoices', array($this, 'invoices_shortcode'));
        add_shortcode('jobber_booking_form', array($this, 'booking_form_shortcode'));
        
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_scripts'));
        
        add_action('wp_ajax_gogreen_jobber_get_appointments', array($this, 'ajax_get_appointments'));
        add_action('wp_ajax_gogreen_jobber_get_invoices', array($this, 'ajax_get_invoices'));
        add_action('wp_ajax_gogreen_jobber_create_booking', array($this, 'ajax_create_booking'));
    }
    
    public function enqueue_frontend_scripts() {
        if (is_user_logged_in()) {
            wp_enqueue_style('gogreen-jobber-frontend', GOGREEN_JOBBER_PLUGIN_URL . 'public/css/frontend.css', array(), GOGREEN_JOBBER_VERSION);
            wp_enqueue_script('gogreen-jobber-frontend', GOGREEN_JOBBER_PLUGIN_URL . 'public/js/frontend.js', array('jquery'), GOGREEN_JOBBER_VERSION, true);
            
            wp_localize_script('gogreen-jobber-frontend', 'gogreenJobber', array(
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('gogreen_jobber_frontend'),
            ));
        }
    }
    
    public function appointments_shortcode($atts) {
        if (!is_user_logged_in()) {
            return '<p>' . esc_html__('Please log in to view your appointments.', 'gogreen-jobber') . '</p>';
        }
        
        ob_start();
        include GOGREEN_JOBBER_PLUGIN_DIR . 'templates/user-dashboard-appointments.php';
        return ob_get_clean();
    }
    
    public function invoices_shortcode($atts) {
        if (!is_user_logged_in()) {
            return '<p>' . esc_html__('Please log in to view your invoices.', 'gogreen-jobber') . '</p>';
        }
        
        ob_start();
        include GOGREEN_JOBBER_PLUGIN_DIR . 'templates/user-dashboard-invoices.php';
        return ob_get_clean();
    }
    
    public function booking_form_shortcode($atts) {
        $atts = shortcode_atts(array(
            'service' => '',
        ), $atts);
        
        ob_start();
        include GOGREEN_JOBBER_PLUGIN_DIR . 'templates/booking-form.php';
        return ob_get_clean();
    }
    
    public function ajax_get_appointments() {
        check_ajax_referer('gogreen_jobber_frontend', 'nonce');
        
        if (!is_user_logged_in()) {
            wp_send_json_error(array('message' => __('Unauthorized', 'gogreen-jobber')));
        }
        
        $user_id = get_current_user_id();
        $sync = GoGreen_Jobber_Sync::get_instance();
        $jobber_client_id = $sync->get_jobber_client_id($user_id);
        
        if (empty($jobber_client_id)) {
            wp_send_json_error(array('message' => __('No Jobber account linked', 'gogreen-jobber')));
        }
        
        $api = GoGreen_Jobber_API::get_instance();
        $result = $api->get_jobs_for_client($jobber_client_id, 20);
        
        if (is_wp_error($result)) {
            wp_send_json_error(array('message' => $result->get_error_message()));
        }
        
        wp_send_json_success(array('appointments' => $result['data']['jobs']['nodes'] ?? array()));
    }
    
    public function ajax_get_invoices() {
        check_ajax_referer('gogreen_jobber_frontend', 'nonce');
        
        if (!is_user_logged_in()) {
            wp_send_json_error(array('message' => __('Unauthorized', 'gogreen-jobber')));
        }
        
        $user_id = get_current_user_id();
        $sync = GoGreen_Jobber_Sync::get_instance();
        $jobber_client_id = $sync->get_jobber_client_id($user_id);
        
        if (empty($jobber_client_id)) {
            wp_send_json_error(array('message' => __('No Jobber account linked', 'gogreen-jobber')));
        }
        
        $api = GoGreen_Jobber_API::get_instance();
        $result = $api->get_invoices_for_client($jobber_client_id, 20);
        
        if (is_wp_error($result)) {
            wp_send_json_error(array('message' => $result->get_error_message()));
        }
        
        wp_send_json_success(array('invoices' => $result['data']['invoices']['nodes'] ?? array()));
    }
    
    public function ajax_create_booking() {
        check_ajax_referer('gogreen_jobber_frontend', 'nonce');
        
        if (!is_user_logged_in()) {
            wp_send_json_error(array('message' => __('Unauthorized', 'gogreen-jobber')));
        }
        
        $user_id = get_current_user_id();
        $sync = GoGreen_Jobber_Sync::get_instance();
        $jobber_client_id = $sync->get_jobber_client_id($user_id);
        
        if (empty($jobber_client_id)) {
            $sync_result = $sync->sync_new_user_to_jobber($user_id);
            if (is_wp_error($sync_result)) {
                wp_send_json_error(array('message' => __('Failed to create Jobber account', 'gogreen-jobber')));
            }
            $jobber_client_id = $sync->get_jobber_client_id($user_id);
        }
        
        $title = sanitize_text_field($_POST['title'] ?? '');
        $start_at = sanitize_text_field($_POST['start_at'] ?? '');
        $end_at = sanitize_text_field($_POST['end_at'] ?? '');
        
        if (empty($title) || empty($start_at)) {
            wp_send_json_error(array('message' => __('Missing required fields', 'gogreen-jobber')));
        }
        
        $data = array(
            'client_id' => $jobber_client_id,
            'title' => $title,
            'start_at' => $start_at,
            'end_at' => !empty($end_at) ? $end_at : $start_at,
        );
        
        $api = GoGreen_Jobber_API::get_instance();
        $result = $api->create_job($data);
        
        if (is_wp_error($result)) {
            wp_send_json_error(array('message' => $result->get_error_message()));
        }
        
        wp_send_json_success(array(
            'message' => __('Appointment booked successfully!', 'gogreen-jobber'),
            'job' => $result['data']['createJob']['job'] ?? array()
        ));
    }
}
