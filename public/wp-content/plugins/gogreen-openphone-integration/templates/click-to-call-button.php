<?php
if (!defined('ABSPATH')) {
    exit;
}

$phone_number = get_option('gogreen_openphone_phone_number');
$display_number = str_replace('+1', '', $phone_number);
$display_number = preg_replace('/(\d{3})(\d{3})(\d{4})/', '($1) $2-$3', $display_number);
?>
<style>
.gogreen-call-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    background: #10b981;
    color: white;
    padding: 15px 25px;
    border-radius: 50px;
    text-decoration: none;
    font-weight: bold;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 10px;
}
.gogreen-call-button:hover {
    background: #059669;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
    color: white;
}
.gogreen-call-icon {
    width: 20px;
    height: 20px;
}
@media (max-width: 768px) {
    .gogreen-call-button {
        padding: 12px 20px;
        font-size: 14px;
    }
}
</style>
<a href="tel:<?php echo esc_attr($phone_number); ?>" class="gogreen-call-button">
    <svg class="gogreen-call-icon" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
    </svg>
    <span><?php echo esc_html($display_number); ?></span>
</a>
