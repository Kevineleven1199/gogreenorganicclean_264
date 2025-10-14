<?php

if (!defined('ABSPATH')) {
    exit;
}

class GoGreen_Scarcity_Urgency {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        if (get_option('gogreen_marketing_urgency_enabled') === '1') {
            add_action('wp_head', array($this, 'add_urgency_banner'));
            add_action('wp_footer', array($this, 'add_exit_intent_popup'));
            add_filter('the_content', array($this, 'add_scarcity_elements'));
        }
    }
    
    public function add_urgency_banner() {
        if (is_admin() || !is_front_page()) {
            return;
        }
        
        $urgency_messages = array(
            array(
                'message' => '⏰ Limited Slots: Only 3 appointments left this week!',
                'type' => 'scarcity',
                'cta' => 'Book Now',
                'link' => '/book-appointment/'
            ),
            array(
                'message' => '🎉 New Customer Special: 15% Off Your First Deep Clean - Expires in 48 Hours!',
                'type' => 'urgency',
                'cta' => 'Claim Offer',
                'link' => '/book-appointment/'
            ),
            array(
                'message' => '🌟 Spring Cleaning Special: Book 3 Sessions, Get 1 Free - Limited Time!',
                'type' => 'promotion',
                'cta' => 'Learn More',
                'link' => '/services/'
            )
        );
        
        $current_message = $urgency_messages[array_rand($urgency_messages)];
        
        ?>
        <div id="gogreen-urgency-banner" class="gogreen-urgency-banner" data-type="<?php echo esc_attr($current_message['type']); ?>">
            <div class="gogreen-urgency-content">
                <span class="gogreen-urgency-message"><?php echo esc_html($current_message['message']); ?></span>
                <a href="<?php echo esc_url($current_message['link']); ?>" class="gogreen-urgency-cta">
                    <?php echo esc_html($current_message['cta']); ?>
                </a>
                <button class="gogreen-urgency-close" aria-label="Close">×</button>
            </div>
        </div>
        <?php
    }
    
    public function add_exit_intent_popup() {
        if (is_admin() || is_user_logged_in()) {
            return;
        }
        
        ?>
        <div id="gogreen-exit-popup" class="gogreen-exit-popup" style="display: none;">
            <div class="gogreen-exit-popup-overlay"></div>
            <div class="gogreen-exit-popup-content">
                <button class="gogreen-exit-popup-close">×</button>
                <div class="gogreen-exit-popup-header">
                    <h2>Wait! Don't Leave Without Your Special Offer! 🎁</h2>
                </div>
                <div class="gogreen-exit-popup-body">
                    <p class="gogreen-exit-headline">Get <strong>20% OFF</strong> your first cleaning service!</p>
                    <ul class="gogreen-exit-benefits">
                        <li>✓ Eco-friendly, non-toxic products</li>
                        <li>✓ Satisfaction guaranteed or re-clean for free</li>
                        <li>✓ Background-checked, insured team</li>
                        <li>✓ Same-day booking available</li>
                    </ul>
                    <form class="gogreen-exit-form" id="gogreen-exit-form">
                        <input type="email" name="email" placeholder="Enter your email" required class="gogreen-exit-input">
                        <button type="submit" class="gogreen-exit-submit">Claim My 20% Discount</button>
                    </form>
                    <p class="gogreen-exit-disclaimer">Limited time offer. New customers only. Check your email for discount code.</p>
                    <div class="gogreen-exit-trust">
                        <span>🔒 100% Secure & Spam-Free</span>
                        <span>⭐ 500+ Five-Star Reviews</span>
                    </div>
                </div>
            </div>
        </div>
        <?php
    }
    
    public function add_scarcity_elements($content) {
        if (!is_singular() || is_admin()) {
            return $content;
        }
        
        $scarcity_box = '
        <div class="gogreen-scarcity-box">
            <div class="gogreen-scarcity-icon">🔥</div>
            <div class="gogreen-scarcity-content">
                <h4>High Demand Alert!</h4>
                <p><strong>' . rand(8, 15) . ' people</strong> are viewing our services right now. Book soon to secure your preferred time slot!</p>
                <div class="gogreen-scarcity-timer">
                    <span class="gogreen-timer-label">Available slots decrease in:</span>
                    <div class="gogreen-countdown">
                        <span class="gogreen-countdown-hours">02</span>:
                        <span class="gogreen-countdown-minutes">47</span>:
                        <span class="gogreen-countdown-seconds">35</span>
                    </div>
                </div>
            </div>
        </div>';
        
        return $content . $scarcity_box;
    }
    
    public function get_limited_time_offers() {
        return array(
            array(
                'title' => 'New Customer Special',
                'discount' => '20%',
                'expires' => strtotime('+3 days'),
                'description' => 'First-time customers save 20% on any deep cleaning service',
                'code' => 'WELCOME20'
            ),
            array(
                'title' => 'Refer-a-Friend Bonus',
                'discount' => '$50',
                'description' => 'You get $50 off, they get $50 off when they book',
                'ongoing' => true
            ),
            array(
                'title' => 'Recurring Service Discount',
                'discount' => '15%',
                'description' => 'Save 15% when you schedule weekly or bi-weekly service',
                'ongoing' => true
            )
        );
    }
}
