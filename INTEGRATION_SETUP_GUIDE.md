# GoGreen Organic Clean - Integration Setup Guide

## Overview

This guide will help you set up the Jobber and OpenPhone integrations for your GoGreenOrganicClean website.

## Prerequisites

Before beginning setup, ensure you have:

1. **Jobber Account** with API access
   - Your Jobber API Key (Bearer Token)
   - Your Jobber Account ID
2. **OpenPhone Account** with API access
   - Your OpenPhone API Key
   - Your OpenPhone phone number

## Installation Steps

### 1. Activate Plugins

The following custom plugins have been created and need to be activated:

1. Log into WordPress Admin Dashboard
2. Navigate to **Plugins → Installed Plugins**
3. Activate the following plugins:
   - **GoGreen Jobber Integration**
   - **GoGreen OpenPhone Integration**
   - **GoGreen Admin Dashboard** (optional, for enhanced admin features)

### 2. Configure Jobber Integration

#### A. Get Your Jobber API Credentials

1. Log into your Jobber account
2. Navigate to **Settings → API Tokens**
3. Click **Create New Token**
4. Give it a name (e.g., "WordPress Integration")
5. Copy the generated API key (you won't be able to see it again)

#### B. Configure WordPress Plugin

1. In WordPress Admin, go to **Jobber → Settings**
2. Enter your **Jobber API Key** (Bearer Token)
3. Enter your **Jobber Account ID** (optional)
4. Check **Auto Sync Users** to automatically create Jobber clients from WordPress users
5. Click **Save Changes**

#### C. Test the Connection

1. Go to **Jobber** menu in WordPress admin
2. You should see a connection status
3. If successful, you're ready to go!

#### D. Set Up Webhooks (Important!)

To receive real-time updates from Jobber:

1. Log into Jobber
2. Go to **Settings → Webhooks**
3. Click **Add Webhook**
4. Enter this URL: `https://yourdomain.com/wp-json/gogreen-jobber/v1/webhook`
5. Select the following events:
   - Job Created
   - Job Updated
   - Invoice Created
   - Invoice Paid
   - Quote Approved
6. Copy the webhook secret and save it in WordPress (**Jobber → Settings**)

### 3. Configure OpenPhone Integration

#### A. Get Your OpenPhone API Key

1. Log into OpenPhone at https://app.openphone.com
2. Navigate to **Settings → API**
3. Click **Generate API Key**
4. Copy the API key

#### B. Configure WordPress Plugin

1. In WordPress Admin, go to **OpenPhone** menu
2. Enter your **OpenPhone API Key**
3. Enter your **OpenPhone Phone Number** (with country code, e.g., +15551234567)
4. Check **Enable Click-to-Call** to display the call button on your website
5. Check **Enable SMS Notifications** for automatic SMS alerts
6. Click **Save Changes**

#### C. Test the Integration

1. View your website
2. You should see a green call button in the bottom-right corner
3. Test clicking it from a mobile device

### 4. Add User Dashboard Pages

To enable customers to view their appointments and invoices:

#### A. Create Dashboard Page

1. Go to **Pages → Add New**
2. Title: "My Dashboard"
3. Add the following shortcode:
   ```
   [jobber_appointments]
   ```
4. Publish the page

#### B. Create Invoices Page

1. Go to **Pages → Add New**
2. Title: "My Invoices"
3. Add the following shortcode:
   ```
   [jobber_invoices]
   ```
4. Publish the page

#### C. Create Booking Page

1. Go to **Pages → Add New**
2. Title: "Book Appointment"
3. Add the following shortcode:
   ```
   [jobber_booking_form]
   ```
4. Publish the page

### 5. Configure Ultimate Member Integration

If you're using Ultimate Member for user profiles:

1. Go to **Ultimate Member → Settings → Account**
2. Under "Account Tabs", add custom tabs:
   - **Appointments**: Add tab with content `[jobber_appointments]`
   - **Invoices**: Add tab with content `[jobber_invoices]`
   - **Book Service**: Add tab with content `[jobber_booking_form]`

### 6. Configure Form Integration

To create Jobber clients automatically from form submissions:

#### Option A: Using Forminator (Recommended)

1. Go to **Forminator → Forms**
2. Edit your contact/booking form
3. Go to **Settings → Integrations**
4. Add a **Webhook** integration
5. URL: `https://yourdomain.com/wp-json/gogreen-jobber/v1/form-submission`
6. Map form fields to Jobber fields:
   - `first_name` → First Name field
   - `last_name` → Last Name field
   - `email` → Email field
   - `phone` → Phone field
   - `address` → Address field (if applicable)

#### Option B: Using WPForms

1. Edit your form in **WPForms → All Forms**
2. Go to **Settings → Webhooks**
3. Add webhook URL: `https://yourdomain.com/wp-json/gogreen-jobber/v1/form-submission`
4. Map fields as described above

## Features and Usage

### For Customers (Frontend)

Once logged in, customers can:

1. **View Appointments**
   - See all scheduled cleaning appointments
   - View appointment details and status
   - See assigned technician (if available)

2. **View Invoices**
   - Access all invoices
   - See payment status
   - Download invoices (if Jobber provides links)

3. **Book New Services**
   - Request new appointments
   - Select service type
   - Choose preferred date/time

4. **Receive SMS Notifications**
   - Appointment confirmations
   - Reminders 24 hours before service
   - Invoice notifications
   - Payment confirmations

5. **Click-to-Call**
   - One-tap calling from any device
   - No need to copy/paste phone numbers

### For Administrators (Backend)

Admins can:

1. **Manage Integrations**
   - View connection status
   - Update API credentials
   - Monitor sync logs

2. **Sync Users**
   - Manually sync existing WordPress users to Jobber
   - View sync status for each user
   - Resolve sync conflicts

3. **View Integration Analytics** (coming soon)
   - Track form submissions
   - Monitor appointment bookings
   - Review SMS delivery rates

## Automation Workflows

The integration automatically handles:

1. **New User Registration**
   - WordPress user registered → Jobber client created
   - User data synchronized

2. **Form Submission**
   - Contact form submitted → Jobber client created (if new)
   - Quote request created in Jobber

3. **Appointment Booking**
   - Booking form submitted → Job created in Jobber
   - SMS confirmation sent to customer
   - Calendar event synced

4. **Invoice Creation (from Jobber)**
   - Invoice created in Jobber → Webhook triggered
   - SMS notification sent to customer
   - Customer notified via email

5. **Payment Received (in Jobber)**
   - Payment recorded in Jobber → Webhook triggered
   - SMS thank you sent to customer
   - WordPress user meta updated

## Troubleshooting

### Jobber Integration Issues

**Problem**: "API key not configured" error

**Solution**:
1. Verify API key is entered correctly (no extra spaces)
2. Ensure API key has not been revoked in Jobber
3. Check that API key has necessary permissions

**Problem**: Users not syncing to Jobber

**Solution**:
1. Check that Auto Sync is enabled
2. Verify users have required fields (email, name)
3. Manually sync users from Jobber admin page
4. Check WordPress error logs

**Problem**: Webhooks not working

**Solution**:
1. Verify webhook URL is correct
2. Check webhook secret matches
3. Ensure your site is publicly accessible (not behind firewall)
4. Check Jobber webhook logs for failed deliveries

### OpenPhone Integration Issues

**Problem**: Call button not appearing

**Solution**:
1. Verify "Enable Click-to-Call" is checked
2. Clear browser cache
3. Check that phone number is entered correctly
4. Inspect page source for widget code

**Problem**: SMS not sending

**Solution**:
1. Verify API key is correct
2. Check that "Enable SMS Notifications" is checked
3. Ensure phone numbers are in correct format (+1XXXXXXXXXX)
4. Verify OpenPhone account has SMS credits
5. Check WordPress error logs

## Advanced Configuration

### Custom SMS Templates

You can customize SMS messages by using WordPress filters:

```php
// In your theme's functions.php or custom plugin
add_filter('gogreen_openphone_appointment_confirmation_message', function($message, $user_id, $job_data) {
    // Customize message
    return "Your custom message here";
}, 10, 3);
```

### Additional Webhook Events

To handle additional Jobber webhook events:

```php
add_action('gogreen_jobber_webhook_custom_event', function($data) {
    // Handle custom event
}, 10, 1);
```

### Custom Form Mapping

To customize how form fields map to Jobber:

```php
add_filter('gogreen_jobber_form_field_mapping', function($mapping) {
    $mapping['custom_field'] = 'jobber_field';
    return $mapping;
});
```

## Security Best Practices

1. **Protect API Keys**
   - Never commit API keys to version control
   - Store them only in WordPress database
   - Regularly rotate API keys

2. **Webhook Security**
   - Always verify webhook signatures
   - Use HTTPS for webhook endpoints
   - Monitor webhook logs for suspicious activity

3. **User Data**
   - Comply with privacy regulations (GDPR, CCPA)
   - Only sync necessary user data
   - Provide opt-out options for SMS

## Support

For technical support:
- Check WordPress error logs at `/wp-content/debug.log`
- Review Jobber API documentation: https://developer.getjobber.com
- Review OpenPhone API documentation: https://docs.openphone.com

## Maintenance

### Regular Tasks

1. **Weekly**
   - Check integration connection status
   - Review error logs
   - Verify webhook delivery

2. **Monthly**
   - Update plugins to latest versions
   - Review and rotate API keys if needed
   - Audit user sync status

3. **Quarterly**
   - Review SMS usage and costs
   - Analyze integration performance
   - Update SMS templates based on customer feedback

## Next Steps

After completing the setup:

1. Test the full customer journey:
   - New user registration
   - Appointment booking
   - SMS notifications
   - Invoice viewing

2. Train your team on the new features

3. Update your website content to highlight self-service features

4. Consider implementing additional optimizations from OPTIMIZATION_ANALYSIS.md

5. Monitor usage and gather customer feedback

## Additional Resources

- See `OPTIMIZATION_ANALYSIS.md` for comprehensive website optimization recommendations
- Jobber API Documentation: https://developer.getjobber.com
- OpenPhone API Documentation: https://docs.openphone.com
- WordPress Plugin Development: https://developer.wordpress.org/plugins/

---

**Version**: 1.0.0  
**Last Updated**: 2025-10-14  
**Created by**: Devin for GoGreen Organic Clean
