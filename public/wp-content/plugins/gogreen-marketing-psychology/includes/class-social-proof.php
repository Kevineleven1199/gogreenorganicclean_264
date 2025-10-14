<?php

if (!defined('ABSPATH')) {
    exit;
}

class GoGreen_Social_Proof {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        if (get_option('gogreen_marketing_social_proof_enabled') === '1') {
            add_action('wp_footer', array($this, 'add_live_activity_notifications'));
            add_action('wp_ajax_gogreen_get_recent_activity', array($this, 'ajax_get_recent_activity'));
            add_action('wp_ajax_nopriv_gogreen_get_recent_activity', array($this, 'ajax_get_recent_activity'));
        }
    }
    
    public function add_live_activity_notifications() {
        if (is_admin() || is_user_logged_in()) {
            return;
        }
        
        include GOGREEN_MARKETING_PLUGIN_DIR . 'templates/live-activity-popup.php';
    }
    
    public function ajax_get_recent_activity() {
        $activities = $this->get_simulated_activities();
        
        if (!empty($activities)) {
            $random_activity = $activities[array_rand($activities)];
            wp_send_json_success($random_activity);
        }
        
        wp_send_json_error();
    }
    
    private function get_simulated_activities() {
        $names = array('Sarah M.', 'John D.', 'Emily R.', 'Michael B.', 'Jessica T.', 'David L.', 'Amanda K.', 'Chris W.');
        $cities = array('Austin', 'Round Rock', 'Cedar Park', 'Pflugerville', 'Georgetown', 'Leander');
        $services = array(
            'Deep Cleaning',
            'Move-In Cleaning',
            'Move-Out Cleaning',
            'Recurring Service',
            'Office Cleaning',
            'Post-Construction Cleaning'
        );
        
        $activities = array();
        for ($i = 0; $i < 10; $i++) {
            $type = rand(1, 3);
            
            switch ($type) {
                case 1:
                    $activities[] = array(
                        'type' => 'booking',
                        'message' => sprintf(
                            '%s from %s just booked a %s',
                            $names[array_rand($names)],
                            $cities[array_rand($cities)],
                            $services[array_rand($services)]
                        ),
                        'time' => rand(5, 45) . ' minutes ago',
                        'icon' => 'calendar'
                    );
                    break;
                    
                case 2:
                    $activities[] = array(
                        'type' => 'review',
                        'message' => sprintf(
                            '%s left a 5-star review',
                            $names[array_rand($names)]
                        ),
                        'time' => rand(1, 6) . ' hours ago',
                        'icon' => 'star'
                    );
                    break;
                    
                case 3:
                    $activities[] = array(
                        'type' => 'viewing',
                        'message' => sprintf(
                            '%d people are viewing this page',
                            rand(3, 12)
                        ),
                        'time' => 'right now',
                        'icon' => 'eye'
                    );
                    break;
            }
        }
        
        return $activities;
    }
    
    public function get_testimonials() {
        return array(
            array(
                'name' => 'Sarah Mitchell',
                'rating' => 5,
                'text' => 'GoGreen transformed my home! The team was professional, thorough, and used eco-friendly products. My family has sensitive allergies and we noticed an immediate improvement.',
                'service' => 'Deep Cleaning',
                'location' => 'Austin, TX',
                'verified' => true
            ),
            array(
                'name' => 'John Davidson',
                'rating' => 5,
                'text' => 'Best cleaning service we\'ve ever used. They\'re reliable, detail-oriented, and always on time. Been using them monthly for over a year.',
                'service' => 'Recurring Service',
                'location' => 'Round Rock, TX',
                'verified' => true
            ),
            array(
                'name' => 'Emily Rodriguez',
                'rating' => 5,
                'text' => 'I was stressed about move-out cleaning, but GoGreen made it effortless. Got my full deposit back thanks to their amazing work!',
                'service' => 'Move-Out Cleaning',
                'location' => 'Cedar Park, TX',
                'verified' => true
            ),
            array(
                'name' => 'Michael Chen',
                'rating' => 5,
                'text' => 'Our office has never looked better. The team is professional and works around our schedule. Highly recommend for commercial cleaning!',
                'service' => 'Office Cleaning',
                'location' => 'Austin, TX',
                'verified' => true
            )
        );
    }
}
