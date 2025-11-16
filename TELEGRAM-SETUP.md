# FREE Telegram Login Notifications Setup

Get instant notifications on your phone whenever someone logs in - completely free, unlimited messages!

## Why Telegram?
- ✅ **100% Free** - No costs, no limits
- ✅ **Unlimited Messages** - Send as many as you want
- ✅ **Instant Delivery** - Notifications arrive in seconds
- ✅ **Works Worldwide** - No carrier restrictions
- ✅ **No Account Required** - Just install the app

## Quick Setup (5 minutes)

### Step 1: Install Telegram
Download Telegram on your phone:
- **iOS**: https://apps.apple.com/app/telegram-messenger/id686449807
- **Android**: https://play.google.com/store/apps/details?id=org.telegram.messenger

### Step 2: Create Your Bot

1. Open Telegram and search for **@BotFather**
2. Start a chat and send: `/newbot`
3. Choose a name: `Femi By Jojo Alerts`
4. Choose a username: `FemiByJojoAlerts_bot` (must end in `bot`)
5. **Copy the Bot Token** - looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`

### Step 3: Get Your Chat ID

1. Search for your new bot in Telegram (`@FemiByJojoAlerts_bot`)
2. Click **START** to activate it
3. Send any message to the bot (like "hello")
4. Open this URL in your browser (replace `YOUR_BOT_TOKEN` with the token from Step 2):
   ```
   https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
   ```
5. Look for `"chat":{"id":` - the number after is your **Chat ID**
   - Example: `"id":123456789` → your Chat ID is `123456789`

### Step 4: Add to Vercel

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add these two variables:
   ```
   TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
   TELEGRAM_CHAT_ID=123456789
   ```
3. **Redeploy** your project

### Step 5: Add to Local (.env)

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add:
   ```
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   TELEGRAM_CHAT_ID=your_chat_id_here
   ```

3. Restart your server

## Test It!

Login to your inventory manager and you'll receive a message like:

```
🔐 Femi By Jojo Login Alert

Username: admin
IP Address: 123.456.789.012
Location: Montreal, Quebec, Canada
Time: 11/15/2025, 7:30:45 PM

⚠️ If this wasn't you, contact support immediately.
```

## Troubleshooting

**Not receiving messages?**
1. Make sure you clicked START in your bot chat
2. Verify your Bot Token and Chat ID are correct
3. Check the Console logs for errors
4. Try sending a test message using the `/getUpdates` URL again

**How to find Chat ID again?**
- Open: `https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates`
- Look for the `"id"` number under `"chat"`

## Security
- Your bot token is like a password - keep it secure
- Only you can receive messages from your bot
- Messages are encrypted by Telegram

## Advanced: Multiple Recipients

Want to send notifications to multiple people?

1. Create a Telegram group
2. Add your bot to the group
3. Make the bot an admin
4. Get the group Chat ID (negative number)
5. Use the group Chat ID instead of your personal Chat ID
