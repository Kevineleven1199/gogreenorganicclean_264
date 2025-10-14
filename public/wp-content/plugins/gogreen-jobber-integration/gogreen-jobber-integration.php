<?php
/**
 * Plugin Name: GoGreen Jobber Integration
 * Plugin URI: https://gogreenorganicclean.com
 * Description: Integrates WordPress with Jobber for seamless appointment booking, client management, and invoicing.
 * Version: 1.0.0
 * Author: GoGreen Organic Clean
 * Author URI: https://gogreenorganicclean.com
 * License: GPL2
 * Text Domain: gogreen-jobber
 * Domain Path: /languages
 */

if (!defined('ABSPATH')) {
    exit;
}

define('GOGREEN_JOBBER_VERSION', '1.0.0');
define('GOGREEN_JOBBER_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('GOGREEN_JOBBER_PLUGIN_URL', plugin_dir_url(__FILE__));

require_once GOGREEN_JOBBER_PLUGIN_DIR . 'includes/class-jobber-api.php';
require_once GOGREEN_JOBBER_PLUGIN_DIR . 'includes/class-jobber-sync.php';
require_once GOGREEN_JOBBER_PLUGIN_DIR . 'includes/class-jobber-webhooks.php';
require_once GOGREEN_JOBBER_PLUGIN_DIR . 'admin/class-jobber-admin.php';
require_once GOGREEN_JOBBER_PLUGIN_DIR . 'public/class-jobber-frontend.php';

class GoGreen_Jobber_Integration {
    
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
        add_action('rest_api_init', array($this, 'register_rest_routes'));
    }
    
    public function activate() {
        if (!get_option('gogreen_jobber_api_key')) {
            add_option('gogreen_jobber_api_key', '');
            add_option('gogreen_jobber_account_id', '');
            add_option('gogreen_jobber_webhook_secret', wp_generate_password(32, false));
        }
        
        global $wpdb;
        $charset_collate = $wpdb->get_charset_collate();
        
        $sql = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}gogreen_jobber_sync (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            wp_user_id bigint(20) NOT NULL,
            jobber_client_id varchar(100) NOT NULL,
            last_sync datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            sync_status varchar(20) DEFAULT 'active',
            PRIMARY KEY  (id),
            UNIQUE KEY wp_user_id (wp_user_id),
            UNIQUE KEY jobber_client_id (jobber_client_id)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
        
        flush_rewrite_rules();
    }
    
    public function deactivate() {
        flush_rewrite_rules();
    }
    
    public function init() {
        load_plugin_textdomain('gogreen-jobber', false, dirname(plugin_basename(__FILE__)) . '/languages');
        
        if (class_exists('GoGreen_Jobber_API')) {
            GoGreen_Jobber_API::get_instance();
        }
        if (class_exists('GoGreen_Jobber_Sync')) {
            GoGreen_Jobber_Sync::get_instance();
        }
        if (class_exists('GoGreen_Jobber_Webhooks')) {
            GoGreen_Jobber_Webhooks::get_instance();
        }
        if (is_admin() && class_exists('GoGreen_Jobber_Admin')) {
            GoGreen_Jobber_Admin::get_instance();
        }
        if (!is_admin() && class_exists('GoGreen_Jobber_Frontend')) {
            GoGreen_Jobber_Frontend::get_instance();
        }
    }
    
    public function add_admin_menu() {
        add_menu_page(
            __('Jobber Integration', 'gogreen-jobber'),
            __('Jobber', 'gogreen-jobber'),
            'manage_options',
            'gogreen-jobber',
            array($this, 'admin_page'),
            'dashicons-calendar-alt',
            30
        );
        
        add_submenu_page(
            'gogreen-jobber',
            __('Settings', 'gogreen-jobber'),
            __('Settings', 'gogreen-jobber'),
            'manage_options',
            'gogreen-jobber-settings',
            array($this, 'settings_page')
        );
    }
    
    public function admin_page() {
        include GOGREEN_JOBBER_PLUGIN_DIR . 'admin/views/dashboard.php';
    }
    
    public function settings_page() {
        include GOGREEN_JOBBER_PLUGIN_DIR . 'admin/views/settings.php';
    }
    
    public function register_rest_routes() {
        register_rest_route('gogreen-jobber/v1', '/webhook', array(
            'methods' => 'POST',
            'callback' => array('GoGreen_Jobber_Webhooks', 'handle_webhook'),
            'permission_callback' => array('GoGreen_Jobber_Webhooks', 'verify_webhook'),
        ));
    }
}

function gogreen_jobber() {
    return GoGreen_Jobber_Integration::get_instance();
}

gogreen_jobber();
