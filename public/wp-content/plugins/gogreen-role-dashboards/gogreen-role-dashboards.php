<?php
/**
 * Plugin Name: GoGreen Role-Based Dashboards
 * Plugin URI: https://gogreenorganicclean.com
 * Description: Intuitive, role-specific dashboards for admins, cleaners, and clients with mobile-first design.
 * Version: 1.0.0
 * Author: GoGreen Organic Clean
 * Author URI: https://gogreenorganicclean.com
 * License: GPL2
 * Text Domain: gogreen-dashboards
 * Domain Path: /languages
 */

if (!defined('ABSPATH')) {
    exit;
}

define('GOGREEN_DASHBOARDS_VERSION', '1.0.0');
define('GOGREEN_DASHBOARDS_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('GOGREEN_DASHBOARDS_PLUGIN_URL', plugin_dir_url(__FILE__));

require_once GOGREEN_DASHBOARDS_PLUGIN_DIR . 'includes/class-admin-dashboard.php';
require_once GOGREEN_DASHBOARDS_PLUGIN_DIR . 'includes/class-cleaner-dashboard.php';
require_once GOGREEN_DASHBOARDS_PLUGIN_DIR . 'includes/class-client-dashboard.php';
require_once GOGREEN_DASHBOARDS_PLUGIN_DIR . 'includes/class-quick-actions.php';

class GoGreen_Role_Dashboards {
    
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
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
        
        add_action('template_redirect', array($this, 'redirect_to_role_dashboard'));
        
        add_action('admin_bar_menu', array($this, 'customize_admin_bar'), 100);
        
        add_shortcode('client_dashboard', array($this, 'client_dashboard_shortcode'));
        add_shortcode('cleaner_dashboard', array($this, 'cleaner_dashboard_shortcode'));
        add_shortcode('quick_actions', array($this, 'quick_actions_shortcode'));
    }
    
    public function activate() {
        if (!get_role('cleaner')) {
            add_role('cleaner', 'Cleaner', array(
                'read' => true,
                'edit_posts' => false,
                'delete_posts' => false,
            ));
        }
        
        $admin = get_role('administrator');
        if ($admin) {
            $admin->add_cap('manage_cleaners');
            $admin->add_cap('manage_clients');
            $admin->add_cap('view_analytics');
        }
        
        $this->create_dashboard_pages();
        
        flush_rewrite_rules();
    }
    
    private function create_dashboard_pages() {
        $pages = array(
            array(
                'title' => 'Client Dashboard',
                'slug' => 'client-dashboard',
                'content' => '[client_dashboard]',
            ),
            array(
                'title' => 'Cleaner Dashboard',
                'slug' => 'cleaner-dashboard',
                'content' => '[cleaner_dashboard]',
            ),
        );
        
        foreach ($pages as $page_data) {
            $page = get_page_by_path($page_data['slug']);
            if (!$page) {
                wp_insert_post(array(
                    'post_title' => $page_data['title'],
                    'post_name' => $page_data['slug'],
                    'post_content' => $page_data['content'],
                    'post_status' => 'publish',
                    'post_type' => 'page',
                ));
            }
        }
    }
    
    public function init() {
        load_plugin_textdomain('gogreen-dashboards', false, dirname(plugin_basename(__FILE__)) . '/languages');
        
        if (class_exists('GoGreen_Admin_Dashboard')) {
            GoGreen_Admin_Dashboard::get_instance();
        }
        if (class_exists('GoGreen_Cleaner_Dashboard')) {
            GoGreen_Cleaner_Dashboard::get_instance();
        }
        if (class_exists('GoGreen_Client_Dashboard')) {
            GoGreen_Client_Dashboard::get_instance();
        }
        if (class_exists('GoGreen_Quick_Actions')) {
            GoGreen_Quick_Actions::get_instance();
        }
    }
    
    public function enqueue_scripts() {
        if (is_user_logged_in()) {
            wp_enqueue_style('gogreen-dashboards', GOGREEN_DASHBOARDS_PLUGIN_URL . 'assets/css/dashboards.css', array(), GOGREEN_DASHBOARDS_VERSION);
            wp_enqueue_script('gogreen-dashboards', GOGREEN_DASHBOARDS_PLUGIN_URL . 'assets/js/dashboards.js', array('jquery'), GOGREEN_DASHBOARDS_VERSION, true);
            
            wp_localize_script('gogreen-dashboards', 'gogreenDashboards', array(
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('gogreen_dashboards'),
                'userRole' => $this->get_user_primary_role(),
            ));
        }
    }
    
    public function enqueue_admin_scripts($hook) {
        wp_enqueue_style('gogreen-admin-dashboard', GOGREEN_DASHBOARDS_PLUGIN_URL . 'assets/css/admin-dashboard.css', array(), GOGREEN_DASHBOARDS_VERSION);
        wp_enqueue_script('gogreen-admin-dashboard', GOGREEN_DASHBOARDS_PLUGIN_URL . 'assets/js/admin-dashboard.js', array('jquery'), GOGREEN_DASHBOARDS_VERSION, true);
    }
    
    public function redirect_to_role_dashboard() {
        if (!is_user_logged_in() || is_admin()) {
            return;
        }
        
        $user = wp_get_current_user();
        $role = $this->get_user_primary_role();
        
        if (isset($_GET['redirect_to_dashboard']) && $_GET['redirect_to_dashboard'] === '1') {
            switch ($role) {
                case 'cleaner':
                    wp_redirect(home_url('/cleaner-dashboard/'));
                    exit;
                case 'customer':
                case 'subscriber':
                    wp_redirect(home_url('/client-dashboard/'));
                    exit;
            }
        }
    }
    
    public function customize_admin_bar($wp_admin_bar) {
        $role = $this->get_user_primary_role();
        
        $dashboard_url = '';
        $dashboard_title = '';
        
        switch ($role) {
            case 'administrator':
                $dashboard_url = admin_url();
                $dashboard_title = 'Admin Dashboard';
                break;
            case 'cleaner':
                $dashboard_url = home_url('/cleaner-dashboard/');
                $dashboard_title = 'My Dashboard';
                break;
            default:
                $dashboard_url = home_url('/client-dashboard/');
                $dashboard_title = 'My Dashboard';
        }
        
        $wp_admin_bar->add_node(array(
            'id' => 'gogreen-dashboard',
            'title' => $dashboard_title,
            'href' => $dashboard_url,
            'meta' => array('class' => 'gogreen-dashboard-link')
        ));
    }
    
    private function get_user_primary_role() {
        $user = wp_get_current_user();
        return !empty($user->roles) ? $user->roles[0] : 'subscriber';
    }
    
    public function client_dashboard_shortcode() {
        if (!is_user_logged_in()) {
            return '<p>Please <a href="' . wp_login_url(get_permalink()) . '">log in</a> to view your dashboard.</p>';
        }
        
        ob_start();
        include GOGREEN_DASHBOARDS_PLUGIN_DIR . 'templates/client/dashboard.php';
        return ob_get_clean();
    }
    
    public function cleaner_dashboard_shortcode() {
        if (!is_user_logged_in()) {
            return '<p>Please <a href="' . wp_login_url(get_permalink()) . '">log in</a> to view your dashboard.</p>';
        }
        
        $user = wp_get_current_user();
        if (!in_array('cleaner', $user->roles) && !in_array('administrator', $user->roles)) {
            return '<p>Access denied. This page is for cleaning staff only.</p>';
        }
        
        ob_start();
        include GOGREEN_DASHBOARDS_PLUGIN_DIR . 'templates/cleaner/dashboard.php';
        return ob_get_clean();
    }
    
    public function quick_actions_shortcode($atts) {
        $atts = shortcode_atts(array(
            'role' => 'client',
        ), $atts);
        
        ob_start();
        include GOGREEN_DASHBOARDS_PLUGIN_DIR . 'templates/quick-actions.php';
        return ob_get_clean();
    }
}

function gogreen_dashboards() {
    return GoGreen_Role_Dashboards::get_instance();
}

gogreen_dashboards();
