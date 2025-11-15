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

        // Twilio credentials (you'll need to set these)
        const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';
        const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
        const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || '';
        const NOTIFICATION_PHONE_NUMBER = process.env.NOTIFICATION_PHONE_NUMBER || '+15148866846'; // Default to your number

        // Check if Twilio is configured
        if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
            console.log('SMS notification skipped - Twilio not configured');
            return res.status(200).json({
                success: false,
                message: 'SMS notifications not configured'
            });
        }

        // Create SMS message with username, IP, and location
        const message = `🔐 Femi By Jojo Login Alert

Username: ${username}
IP Address: ${ipAddress || 'Unknown'}
Location: ${location || 'Unknown'}
Time: ${timestamp}

If this wasn't you, contact support immediately.`;

        // Send SMS via Twilio
        const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');

        const response = await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    To: NOTIFICATION_PHONE_NUMBER,
                    From: TWILIO_PHONE_NUMBER,
                    Body: message
                })
            }
        );

        const data = await response.json();

        if (response.ok) {
            console.log('SMS notification sent successfully:', data.sid);
            return res.status(200).json({
                success: true,
                message: 'SMS notification sent',
                messageId: data.sid
            });
        } else {
            console.error('Twilio error:', data);
            return res.status(500).json({
                success: false,
                error: 'Failed to send SMS',
                details: data.message
            });
        }
    } catch (error) {
        console.error('SMS notification error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
};
