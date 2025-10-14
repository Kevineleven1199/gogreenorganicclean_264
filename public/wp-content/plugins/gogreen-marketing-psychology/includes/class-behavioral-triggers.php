<?php

if (!defined('ABSPATH')) {
    exit;
}

class GoGreen_Behavioral_Triggers {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        add_filter('the_content', array($this, 'add_anchoring_effect'));
        add_action('woocommerce_after_add_to_cart_button', array($this, 'add_reciprocity_element'));
        add_action('wp_footer', array($this, 'add_fomo_timer'));
    }
    
    public function add_anchoring_effect($content) {
        if (!is_page('pricing') && !is_page('services')) {
            return $content;
        }
        
        $anchoring_box = '
        <div class="gogreen-anchoring-box">
            <div class="gogreen-pricing-comparison">
                <div class="gogreen-price-standard">
                    <span class="gogreen-price-label">Standard Market Rate:</span>
                    <span class="gogreen-price-value gogreen-price-struck">$450</span>
                </div>
                <div class="gogreen-price-ourrate">
                    <span class="gogreen-price-label">Our Rate:</span>
                    <span class="gogreen-price-value gogreen-price-highlight">$350</span>
                    <span class="gogreen-price-savings">Save $100!</span>
                </div>
            </div>
            <p class="gogreen-price-explanation">Most cleaning services charge premium rates. We keep our prices fair by cutting out the middleman and managing our operations efficiently.</p>
        </div>';
        
        return $anchoring_box . $content;
    }
    
    public function add_reciprocity_element() {
        ?>
        <div class="gogreen-reciprocity-box">
            <h4>🎁 Your Free Gift With This Booking:</h4>
            <ul class="gogreen-free-bonuses">
                <li>✓ Free fridge interior cleaning ($25 value)</li>
                <li>✓ Free eco-friendly cleaning tips guide</li>
                <li>✓ 10% off your next service</li>
            </ul>
            <p class="gogreen-reciprocity-note">These bonuses are our thank you for choosing GoGreen!</p>
        </div>
        <?php
    }
    
    public function add_fomo_timer() {
        if (is_admin() || !is_page(array('book-appointment', 'services', 'pricing'))) {
            return;
        }
        
        ?>
        <div class="gogreen-fomo-widget">
            <div class="gogreen-fomo-header">
                <span class="gogreen-fomo-icon">⚡</span>
                <strong>Act Fast!</strong>
            </div>
            <div class="gogreen-fomo-body">
                <p>Only <span class="gogreen-spots-left">3</span> appointment slots left for this week!</p>
                <div class="gogreen-fomo-progress">
                    <div class="gogreen-fomo-progress-bar" style="width: 25%;"></div>
                </div>
                <p class="gogreen-fomo-subtext">
                    <span id="gogreen-viewers-count"><?php echo rand(5, 12); ?></span> people viewing appointments right now
                </p>
            </div>
        </div>
        <?php
    }
    
    public function get_loss_aversion_messages() {
        return array(
            'Don\'t miss out on a cleaner, healthier home',
            'Spots filling fast - secure your preferred time',
            'Your neighbors are already enjoying our service',
            'Limited availability - book before it\'s too late'
        );
    }
    
    public function get_authority_signals() {
        return array(
            array(
                'type' => 'experience',
                'value' => '15+ years',
                'description' => 'Serving the Austin area'
            ),
            array(
                'type' => 'customers',
                'value' => '10,000+',
                'description' => 'Satisfied customers'
            ),
            array(
                'type' => 'cleanings',
                'value' => '50,000+',
                'description' => 'Successful cleanings completed'
            ),
            array(
                'type' => 'rating',
                'value' => '4.9/5',
                'description' => 'Average customer rating'
            )
        );
    }
}
