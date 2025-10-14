# GoGreen Jobber Integration

WordPress plugin that integrates seamlessly with Jobber for cleaning business management.

## Features

- Automatic client synchronization between WordPress and Jobber
- Real-time webhook support for job and invoice updates
- User dashboard shortcodes for appointments and invoices
- Booking form integration
- GraphQL API integration with Jobber
- Secure webhook verification

## Installation

1. Upload the plugin to `/wp-content/plugins/gogreen-jobber-integration/`
2. Activate through the WordPress plugins screen
3. Navigate to **Jobber → Settings** to configure

## Configuration

Required settings:
- **Jobber API Key**: Your Bearer token from Jobber
- **Jobber Account ID**: Your Jobber account identifier (optional)
- **Auto Sync Users**: Enable automatic user synchronization

## Shortcodes

### Display User Appointments
```
[jobber_appointments]
```

### Display User Invoices
```
[jobber_invoices]
```

### Display Booking Form
```
[jobber_booking_form]
```

## Webhook Setup

Set up webhooks in Jobber to receive real-time updates:

**Webhook URL**: `https://yourdomain.com/wp-json/gogreen-jobber/v1/webhook`

**Supported Events**:
- job.created
- job.updated
- invoice.created
- invoice.paid
- quote.approved

## Developer Hooks

### Actions

```php
do_action('gogreen_jobber_client_synced', $user_id, $jobber_client_id);
do_action('gogreen_jobber_job_created', $user_id, $job_data);
do_action('gogreen_jobber_job_updated', $user_id, $job_data);
do_action('gogreen_jobber_invoice_created', $user_id, $invoice_data);
do_action('gogreen_jobber_invoice_paid', $user_id, $invoice_data);
```

### Filters

```php
apply_filters('gogreen_jobber_form_field_mapping', $mapping);
apply_filters('gogreen_jobber_sync_user_data', $data, $user_id);
```

## Requirements

- WordPress 5.0 or higher
- PHP 7.4 or higher
- Jobber account with API access
- HTTPS enabled (for webhooks)

## Support

For issues or questions, refer to the main INTEGRATION_SETUP_GUIDE.md

## Version

1.0.0

## License

GPL2
