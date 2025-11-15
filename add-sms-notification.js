const fs = require('fs');

let content = fs.readFileSync('inventory-manager-wix.html', 'utf8');

// Add SMS notification function
const smsNotificationFunction = `
        // Send SMS notification on login
        async function sendLoginNotification(username) {
            try {
                const timestamp = new Date().toLocaleString();

                const response = await fetch('/api/send-sms', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: username,
                        timestamp: timestamp
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
        }
`;

// Find where to insert the SMS function (after logout function)
const logoutFunctionIndex = content.indexOf('function logout()');
if (logoutFunctionIndex !== -1) {
    // Find the end of logout function
    let braceCount = 0;
    let inFunction = false;
    let endIndex = logoutFunctionIndex;

    for (let i = logoutFunctionIndex; i < content.length; i++) {
        if (content[i] === '{') {
            inFunction = true;
            braceCount++;
        } else if (content[i] === '}') {
            braceCount--;
            if (inFunction && braceCount === 0) {
                endIndex = i + 1;
                break;
            }
        }
    }

    content = content.slice(0, endIndex) + smsNotificationFunction + content.slice(endIndex);
}

// Update grantAccess function to call sendLoginNotification
const grantAccessPattern = /function grantAccess\(username\) \{([\s\S]*?)showNotification\('Login successful! Welcome back, ' \+ username \+ '\.', 'success'\);/;

const grantAccessMatch = content.match(grantAccessPattern);
if (grantAccessMatch) {
    const oldGrantAccess = grantAccessMatch[0];
    const newGrantAccess = oldGrantAccess.replace(
        "showNotification('Login successful! Welcome back, ' + username + '.', 'success');",
        "showNotification('Login successful! Welcome back, ' + username + '.', 'success');\n\n            // Send login notification SMS\n            sendLoginNotification(username);"
    );
    content = content.replace(oldGrantAccess, newGrantAccess);
}

fs.writeFileSync('inventory-manager-wix.html', content);
console.log('✅ SMS notification functionality added!');
console.log('✅ Login alerts will be sent via SMS when configured');
