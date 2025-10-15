<?php
/**
 * Plugin Name: GoGreen AI Scheduling Assistant
 * Plugin URI: https://gogreenorganicclean.com
 * Description: AI-powered automatic scheduling that matches customer requests with cleaner availability via Jobber, OpenPhone, and Pabbly Connect.
 * Version: 1.0.0
 * Author: GoGreen Organic Clean
 * Author URI: https://gogreenorganicclean.com
 * License: GPL2
 * Text Domain: gogreen-ai-scheduler
 * Domain Path: /languages
 */

if (!defined('ABSPATH')) {
    exit;
}

define('GOGREEN_AI_SCHEDULER_VERSION', '1.0.0');
define('GOGREEN_AI_SCHEDULER_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('GOGREEN_AI_SCHEDULER_PLUGIN_URL', plugin_dir_url(__FILE__));

require_once GOGREEN_AI_SCHEDULER_PLUGIN_DIR . 'includes/class-schedule-matcher.php';
require_once GOGREEN_AI_SCHEDULER_PLUGIN_DIR . 'includes/class-pabbly-integration.php';
require_once GOGREEN_AI_SCHEDULER_PLUGIN_DIR . 'includes/class-ai-scheduler.php';
require_once GOGREEN_AI_SCHEDULER_PLUGIN_DIR . 'includes/class-cleaner-confirmation.php';
require_once GOGREEN_AI_SCHEDULER_PLUGIN_DIR . 'includes/class-customer-notification.php';
require_once GOGREEN_AI_SCHEDULER_PLUGIN_DIR . 'admin/class-scheduler-admin.php';

class GoGreen_AI_Scheduler {
    
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
        add_action('plugins_loaded', array($this, 'init'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('rest_api_init', array($this, 'register_rest_routes'));
        
        add_action('gogreen_jobber_quote_requested', array($this, 'handle_quote_request'), 10, 2);
        add_action('forminator_form_after_save_entry', array($this, 'handle_form_submission'), 10, 2);
    }
    
    public function activate() {
        global $wpdb;
        $charset_collate = $wpdb->get_charset_collate();
        
        $sql = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}gogreen_schedule_requests (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            request_type varchar(50) NOT NULL,
            customer_id bigint(20),
            customer_email varchar(255),
            customer_phone varchar(50),
            customer_name varchar(255),
            service_type varchar(100),
            preferred_date datetime,
            preferred_time varchar(50),
            duration_minutes int,
            location_address text,
            location_lat decimal(10,8),
            location_lng decimal(11,8),
            special_instructions text,
            ai_matched_cleaner_id bigint(20),
            ai_suggested_datetime datetime,
            ai_confidence_score decimal(5,2),
            cleaner_status varchar(20) DEFAULT 'pending',
            cleaner_confirmed_at datetime,
            customer_confirmed_at datetime,
            jobber_job_id varchar(100),
            status varchar(20) DEFAULT 'pending',
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY customer_id (customer_id),
            KEY status (status),
            KEY ai_matched_cleaner_id (ai_matched_cleaner_id)
        ) $charset_collate;";
        
        $sql2 = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}gogreen_cleaner_availability (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            cleaner_id bigint(20) NOT NULL,
            day_of_week tinyint NOT NULL,
            start_time time NOT NULL,
            end_time time NOT NULL,
            max_jobs_per_day int DEFAULT 5,
            service_area text,
            is_active tinyint DEFAULT 1,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY cleaner_id (cleaner_id)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
        dbDelta($sql2);
        
        if (!get_option('gogreen_ai_scheduler_enabled')) {
            add_option('gogreen_ai_scheduler_enabled', '1');
            add_option('gogreen_ai_scheduler_pabbly_webhook', '');
            add_option('gogreen_ai_scheduler_auto_confirm_threshold', '90');
            add_option('gogreen_ai_scheduler_buffer_minutes', '30');
        }
    }
    
    public function init() {
        load_plugin_textdomain('gogreen-ai-scheduler', false, dirname(plugin_basename(__FILE__)) . '/languages');
        
        if (class_exists('GoGreen_Schedule_Matcher')) {
            GoGreen_Schedule_Matcher::get_instance();
        }
        if (class_exists('GoGreen_Pabbly_Integration')) {
            GoGreen_Pabbly_Integration::get_instance();
        }
        if (class_exists('GoGreen_AI_Scheduler_Engine')) {
            GoGreen_AI_Scheduler_Engine::get_instance();
        }
        if (class_exists('GoGreen_Cleaner_Confirmation')) {
            GoGreen_Cleaner_Confirmation::get_instance();
        }
        if (class_exists('GoGreen_Customer_Notification')) {
            GoGreen_Customer_Notification::get_instance();
        }
        if (is_admin() && class_exists('GoGreen_Scheduler_Admin')) {
            GoGreen_Scheduler_Admin::get_instance();
        }
    }
    
    public function add_admin_menu() {
        add_menu_page(
            __('AI Scheduler', 'gogreen-ai-scheduler'),
            __('AI Scheduler', 'gogreen-ai-scheduler'),
            'manage_options',
            'gogreen-ai-scheduler',
            array($this, 'admin_page'),
            'dashicons-calendar-alt',
            33
        );
        
        add_submenu_page(
            'gogreen-ai-scheduler',
            __('Pending Requests', 'gogreen-ai-scheduler'),
            __('Pending Requests', 'gogreen-ai-scheduler'),
            'manage_options',
            'gogreen-ai-scheduler-pending',
            array($this, 'pending_requests_page')
        );
        
        add_submenu_page(
            'gogreen-ai-scheduler',
            __('Cleaner Availability', 'gogreen-ai-scheduler'),
            __('Cleaner Availability', 'gogreen-ai-scheduler'),
            'manage_options',
            'gogreen-ai-scheduler-availability',
            array($this, 'availability_page')
        );
    }
    
    public function admin_page() {
        include GOGREEN_AI_SCHEDULER_PLUGIN_DIR . 'admin/views/dashboard.php';
    }
    
    public function pending_requests_page() {
        include GOGREEN_AI_SCHEDULER_PLUGIN_DIR . 'admin/views/pending-requests.php';
    }
    
    public function availability_page() {
        include GOGREEN_AI_SCHEDULER_PLUGIN_DIR . 'admin/views/cleaner-availability.php';
    }
    
    public function register_rest_routes() {
        register_rest_route('gogreen-ai-scheduler/v1', '/pabbly-webhook', array(
            'methods' => 'POST',
            'callback' => array('GoGreen_Pabbly_Integration', 'handle_pabbly_webhook'),
            'permission_callback' => '__return_true',
        ));
        
        register_rest_route('gogreen-ai-scheduler/v1', '/cleaner-confirm/(?P<request_id>\d+)', array(
            'methods' => 'POST',
            'callback' => array('GoGreen_Cleaner_Confirmation', 'handle_confirmation'),
            'permission_callback' => '__return_true',
        ));
        
        register_rest_route('gogreen-ai-scheduler/v1', '/customer-confirm/(?P<request_id>\d+)', array(
            'methods' => 'POST',
            'callback' => array('GoGreen_Customer_Notification', 'handle_customer_confirmation'),
            'permission_callback' => '__return_true',
        ));
    }
    
    public function handle_quote_request($customer_id, $data) {
        if (get_option('gogreen_ai_scheduler_enabled') !== '1') {
            return;
        }
        
        $scheduler = GoGreen_AI_Scheduler_Engine::get_instance();
        $scheduler->process_scheduling_request($data);
    }
    
    public function handle_form_submission($entry_id, $form_id) {
        $form_settings = get_option('gogreen_ai_scheduler_form_' . $form_id);
        if (!$form_settings || $form_settings !== 'enabled') {
            return;
        }
        
        if (get_option('gogreen_ai_scheduler_enabled') !== '1') {
            return;
        }
        
        $entry = Forminator_API::get_entry($form_id, $entry_id);
        if ($entry) {
            $scheduler = GoGreen_AI_Scheduler_Engine::get_instance();
            $scheduler->process_form_scheduling_request($entry);
        }
    }
}

function gogreen_ai_scheduler() {
    return GoGreen_AI_Scheduler::get_instance();
}

gogreen_ai_scheduler();
