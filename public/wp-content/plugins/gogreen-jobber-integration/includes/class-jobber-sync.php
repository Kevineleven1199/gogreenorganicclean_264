<?php

if (!defined('ABSPATH')) {
    exit;
}

class GoGreen_Jobber_Sync {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        add_action('user_register', array($this, 'sync_new_user_to_jobber'), 10, 1);
        add_action('profile_update', array($this, 'sync_user_update_to_jobber'), 10, 2);
    }
    
    public function sync_new_user_to_jobber($user_id) {
        $user = get_userdata($user_id);
        
        if (!$user) {
            return;
        }
        
        $first_name = get_user_meta($user_id, 'first_name', true);
        $last_name = get_user_meta($user_id, 'last_name', true);
        $phone = get_user_meta($user_id, 'billing_phone', true);
        
        if (empty($phone)) {
            $phone = get_user_meta($user_id, 'phone', true);
        }
        
        $data = array(
            'first_name' => !empty($first_name) ? $first_name : $user->user_login,
            'last_name' => !empty($last_name) ? $last_name : '',
            'email' => $user->user_email,
            'phone' => $phone,
        );
        
        $address_data = array(
            'street1' => get_user_meta($user_id, 'billing_address_1', true),
            'street2' => get_user_meta($user_id, 'billing_address_2', true),
            'city' => get_user_meta($user_id, 'billing_city', true),
            'province' => get_user_meta($user_id, 'billing_state', true),
            'postal_code' => get_user_meta($user_id, 'billing_postcode', true),
        );
        
        if (!empty(array_filter($address_data))) {
            $data['address'] = $address_data;
        }
        
        $api = GoGreen_Jobber_API::get_instance();
        $result = $api->create_client($data);
        
        if (!is_wp_error($result) && isset($result['data']['createClient']['client']['id'])) {
            $jobber_client_id = $result['data']['createClient']['client']['id'];
            $this->save_sync_record($user_id, $jobber_client_id);
            
            do_action('gogreen_jobber_client_synced', $user_id, $jobber_client_id);
        }
        
        return $result;
    }
    
    public function sync_user_update_to_jobber($user_id, $old_user_data) {
        $jobber_client_id = $this->get_jobber_client_id($user_id);
        
        if (empty($jobber_client_id)) {
            $this->sync_new_user_to_jobber($user_id);
            return;
        }
    }
    
    public function save_sync_record($user_id, $jobber_client_id) {
        global $wpdb;
        
        $wpdb->replace(
            $wpdb->prefix . 'gogreen_jobber_sync',
            array(
                'wp_user_id' => $user_id,
                'jobber_client_id' => $jobber_client_id,
                'sync_status' => 'active',
            ),
            array('%d', '%s', '%s')
        );
        
        update_user_meta($user_id, '_jobber_client_id', $jobber_client_id);
    }
    
    public function get_jobber_client_id($user_id) {
        $cached = get_user_meta($user_id, '_jobber_client_id', true);
        
        if (!empty($cached)) {
            return $cached;
        }
        
        global $wpdb;
        $result = $wpdb->get_var($wpdb->prepare(
            "SELECT jobber_client_id FROM {$wpdb->prefix}gogreen_jobber_sync WHERE wp_user_id = %d",
            $user_id
        ));
        
        if ($result) {
            update_user_meta($user_id, '_jobber_client_id', $result);
        }
        
        return $result;
    }
    
    public function get_wp_user_id($jobber_client_id) {
        global $wpdb;
        return $wpdb->get_var($wpdb->prepare(
            "SELECT wp_user_id FROM {$wpdb->prefix}gogreen_jobber_sync WHERE jobber_client_id = %s",
            $jobber_client_id
        ));
    }
    
    public function manual_sync_user($user_id) {
        return $this->sync_new_user_to_jobber($user_id);
    }
}
