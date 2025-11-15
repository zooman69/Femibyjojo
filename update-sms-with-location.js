const fs = require('fs');

let content = fs.readFileSync('inventory-manager-wix.html', 'utf8');

// Find and replace the sendLoginNotification function with enhanced version
const oldSendLoginNotification = /async function sendLoginNotification\(username\) \{[\s\S]*?catch \(error\) \{[\s\S]*?\/\/ Don't show error to user - this is a background operation[\s\S]*?\}\s*\}/;

const newSendLoginNotification = `async function sendLoginNotification(username) {
            try {
                const timestamp = new Date().toLocaleString();

                // Get IP address and location
                let ipAddress = 'Unknown';
                let location = 'Unknown';

                try {
                    // Get IP address from ipify API
                    const ipResponse = await fetch('https://api.ipify.org?format=json');
                    const ipData = await ipResponse.json();
                    ipAddress = ipData.ip;

                    // Get location from ipapi (free tier, 1000 requests/day)
                    const locationResponse = await fetch(\`https://ipapi.co/\${ipAddress}/json/\`);
                    const locationData = await locationResponse.json();

                    if (locationData.city && locationData.region && locationData.country_name) {
                        location = \`\${locationData.city}, \${locationData.region}, \${locationData.country_name}\`;
                    } else if (locationData.country_name) {
                        location = locationData.country_name;
                    }
                } catch (geoError) {
                    console.log('Could not fetch IP/location:', geoError);
                }

                const response = await fetch('/api/send-sms', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: username,
                        timestamp: timestamp,
                        ipAddress: ipAddress,
                        location: location
                    })
                });

                const data = await response.json();

                if (data.success) {
                    console.log('Login SMS notification sent successfully');
                } else {
                    console.log('SMS notification not configured or failed:', data.message);
                }
            } catch (error) {
                console.error('Failed to send SMS notification:', error);
                // Don't show error to user - this is a background operation
            }
        }`;

if (oldSendLoginNotification.test(content)) {
    content = content.replace(oldSendLoginNotification, newSendLoginNotification);
    fs.writeFileSync('inventory-manager-wix.html', content);
    console.log('✅ SMS notification updated with IP address and location!');
    console.log('✅ Notifications will be sent to: +1 (514) 886-6846');
} else {
    console.log('❌ Could not find sendLoginNotification function');
    console.log('Trying alternative pattern...');

    // Try to find it differently
    const altPattern = /\/\/ Send SMS notification on login[\s\S]*?async function sendLoginNotification\(username\) \{[\s\S]*?\}\s*\}/;

    if (altPattern.test(content)) {
        const newCode = `// Send SMS notification on login
        ${newSendLoginNotification}`;

        content = content.replace(altPattern, newCode);
        fs.writeFileSync('inventory-manager-wix.html', content);
        console.log('✅ SMS notification updated with IP address and location (alternative method)!');
    } else {
        console.log('❌ Could not update function');
    }
}
