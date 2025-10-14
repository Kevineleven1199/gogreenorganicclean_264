<?php

if (!defined('ABSPATH')) {
    exit;
}

class GoGreen_OpenPhone_API {
    
    private static $instance = null;
    private $api_key;
    private $api_base = 'https://api.openphone.com/v1';
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        $this->api_key = get_option('gogreen_openphone_api_key');
    }
    
    private function make_request($endpoint, $method = 'GET', $data = array()) {
        if (empty($this->api_key)) {
            return new WP_Error('no_api_key', __('OpenPhone API key not configured', 'gogreen-openphone'));
        }
        
        $url = $this->api_base . $endpoint;
        
        $args = array(
            'method' => $method,
            'headers' => array(
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . $this->api_key,
            ),
            'timeout' => 30,
        );
        
        if (!empty($data) && in_array($method, array('POST', 'PUT', 'PATCH'))) {
            $args['body'] = wp_json_encode($data);
        }
        
        $response = wp_remote_request($url, $args);
        
        if (is_wp_error($response)) {
            return $response;
        }
        
        $body = wp_remote_retrieve_body($response);
        $status_code = wp_remote_retrieve_response_code($response);
        
        if ($status_code >= 400) {
            $error_data = json_decode($body, true);
            $error_message = $error_data['message'] ?? 'API request failed';
            return new WP_Error('api_error', $error_message, array('status' => $status_code));
        }
        
        return json_decode($body, true);
    }
    
    public function send_sms($to, $message, $from = null) {
        if (empty($from)) {
            $from = get_option('gogreen_openphone_phone_number');
        }
        
        $data = array(
            'to' => array($to),
            'from' => $from,
            'content' => $message,
        );
        
        return $this->make_request('/messages', 'POST', $data);
    }
    
    public function get_phone_numbers() {
        return $this->make_request('/phone-numbers');
    }
    
    public function get_messages($phone_number_id = null, $limit = 50) {
        $endpoint = '/messages?maxResults=' . $limit;
        
        if ($phone_number_id) {
            $endpoint .= '&phoneNumberId=' . $phone_number_id;
        }
        
        return $this->make_request($endpoint);
    }
    
    public function get_call_logs($phone_number_id = null, $limit = 50) {
        $endpoint = '/calls?maxResults=' . $limit;
        
        if ($phone_number_id) {
            $endpoint .= '&phoneNumberId=' . $phone_number_id;
        }
        
        return $this->make_request($endpoint);
    }
    
    public function test_connection() {
        return $this->get_phone_numbers();
    }
}
