<?php

if (!defined('ABSPATH')) {
    exit;
}

class GoGreen_Jobber_Admin {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        add_action('admin_init', array($this, 'register_settings'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
    }
    
    public function register_settings() {
        register_setting('gogreen_jobber_settings', 'gogreen_jobber_api_key');
        register_setting('gogreen_jobber_settings', 'gogreen_jobber_account_id');
        register_setting('gogreen_jobber_settings', 'gogreen_jobber_auto_sync');
        
        add_settings_section(
            'gogreen_jobber_api_section',
            __('API Settings', 'gogreen-jobber'),
            array($this, 'api_section_callback'),
            'gogreen-jobber-settings'
        );
        
        add_settings_field(
            'gogreen_jobber_api_key',
            __('Jobber API Key', 'gogreen-jobber'),
            array($this, 'api_key_field_callback'),
            'gogreen-jobber-settings',
            'gogreen_jobber_api_section'
        );
        
        add_settings_field(
            'gogreen_jobber_account_id',
            __('Jobber Account ID', 'gogreen-jobber'),
            array($this, 'account_id_field_callback'),
            'gogreen-jobber-settings',
            'gogreen_jobber_api_section'
        );
        
        add_settings_field(
            'gogreen_jobber_auto_sync',
            __('Auto Sync Users', 'gogreen-jobber'),
            array($this, 'auto_sync_field_callback'),
            'gogreen-jobber-settings',
            'gogreen_jobber_api_section'
        );
    }
    
    public function api_section_callback() {
        echo '<p>' . esc_html__('Configure your Jobber API credentials to enable integration.', 'gogreen-jobber') . '</p>';
        echo '<p>' . sprintf(
            esc_html__('Get your API key from your %sJobber Developer Settings%s.', 'gogreen-jobber'),
            '<a href="https://secure.getjobber.com/settings/api_tokens" target="_blank">',
            '</a>'
        ) . '</p>';
    }
    
    public function api_key_field_callback() {
        $value = get_option('gogreen_jobber_api_key');
        echo '<input type="password" name="gogreen_jobber_api_key" value="' . esc_attr($value) . '" class="regular-text" />';
        echo '<p class="description">' . esc_html__('Your Jobber API Bearer Token', 'gogreen-jobber') . '</p>';
    }
    
    public function account_id_field_callback() {
        $value = get_option('gogreen_jobber_account_id');
        echo '<input type="text" name="gogreen_jobber_account_id" value="' . esc_attr($value) . '" class="regular-text" />';
        echo '<p class="description">' . esc_html__('Your Jobber Account ID (optional)', 'gogreen-jobber') . '</p>';
    }
    
    public function auto_sync_field_callback() {
        $value = get_option('gogreen_jobber_auto_sync', '1');
        echo '<label><input type="checkbox" name="gogreen_jobber_auto_sync" value="1" ' . checked($value, '1', false) . ' /> ';
        echo esc_html__('Automatically sync new WordPress users to Jobber', 'gogreen-jobber') . '</label>';
    }
    
    public function enqueue_admin_scripts($hook) {
        if (strpos($hook, 'gogreen-jobber') === false) {
            return;
        }
        
        wp_enqueue_style('gogreen-jobber-admin', GOGREEN_JOBBER_PLUGIN_URL . 'admin/css/admin.css', array(), GOGREEN_JOBBER_VERSION);
        wp_enqueue_script('gogreen-jobber-admin', GOGREEN_JOBBER_PLUGIN_URL . 'admin/js/admin.js', array('jquery'), GOGREEN_JOBBER_VERSION, true);
        
        wp_localize_script('gogreen-jobber-admin', 'gogreenJobber', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('gogreen_jobber_admin'),
        ));
    }
}
