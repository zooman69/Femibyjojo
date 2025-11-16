module.exports = async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { username, timestamp, ipAddress, location } = req.body;

        // Telegram Bot credentials (free, unlimited)
        const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
        const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

        // Check if Telegram is configured
        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
            console.log('Telegram notification skipped - Not configured');
            return res.status(200).json({
                success: false,
                message: 'Telegram notifications not configured'
            });
        }

        // Create message with username, IP, and location
        const message = `🔐 *Femi By Jojo Login Alert*

*Username:* ${username}
*IP Address:* ${ipAddress || 'Unknown'}
*Location:* ${location || 'Unknown'}
*Time:* ${timestamp}

⚠️ If this wasn't you, contact support immediately.`;

        // Send message via Telegram Bot API
        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        const data = await response.json();

        if (data.ok) {
            console.log('Telegram notification sent successfully');
            return res.status(200).json({
                success: true,
                message: 'Telegram notification sent',
                messageId: data.result.message_id
            });
        } else {
            console.error('Telegram error:', data);
            return res.status(500).json({
                success: false,
                error: 'Failed to send Telegram message',
                details: data.description
            });
        }
    } catch (error) {
        console.error('Telegram notification error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
};
