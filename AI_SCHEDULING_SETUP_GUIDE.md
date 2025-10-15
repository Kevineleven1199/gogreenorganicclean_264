# GoGreen AI Scheduling Assistant - Setup Guide

## Overview

The AI Scheduling Assistant automatically matches customer appointment requests with cleaner availability, prompts cleaners to confirm, and notifies customers - all automatically using Jobber, OpenPhone, and Pabbly Connect.

## How It Works (The Magic ✨)

### The Automated Workflow

1. **Customer Requests Appointment**
   - Via website form, phone call to OpenPhone, or Jobber quote request
   
2. **AI Matches with Best Cleaner**
   - Analyzes all cleaners' schedules
   - Considers preferred time, location, workload
   - Calculates confidence score (0-100%)
   
3. **Two Paths Based on Confidence**:

   **Path A: High Confidence (90%+)**
   - Auto-confirms booking
   - Creates job in Jobber
   - SMS to customer: "✅ Confirmed! Date: [X], Cleaner: [Name]"
   - SMS to cleaner: "New job assigned. Check dashboard."
   
   **Path B: Lower Confidence (<90%)**
   - SMS to cleaner: "New match! Confirm or decline: [link]"
   - Cleaner clicks confirm/decline
   - If confirmed → Customer gets SMS confirmation
   - If declined → AI finds next best match automatically

4. **Pabbly Connect Orchestrates Everything**
   - Triggers when events happen
   - Can add custom logic
   - Connects to other tools
   - Sends notifications

5. **24 Hours Before Appointment**
   - Auto-reminder SMS to customer
   - "Reminder: Cleaning tomorrow @ [time]"

## Installation

### Step 1: Upload Plugin via FileZilla

Upload to `/wp-content/plugins/`:
```
gogreen-ai-scheduler/
```

### Step 2: Activate Plugin

1. WordPress Admin → Plugins → Installed Plugins
2. Activate **GoGreen AI Scheduling Assistant**
3. Plugin creates database tables automatically

### Step 3: Configure Settings

Go to **AI Scheduler → Settings**:

