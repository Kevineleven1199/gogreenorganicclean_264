jQuery(document).ready(function($) {
    
    let exitIntentShown = false;
    let mouseY = 0;
    
    $(document).on('mousemove', function(e) {
        mouseY = e.clientY;
    });
    
    $(document).on('mouseout', function(e) {
        if (!exitIntentShown && mouseY < 50 && e.clientY < 50) {
            showExitIntent();
            exitIntentShown = true;
        }
    });
    
    function showExitIntent() {
        $('#gogreen-exit-popup').fadeIn(300);
        $('body').css('overflow', 'hidden');
    }
    
    $('.gogreen-exit-popup-close, .gogreen-exit-popup-overlay').on('click', function() {
        $('#gogreen-exit-popup').fadeOut(300);
        $('body').css('overflow', 'auto');
    });
    
    $('#gogreen-exit-form').on('submit', function(e) {
        e.preventDefault();
        const email = $(this).find('input[name="email"]').val();
        
        $('.gogreen-exit-popup-body').html(`
            <div style="text-align: center; padding: 40px 20px;">
                <div style="font-size: 64px; color: #10b981; margin-bottom: 20px;">✓</div>
                <h3 style="color: #065f46; margin-bottom: 10px;">Success!</h3>
                <p>Check your email for your exclusive 20% discount code!</p>
                <p style="margin-top: 20px;"><strong>Code: WELCOME20</strong></p>
                <button onclick="jQuery('#gogreen-exit-popup').fadeOut()" style="margin-top: 20px; padding: 12px 30px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Start Booking</button>
            </div>
        `);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'generate_lead', {
                'event_category': 'Exit Intent',
                'event_label': 'Email Captured'
            });
        }
    });
    
    $('.gogreen-urgency-close').on('click', function() {
        $('.gogreen-urgency-banner').slideUp(300);
        localStorage.setItem('gogreenUrgencyBannerClosed', 'true');
    });
    
    if (localStorage.getItem('gogreenUrgencyBannerClosed') === 'true') {
        $('.gogreen-urgency-banner').hide();
    }
    
    let activityShown = false;
    
    function showActivityNotification() {
        if (activityShown) return;
        
        $.ajax({
            url: gogreenMarketing.ajaxUrl,
            type: 'POST',
            data: {
                action: 'gogreen_get_recent_activity',
                nonce: gogreenMarketing.nonce
            },
            success: function(response) {
                if (response.success && response.data) {
                    const activity = response.data;
                    const iconMap = {
                        'calendar': '📅',
                        'star': '⭐',
                        'eye': '👀'
                    };
                    
                    const notification = $(`
                        <div class="gogreen-activity-notification">
                            <div class="gogreen-activity-header">
                                <div class="gogreen-activity-icon">${iconMap[activity.icon]}</div>
                                <div class="gogreen-activity-content">
                                    <div class="gogreen-activity-message">${activity.message}</div>
                                    <div class="gogreen-activity-time">${activity.time}</div>
                                </div>
                            </div>
                        </div>
                    `);
                    
                    $('body').append(notification);
                    
                    setTimeout(function() {
                        notification.addClass('hiding');
                        setTimeout(function() {
                            notification.remove();
                            activityShown = false;
                        }, 500);
                    }, 5000);
                    
                    activityShown = true;
                }
            }
        });
    }
    
    setTimeout(showActivityNotification, 5000);
    
    setInterval(function() {
        const randomDelay = Math.random() * 10000 + 20000;
        setTimeout(showActivityNotification, randomDelay);
    }, 30000);
    
    function updateCountdown() {
        const now = new Date();
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        
        const diff = endOfDay - now;
        
        if (diff > 0) {
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            $('.gogreen-countdown-hours').text(String(hours).padStart(2, '0'));
            $('.gogreen-countdown-minutes').text(String(minutes).padStart(2, '0'));
            $('.gogreen-countdown-seconds').text(String(seconds).padStart(2, '0'));
        }
    }
    
    if ($('.gogreen-countdown').length) {
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
    
    function updateViewerCount() {
        const baseCount = parseInt($('#gogreen-viewers-count').text()) || 5;
        const variation = Math.floor(Math.random() * 5) - 2;
        const newCount = Math.max(3, Math.min(15, baseCount + variation));
        $('#gogreen-viewers-count').text(newCount);
    }
    
    if ($('#gogreen-viewers-count').length) {
        setInterval(updateViewerCount, 15000);
    }
    
    function updateSpotsLeft() {
        const currentSpots = parseInt($('.gogreen-spots-left').text()) || 3;
        if (currentSpots > 1 && Math.random() < 0.3) {
            $('.gogreen-spots-left').text(currentSpots - 1);
            $('.gogreen-fomo-progress-bar').css('width', ((5 - currentSpots + 1) / 5 * 100) + '%');
        }
    }
    
    if ($('.gogreen-spots-left').length) {
        setInterval(updateSpotsLeft, 45000);
    }
    
    $(window).on('scroll', function() {
        const scrollPosition = $(window).scrollTop();
        const windowHeight = $(window).height();
        
        $('.gogreen-guarantee-box').each(function() {
            const elementTop = $(this).offset().top;
            if (scrollPosition + windowHeight > elementTop + 100) {
                $(this).css({
                    'opacity': '1',
                    'transform': 'translateY(0)'
                });
            }
        });
    });
    
    $('.gogreen-guarantee-box').css({
        'opacity': '0',
        'transform': 'translateY(20px)',
        'transition': 'all 0.6s ease-out'
    });
});
