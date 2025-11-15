# SMS Login Notifications Setup

This inventory manager now sends SMS text messages to **+1 (514) 886-6846** whenever someone logs in, including:
- Username used
- IP Address
- Location (City, Region, Country)
- Timestamp

## How to Enable SMS Notifications

### Step 1: Create a Twilio Account

1. Go to [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. Sign up for a free account
3. Verify your phone number (+1 514-886-6846)

### Step 2: Get Your Twilio Credentials

After signing up, you'll need three pieces of information from the [Twilio Console](https://console.twilio.com/):

1. **Account SID** - Found on the main dashboard
2. **Auth Token** - Found on the main dashboard (click to reveal)
3. **Twilio Phone Number** - Get a free number from Twilio

### Step 3: Configure on Vercel (for deployment)

1. Go to your Vercel project dashboard
2. Click on **Settings** → **Environment Variables**
3. Add these four environment variables:

```
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+15551234567
NOTIFICATION_PHONE_NUMBER=+15148866846
```

4. **Redeploy** your project for the changes to take effect

### Step 4: Configure Locally (for testing)

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and add your Twilio credentials:
   ```
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_PHONE_NUMBER=+15551234567
   NOTIFICATION_PHONE_NUMBER=+15148866846
   ```

3. Restart your local server

## SMS Message Format

When someone logs in, you'll receive a text message like this:

```
🔐 Femi By Jojo Login Alert

Username: admin
IP Address: 123.456.789.012
Location: Montreal, Quebec, Canada
Time: 11/15/2025, 7:30:45 PM

If this wasn't you, contact support immediately.
```

## Free Tier Limits

Twilio's free trial includes:
- **$15.50 in free credit**
- SMS messages cost approximately **$0.0075 per message** (for US/Canada)
- This gives you about **2,000 free SMS messages**

## Troubleshooting

If SMS notifications aren't working:

1. **Check Console Logs**: Look for "SMS notification sent successfully" or error messages
2. **Verify Twilio Credentials**: Make sure all 4 environment variables are set correctly
3. **Check Phone Number Format**: Must be in E.164 format (e.g., +15148866846)
4. **Verify Phone Number**: For trial accounts, you may need to verify +15148866846 in Twilio
5. **Check Twilio Balance**: Make sure you have credit available

## Security Note

- **Never commit your `.env` file** to Git (it's already in .gitignore)
- Keep your Twilio credentials secure
- The `.env.example` file shows the format but doesn't contain real credentials
