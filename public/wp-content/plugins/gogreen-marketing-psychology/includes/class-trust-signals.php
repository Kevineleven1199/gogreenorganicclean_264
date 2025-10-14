<?php

if (!defined('ABSPATH')) {
    exit;
}

class GoGreen_Trust_Signals {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        if (get_option('gogreen_marketing_trust_badges_enabled') === '1') {
            add_action('wp_footer', array($this, 'add_floating_trust_bar'));
            add_shortcode('trust_guarantee', array($this, 'guarantee_box_shortcode'));
        }
    }
    
    public function add_floating_trust_bar() {
        if (is_admin()) {
            return;
        }
        
        ?>
        <div class="gogreen-trust-bar">
            <div class="gogreen-trust-item">
                <span class="gogreen-trust-icon">✓</span>
                <span class="gogreen-trust-text">100% Satisfaction Guaranteed</span>
            </div>
            <div class="gogreen-trust-item">
                <span class="gogreen-trust-icon">🔒</span>
                <span class="gogreen-trust-text">Insured & Bonded</span>
            </div>
            <div class="gogreen-trust-item">
                <span class="gogreen-trust-icon">⭐</span>
                <span class="gogreen-trust-text">500+ 5-Star Reviews</span>
            </div>
            <div class="gogreen-trust-item">
                <span class="gogreen-trust-icon">🌿</span>
                <span class="gogreen-trust-text">Eco-Friendly Products</span>
            </div>
        </div>
        <?php
    }
    
    public function guarantee_box_shortcode() {
        ob_start();
        ?>
        <div class="gogreen-guarantee-box">
            <div class="gogreen-guarantee-seal">
                <div class="gogreen-seal-badge">
                    <span class="gogreen-seal-icon">✓</span>
                    <span class="gogreen-seal-text">100%<br>SATISFACTION</span>
                </div>
            </div>
            <div class="gogreen-guarantee-content">
                <h3>Our Iron-Clad Satisfaction Guarantee</h3>
                <p><strong>Not completely satisfied?</strong> We'll re-clean the area for free within 24 hours.</p>
                <p><strong>Still not happy?</strong> We'll refund your money, no questions asked.</p>
                <p class="gogreen-guarantee-why">We stand behind our work because we're confident you'll love the results!</p>
                <ul class="gogreen-guarantee-features">
                    <li>✓ Background-checked & trained professionals</li>
                    <li>✓ Eco-friendly, family-safe products</li>
                    <li>✓ Fully insured & bonded for your protection</li>
                    <li>✓ Consistent, reliable service every time</li>
                </ul>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
    
    public function get_certifications() {
        return array(
            array(
                'name' => 'Green Business Certified',
                'icon' => '🌿',
                'description' => 'Certified eco-friendly business practices'
            ),
            array(
                'name' => 'Better Business Bureau A+',
                'icon' => '⭐',
                'description' => 'Accredited business with top rating'
            ),
            array(
                'name' => 'Fully Insured & Bonded',
                'icon' => '🔒',
                'description' => '$1M liability coverage for your peace of mind'
            ),
            array(
                'name' => 'Background Checked Staff',
                'icon' => '✓',
                'description' => 'All team members pass rigorous screening'
            )
        );
    }
    
    public function get_money_back_guarantee() {
        return array(
            'headline' => 'Risk-Free 100% Money-Back Guarantee',
            'promise' => 'If you\'re not completely satisfied with our cleaning, we\'ll make it right - or your money back.',
            'terms' => array(
                'Report any issues within 24 hours',
                'We\'ll re-clean the area at no charge',
                'Still not satisfied? Full refund, no questions asked'
            ),
            'validity_period' => '24 hours'
        );
    }
}