1. **Enable AI Scheduling**: ✓ Checked
2. **Auto-Confirm Threshold**: 90 (means 90%+ confidence = auto-confirm)
3. **Buffer Between Jobs**: 30 minutes
4. **Pabbly Webhook URL**: (we'll get this next)

### Step 4: Set Up Pabbly Connect Workflows

#### Create Pabbly Workflows

Pabbly Connect is like Zapier - it connects apps together.

**Workflow 1: New Appointment Request**

1. Log into Pabbly Connect: https://www.pabbly.com/connect/
2. Create New Workflow: "GoGreen - New Booking Request"
3. **Trigger**: Webhook
   - Copy webhook URL
   - Paste in WordPress: AI Scheduler → Settings → Pabbly Webhook URL
4. **Action 1**: Filter (only proceed if event = "scheduling_matched")
5. **Action 2**: Send Email to Admin
   - To: your email
   - Subject: "New Appointment Matched"
   - Body: Include customer name, service, cleaner, confidence
6. **Action 3** (Optional): Update Google Sheets
   - Add row with booking details
7. Save workflow

**Workflow 2: Cleaner Confirmation Needed**

1. Create New Workflow: "GoGreen - Cleaner Confirmation"
2. **Trigger**: Same webhook as above
3. **Action 1**: Filter (event = "cleaner_confirmation_requested")
4. **Action 2**: Send SMS via OpenPhone API
   - Or use Pabbly's SMS integration
   - Message: "New job match! Confirm: [link]"
5. Save workflow

**Workflow 3: Customer Confirmation**

1. Create New Workflow: "GoGreen - Customer Confirmed"
2. **Trigger**: Same webhook
3. **Action 1**: Filter (event = "customer_confirmed")
4. **Action 2**: Update Jobber (add note to job)
5. **Action 3**: Send SMS via OpenPhone
6. **Action 4**: Add to Google Calendar
7. Save workflow

#### Get Your Pabbly Webhook URL

1. In any Pabbly workflow, add Webhook trigger
2. Copy the webhook URL (looks like: `https://connect.pabbly.com/workflow/sendwebhookdata/...`)
3. Paste in WordPress: **AI Scheduler → Settings → Pabbly Webhook URL**

### Step 5: Set Up Cleaner Availability

Go to **AI Scheduler → Cleaner Availability**:

For each cleaner:

1. Click "Add Availability"
2. Select cleaner from dropdown
3. Set weekly schedule:
   - Monday: 8:00 AM - 5:00 PM
   - Tuesday: 8:00 AM - 5:00 PM
   - etc.
4. Set max jobs per day: 5
5. Service area: "Austin, TX" (optional)
6. Save

Repeat for all cleaners.

### Step 6: Configure Forms

If using Forminator for booking forms:

1. Go to **AI Scheduler → Settings → Form Integration**
2. Enable forms you want to trigger AI scheduling
3. Map form fields:
   - Name → customer_name
   - Email → customer_email
   - Phone → customer_phone
   - Service → service_type
   - Preferred Date → preferred_date
   - Preferred Time → preferred_time

### Step 7: Test the System

**Test 1: High Confidence Match**

1. Submit booking form with:
   - Service: Deep Cleaning
   - Date: Tomorrow
   - Time: 9:00 AM
   - (Time when cleaner is definitely available)
2. Check: Should auto-confirm (90%+ confidence)
3. Check SMS sent to customer
4. Check SMS sent to cleaner
5. Check job created in Jobber

**Test 2: Lower Confidence Match**

1. Submit booking with less ideal time
2. Check: Cleaner should receive confirmation SMS
3. Click confirm link in SMS
4. Check: Customer receives confirmation
5. Check: Job created in Jobber

**Test 3: Cleaner Declines**

1. Cleaner clicks "decline" link
2. Check: System finds alternative cleaner
3. Check: Next cleaner receives confirmation request

## How the AI Matching Works

The AI uses a smart scoring algorithm (0-100%):

### Scoring Factors

1. **Preferred Time Match** (+/- points based on how close)
   - Exact match: +0 penalty
   - 1 hour off: -5 points
   - 2 hours off: -10 points
   - etc.

2. **Cleaner Workload** (prefers balanced distribution)
   - 0 jobs that day: +0 penalty
   - 1 job: -5 points
   - 2 jobs: -10 points
   - At max capacity: -50 points

3. **Time of Day Preference** (if customer said "flexible")
   - Morning (8-10 AM): +10 bonus
   - Afternoon: +0
   - Late afternoon: +0

4. **Location** (future enhancement)
   - Nearby existing jobs: +5 points
   - Route optimization

### Confidence Levels

- **90-100%**: Perfect match → Auto-confirm
- **75-89%**: Good match → Request cleaner confirmation
- **60-74%**: Acceptable → Request confirmation + notify admin
- **Below 60%**: Poor match → Alert admin for manual assignment

## Pabbly Connect Use Cases

Since you have Pabbly lifetime, here are powerful automations:

### Basic Automations

1. **Log Everything to Google Sheets**
   - Every booking request
   - Track confidence scores
   - Analyze cleaner utilization

2. **Slack/Discord Notifications**
   - New bookings → #bookings channel
   - Low confidence matches → #admin-alerts

3. **Auto-Follow-Up**
   - 1 hour after booking → "Thanks for booking!"
   - 7 days after → "How was our service? Leave a review"

### Advanced Automations

4. **Dynamic Pricing**
   - High demand times → Trigger price increase email
   - Low booking periods → Send discount offer

5. **Customer Segmentation**
   - First-time customer → Welcome series
   - Repeat customer → Loyalty rewards
   - VIP customer → Premium cleaner assignment

6. **Inventory Management**
   - Before each job → Check supply levels
   - Low supplies → Auto-order from supplier

7. **Review Collection**
   - After job completion → Request Google/Facebook review
   - Positive review → Thank you SMS
   - Negative review → Manager notification

8. **Payroll Integration**
   - End of week → Calculate cleaner hours
   - Send to payroll system
   - Generate pay reports

## OpenPhone Integration

The AI Scheduler sends these SMS messages via OpenPhone:

### To Customers:

1. **Booking Confirmation**
   ```
   Booking Confirmed! ✅
   
   Service: Deep Cleaning
   Date: Mon, Oct 15 @ 9:00am
   Cleaner: Sarah M.
   
   We'll send a reminder 24 hours before.
   
   View details: [link]
   
   Questions? Reply or call us!
   - GoGreen Organic Clean
   ```

2. **24-Hour Reminder**
   ```
   Reminder: Cleaning Tomorrow! 🧹
   
   Service: Deep Cleaning
   Time: 9:00am
   Cleaner: Sarah M.
   
   Please ensure:
   ✓ Clear path to areas
   ✓ Pets secured
   ✓ Access arranged
   
   Need to reschedule? Reply now!
   
   - GoGreen Organic Clean
   ```

### To Cleaners:

1. **Confirmation Request**
   ```
   New job match! 🎯
   
   Customer: John Smith
   Service: Deep Cleaning
   Date: Mon, Oct 15 @ 9:00am
   Duration: 240 min
   Confidence: 85%
   
   Confirm: [link]
   Decline: [link]
   ```

2. **Job Assignment**
   ```
   Job Confirmed! ✅
   
   Customer: John Smith
   Service: Deep Cleaning
   Date: Mon, Oct 15 @ 9:00am
   Address: 123 Main St, Austin
   
   Check your dashboard for details.
   ```

## Admin Dashboard Features

Go to **AI Scheduler** in WordPress admin:

### Dashboard Overview

- **Today's Stats**
  - Pending requests
  - Auto-confirmed bookings
  - Awaiting cleaner confirmation
  - Average confidence score

- **Recent Activity**
  - Last 10 scheduling requests
  - Status of each
  - Confidence scores

### Pending Requests Page

View all requests needing attention:
- Manual assignment needed
- Low confidence matches
- Declined by cleaners
- Actions: Assign manually, reschedule, contact customer

### Cleaner Availability Page

Manage schedules:
- View/edit all cleaner schedules
- See current workload
- Adjust availability
- Set vacation/time off

## Troubleshooting

### Issue: Cleaners Not Getting Matched

**Check:**
1. Cleaner availability is set up correctly
2. Cleaner is marked as "active"
3. Request date/time falls within availability
4. Max jobs per day not exceeded

**Solution:**
- Go to AI Scheduler → Cleaner Availability
- Verify schedule settings
- Check "is_active" checkbox

### Issue: SMS Not Sending

**Check:**
1. OpenPhone plugin activated
2. OpenPhone API key configured
3. Phone numbers in correct format (+1XXXXXXXXXX)
4. OpenPhone account has credits

**Solution:**
- Test OpenPhone integration separately
- Check WordPress error logs
- Verify phone number formats

### Issue: Pabbly Workflows Not Triggering

**Check:**
1. Pabbly webhook URL saved in settings
2. Workflow is "ON" in Pabbly
3. Check Pabbly task history

**Solution:**
- Re-save webhook URL
- Test with manual trigger in Pabbly
- Check WordPress debug.log

### Issue: Auto-Confirm Not Working

**Check:**
1. Confidence threshold setting (default: 90%)
2. Match scores in database
3. "Auto confirm" option enabled

**Solution:**
- Lower threshold temporarily to test (e.g., 75%)
- Check AI Scheduler → Pending Requests for scores
- Review scoring algorithm configuration

## Database Tables

The plugin creates these tables:

### `wp_gogreen_schedule_requests`

Stores all booking requests:
- Customer info
- Service details
- AI match results
- Confirmation status
- Jobber job ID

### `wp_gogreen_cleaner_availability`

Stores cleaner schedules:
- Cleaner ID
- Day of week
- Start/end time
- Max jobs per day
- Service area

## API Endpoints

For Pabbly or external integrations:

### Trigger Scheduling

```
POST /wp-json/gogreen-ai-scheduler/v1/schedule
Content-Type: application/json

{
  "customer_email": "john@example.com",
  "customer_phone": "+15551234567",
  "customer_name": "John Smith",
  "service_type": "Deep Cleaning",
  "preferred_date": "2025-10-20",
  "preferred_time": "09:00",
  "address": "123 Main St, Austin, TX"
}
```

### Cleaner Confirmation

```
POST /wp-json/gogreen-ai-scheduler/v1/cleaner-confirm/123?action=confirm&token=xxx
```

### Customer Confirmation

```
POST /wp-json/gogreen-ai-scheduler/v1/customer-confirm/123?action=confirm
```

## Best Practices

1. **Set Realistic Availability**
   - Account for travel time
   - Leave buffer for unexpected delays
   - Update for holidays/vacations

2. **Monitor Confidence Scores**
   - If consistently low, adjust cleaner schedules
   - Consider hiring more cleaners for peak times

3. **Use Pabbly for Notifications**
   - Admin alerts for important events
   - Daily summary reports
   - Exception handling

4. **Test Regularly**
   - Submit test bookings weekly
   - Verify SMS delivery
   - Check Jobber sync

5. **Review and Optimize**
   - Weekly: Check pending requests
   - Monthly: Analyze match success rate
   - Quarterly: Optimize scheduling algorithm

## Advanced: Custom Scoring

Want to customize the AI matching? Edit the scoring in:
```
/wp-content/plugins/gogreen-ai-scheduler/includes/class-schedule-matcher.php
```

In the `calculate_match_score()` function, you can:
- Adjust time preference weights
- Add location-based scoring
- Prioritize certain cleaners
- Add customer preference matching

## Support & Updates

- Check logs: WordPress Admin → Tools → Site Health → Info → Debug Log
- View scheduling history: AI Scheduler → Pending Requests
- Pabbly task history: Pabbly Connect → Task History

---

**Version**: 1.0.0  
**Last Updated**: 2025-10-14  
**Created by**: Devin for GoGreen Organic Clean

This AI scheduling system will save you hours every week and provide instant responses to your customers!
