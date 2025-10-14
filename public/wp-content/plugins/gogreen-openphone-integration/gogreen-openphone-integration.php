<?php
/**
 * Plugin Name: GoGreen OpenPhone Integration
 * Plugin URI: https://gogreenorganicclean.com
 * Description: Integrates WordPress with OpenPhone for click-to-call, SMS notifications, and call logging.
 * Version: 1.0.0
 * Author: GoGreen Organic Clean
 * Author URI: https://gogreenorganicclean.com
 * License: GPL2
 * Text Domain: gogreen-openphone
 * Domain Path: /languages
 */

if (!defined('ABSPATH')) {
    exit;
}

define('GOGREEN_OPENPHONE_VERSION', '1.0.0');
define('GOGREEN_OPENPHONE_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('GOGREEN_OPENPHONE_PLUGIN_URL', plugin_dir_url(__FILE__));

require_once GOGREEN_OPENPHONE_PLUGIN_DIR . 'includes/class-openphone-api.php';
require_once GOGREEN_OPENPHONE_PLUGIN_DIR . 'includes/class-openphone-sms.php';
require_once GOGREEN_OPENPHONE_PLUGIN_DIR . 'admin/class-openphone-settings.php';

class GoGreen_OpenPhone_Integration {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        $this->init_hooks();
    }
    
    private function init_hooks() {
        register_activation_hook(__FILE__, array($this, 'activate'));
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));
        
        add_action('plugins_loaded', array($this, 'init'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('wp_head', array($this, 'add_click_to_call_widget'));
        add_action('wp_footer', array($this, 'add_click_to_call_button'));
    }
    
    public function activate() {
        if (!get_option('gogreen_openphone_api_key')) {
            add_option('gogreen_openphone_api_key', '');
            add_option('gogreen_openphone_phone_number', '');
            add_option('gogreen_openphone_enable_widget', '1');
            add_option('gogreen_openphone_enable_sms', '1');
        }
    }
    
    public function deactivate() {
    }
    
    public function init() {
        load_plugin_textdomain('gogreen-openphone', false, dirname(plugin_basename(__FILE__)) . '/languages');
        
        if (class_exists('GoGreen_OpenPhone_API')) {
            GoGreen_OpenPhone_API::get_instance();
        }
        if (class_exists('GoGreen_OpenPhone_SMS')) {
            GoGreen_OpenPhone_SMS::get_instance();
        }
        if (is_admin() && class_exists('GoGreen_OpenPhone_Settings')) {
            GoGreen_OpenPhone_Settings::get_instance();
        }
    }
    
    public function add_admin_menu() {
        add_menu_page(
            __('OpenPhone Integration', 'gogreen-openphone'),
            __('OpenPhone', 'gogreen-openphone'),
            'manage_options',
            'gogreen-openphone',
            array($this, 'admin_page'),
            'dashicons-phone',
            31
        );
    }
    
    public function admin_page() {
        include GOGREEN_OPENPHONE_PLUGIN_DIR . 'admin/views/settings.php';
    }
    
    public function add_click_to_call_widget() {
        $enabled = get_option('gogreen_openphone_enable_widget', '1');
        $phone_number = get_option('gogreen_openphone_phone_number');
        
        if ($enabled !== '1' || empty($phone_number)) {
            return;
        }
        
        include GOGREEN_OPENPHONE_PLUGIN_DIR . 'templates/click-to-call-widget.php';
    }
    
    public function add_click_to_call_button() {
        $enabled = get_option('gogreen_openphone_enable_widget', '1');
        $phone_number = get_option('gogreen_openphone_phone_number');
        
        if ($enabled !== '1' || empty($phone_number)) {
            return;
        }
        
        include GOGREEN_OPENPHONE_PLUGIN_DIR . 'templates/click-to-call-button.php';
    }
}

function gogreen_openphone() {
    return GoGreen_OpenPhone_Integration::get_instance();
}

gogreen_openphone();
