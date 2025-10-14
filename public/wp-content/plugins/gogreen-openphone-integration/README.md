# GoGreen OpenPhone Integration

WordPress plugin that integrates seamlessly with OpenPhone for business communication.

## Features

- Click-to-call button widget
- Automatic SMS notifications for appointments and invoices
- SMS appointment reminders
- Call logging integration
- Customizable SMS templates
- Phone number formatting

## Installation

1. Upload the plugin to `/wp-content/plugins/gogreen-openphone-integration/`
2. Activate through the WordPress plugins screen
3. Navigate to **OpenPhone** settings to configure

## Configuration

Required settings:
- **OpenPhone API Key**: Your API key from OpenPhone
- **Your Phone Number**: OpenPhone number with country code (e.g., +15551234567)
- **Enable Click-to-Call**: Display call button on website
- **Enable SMS Notifications**: Automatic SMS alerts

## Features

### Click-to-Call Button

A floating call button appears in the bottom-right corner of your website, allowing visitors to call with one click.

### Automatic SMS Notifications

Sends SMS for:
- Appointment confirmations
- Appointment reminders (24 hours before)
- Invoice notifications
- Payment confirmations

### SMS Integration with Jobber

Works seamlessly with the Jobber integration to send notifications based on Jobber events.

## Developer Hooks

### Filters

```php
// Customize appointment confirmation message
add_filter('gogreen_openphone_appointment_confirmation_message', function($message, $user_id, $job_data) {
    return "Your custom message";
}, 10, 3);

// Customize appointment reminder message
add_filter('gogreen_openphone_appointment_reminder_message', function($message, $user_id, $appointment_data) {
    return "Your custom message";
}, 10, 3);

// Customize invoice notification message
add_filter('gogreen_openphone_invoice_notification_message', function($message, $user_id, $invoice_data) {
    return "Your custom message";
}, 10, 3);
```

### Actions

```php
do_action('gogreen_openphone_sms_sent', $user_id, $phone, $message, $result);
do_action('gogreen_openphone_sms_failed', $user_id, $phone, $message, $error);
```

## Styling

The click-to-call button can be customized via CSS:

```css
.gogreen-call-button {
    /* Your custom styles */
}
```

## Requirements

- WordPress 5.0 or higher
- PHP 7.4 or higher
- OpenPhone account with API access
- HTTPS enabled (recommended)

## Privacy & Compliance

- SMS notifications require user opt-in
- Store user consent for SMS communications
- Comply with TCPA regulations
- Provide opt-out mechanism

## Support

For issues or questions, refer to the main INTEGRATION_SETUP_GUIDE.md

## Version

1.0.0

## License

GPL2
