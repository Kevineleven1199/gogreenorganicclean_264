<?php
/**
 * Plugin Name: GoGreen Marketing Psychology
 * Plugin URI: https://gogreenorganicclean.com
 * Description: Psychological marketing enhancements including social proof, scarcity, urgency, and trust signals to boost conversions.
 * Version: 1.0.0
 * Author: GoGreen Organic Clean
 * Author URI: https://gogreenorganicclean.com
 * License: GPL2
 * Text Domain: gogreen-marketing
 * Domain Path: /languages
 */

if (!defined('ABSPATH')) {
    exit;
}

define('GOGREEN_MARKETING_VERSION', '1.0.0');
define('GOGREEN_MARKETING_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('GOGREEN_MARKETING_PLUGIN_URL', plugin_dir_url(__FILE__));

require_once GOGREEN_MARKETING_PLUGIN_DIR . 'includes/class-social-proof.php';
require_once GOGREEN_MARKETING_PLUGIN_DIR . 'includes/class-scarcity-urgency.php';
require_once GOGREEN_MARKETING_PLUGIN_DIR . 'includes/class-trust-signals.php';
require_once GOGREEN_MARKETING_PLUGIN_DIR . 'includes/class-behavioral-triggers.php';
require_once GOGREEN_MARKETING_PLUGIN_DIR . 'admin/class-marketing-admin.php';

class GoGreen_Marketing_Psychology {
    
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
        add_action('admin_menu', array($this, 'add_admin_menu'));
        
        add_shortcode('social_proof_widget', array($this, 'social_proof_shortcode'));
        add_shortcode('trust_badges', array($this, 'trust_badges_shortcode'));
        add_shortcode('urgency_banner', array($this, 'urgency_banner_shortcode'));
        add_shortcode('recent_bookings', array($this, 'recent_bookings_shortcode'));
    }
    
    public function activate() {
        $defaults = array(
            'gogreen_marketing_social_proof_enabled' => '1',
            'gogreen_marketing_urgency_enabled' => '1',
            'gogreen_marketing_trust_badges_enabled' => '1',
            'gogreen_marketing_recent_bookings_enabled' => '1',
            'gogreen_marketing_color_scheme' => 'green',
        );
        
        foreach ($defaults as $key => $value) {
            if (!get_option($key)) {
                add_option($key, $value);
            }
        }
    }
    
    public function init() {
        load_plugin_textdomain('gogreen-marketing', false, dirname(plugin_basename(__FILE__)) . '/languages');
        
        if (class_exists('GoGreen_Social_Proof')) {
            GoGreen_Social_Proof::get_instance();
        }
        if (class_exists('GoGreen_Scarcity_Urgency')) {
            GoGreen_Scarcity_Urgency::get_instance();
        }
        if (class_exists('GoGreen_Trust_Signals')) {
            GoGreen_Trust_Signals::get_instance();
        }
        if (class_exists('GoGreen_Behavioral_Triggers')) {
            GoGreen_Behavioral_Triggers::get_instance();
        }
        if (is_admin() && class_exists('GoGreen_Marketing_Admin')) {
            GoGreen_Marketing_Admin::get_instance();
        }
    }
    
    public function enqueue_scripts() {
        wp_enqueue_style('gogreen-marketing', GOGREEN_MARKETING_PLUGIN_URL . 'public/css/marketing.css', array(), GOGREEN_MARKETING_VERSION);
        wp_enqueue_script('gogreen-marketing', GOGREEN_MARKETING_PLUGIN_URL . 'public/js/marketing.js', array('jquery'), GOGREEN_MARKETING_VERSION, true);
        
        wp_localize_script('gogreen-marketing', 'gogreenMarketing', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('gogreen_marketing'),
            'colorScheme' => get_option('gogreen_marketing_color_scheme', 'green'),
        ));
    }
    
    public function add_admin_menu() {
        add_menu_page(
            __('Marketing Psychology', 'gogreen-marketing'),
            __('Marketing', 'gogreen-marketing'),
            'manage_options',
            'gogreen-marketing',
            array($this, 'admin_page'),
            'dashicons-chart-line',
            32
        );
    }
    
    public function admin_page() {
        include GOGREEN_MARKETING_PLUGIN_DIR . 'admin/views/dashboard.php';
    }
    
    public function social_proof_shortcode($atts) {
        $atts = shortcode_atts(array(
            'type' => 'reviews',
        ), $atts);
        
        ob_start();
        include GOGREEN_MARKETING_PLUGIN_DIR . 'templates/social-proof.php';
        return ob_get_clean();
    }
    
    public function trust_badges_shortcode($atts) {
        ob_start();
        include GOGREEN_MARKETING_PLUGIN_DIR . 'templates/trust-badges.php';
        return ob_get_clean();
    }
    
    public function urgency_banner_shortcode($atts) {
        $atts = shortcode_atts(array(
            'message' => 'Limited Time: Book Today & Save 15%!',
            'expires' => '',
        ), $atts);
        
        ob_start();
        include GOGREEN_MARKETING_PLUGIN_DIR . 'templates/urgency-banner.php';
        return ob_get_clean();
    }
    
    public function recent_bookings_shortcode($atts) {
        ob_start();
        include GOGREEN_MARKETING_PLUGIN_DIR . 'templates/recent-bookings.php';
        return ob_get_clean();
    }
}

function gogreen_marketing() {
    return GoGreen_Marketing_Psychology::get_instance();
}

gogreen_marketing();
