<?php

if (!defined('ABSPATH')) {
    exit;
}

class GoGreen_OpenPhone_Settings {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        add_action('admin_init', array($this, 'register_settings'));
    }
    
    public function register_settings() {
        register_setting('gogreen_openphone_settings', 'gogreen_openphone_api_key');
        register_setting('gogreen_openphone_settings', 'gogreen_openphone_phone_number');
        register_setting('gogreen_openphone_settings', 'gogreen_openphone_enable_widget');
        register_setting('gogreen_openphone_settings', 'gogreen_openphone_enable_sms');
        
        add_settings_section(
            'gogreen_openphone_api_section',
            __('API Settings', 'gogreen-openphone'),
            array($this, 'api_section_callback'),
            'gogreen-openphone-settings'
        );
        
        add_settings_field(
            'gogreen_openphone_api_key',
            __('OpenPhone API Key', 'gogreen-openphone'),
            array($this, 'api_key_field_callback'),
            'gogreen-openphone-settings',
            'gogreen_openphone_api_section'
        );
        
        add_settings_field(
            'gogreen_openphone_phone_number',
            __('Your Phone Number', 'gogreen-openphone'),
            array($this, 'phone_number_field_callback'),
            'gogreen-openphone-settings',
            'gogreen_openphone_api_section'
        );
        
        add_settings_field(
            'gogreen_openphone_enable_widget',
            __('Enable Click-to-Call', 'gogreen-openphone'),
            array($this, 'enable_widget_field_callback'),
            'gogreen-openphone-settings',
            'gogreen_openphone_api_section'
        );
        
        add_settings_field(
            'gogreen_openphone_enable_sms',
            __('Enable SMS Notifications', 'gogreen-openphone'),
            array($this, 'enable_sms_field_callback'),
            'gogreen-openphone-settings',
            'gogreen_openphone_api_section'
        );
    }
    
    public function api_section_callback() {
        echo '<p>' . esc_html__('Configure your OpenPhone API credentials to enable integration.', 'gogreen-openphone') . '</p>';
        echo '<p>' . sprintf(
            esc_html__('Get your API key from your %sOpenPhone Settings%s.', 'gogreen-openphone'),
            '<a href="https://app.openphone.com/settings/api" target="_blank">',
            '</a>'
        ) . '</p>';
    }
    
    public function api_key_field_callback() {
        $value = get_option('gogreen_openphone_api_key');
        echo '<input type="password" name="gogreen_openphone_api_key" value="' . esc_attr($value) . '" class="regular-text" />';
        echo '<p class="description">' . esc_html__('Your OpenPhone API Key', 'gogreen-openphone') . '</p>';
    }
    
    public function phone_number_field_callback() {
        $value = get_option('gogreen_openphone_phone_number');
        echo '<input type="text" name="gogreen_openphone_phone_number" value="' . esc_attr($value) . '" class="regular-text" placeholder="+15551234567" />';
        echo '<p class="description">' . esc_html__('Your OpenPhone number (with country code, e.g., +15551234567)', 'gogreen-openphone') . '</p>';
    }
    
    public function enable_widget_field_callback() {
        $value = get_option('gogreen_openphone_enable_widget', '1');
        echo '<label><input type="checkbox" name="gogreen_openphone_enable_widget" value="1" ' . checked($value, '1', false) . ' /> ';
        echo esc_html__('Display click-to-call button on website', 'gogreen-openphone') . '</label>';
    }
    
    public function enable_sms_field_callback() {
        $value = get_option('gogreen_openphone_enable_sms', '1');
        echo '<label><input type="checkbox" name="gogreen_openphone_enable_sms" value="1" ' . checked($value, '1', false) . ' /> ';
        echo esc_html__('Send automatic SMS notifications for appointments and invoices', 'gogreen-openphone') . '</label>';
    }
}
