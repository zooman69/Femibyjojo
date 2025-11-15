const fs = require('fs');

let content = fs.readFileSync('inventory-manager-wix.html', 'utf8');

// Add CSS for the close button
const notificationCloseCSS = `
        .notification-close {
            position: absolute;
            top: 8px;
            right: 10px;
            background: none;
            border: none;
            color: inherit;
            font-size: 20px;
            font-weight: bold;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.2s;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
        }

        .notification-close:hover {
            opacity: 1;
            transform: none;
            box-shadow: none;
        }

        .notification {
            position: relative;
            padding-right: 45px;
        }
`;

// Find .notification CSS and update it
const notificationCSSPattern = /\.notification \{[\s\S]*?border: 1px solid rgba\(255, 255, 255, 0\.1\);\s*\}/;

const match = content.match(notificationCSSPattern);
if (match) {
    const oldNotificationCSS = match[0];
    const newNotificationCSS = oldNotificationCSS.replace(
        'border: 1px solid rgba(255, 255, 255, 0.1);',
        'border: 1px solid rgba(255, 255, 255, 0.1);\n            position: relative;\n            padding-right: 45px;'
    );

    content = content.replace(oldNotificationCSS, newNotificationCSS + notificationCloseCSS);
}

// Update the showNotification function to include close button
const oldShowNotification = /function showNotification\(message, type = 'info'\) \{[\s\S]*?notification\.className = `notification \$\{type\} show`;[\s\S]*?\}, 5000\);\s*\}/;

const newShowNotification = `function showNotification(message, type = 'info') {
            const notification = document.getElementById('notification');
            notification.innerHTML = message + '<button class="notification-close" onclick="closeNotification()">&times;</button>';
            notification.className = \`notification \${type} show\`;

            // Auto-hide after 5 seconds
            clearTimeout(window.notificationTimeout);
            window.notificationTimeout = setTimeout(() => {
                closeNotification();
            }, 5000);
        }

        function closeNotification() {
            const notification = document.getElementById('notification');
            notification.classList.remove('show');
            clearTimeout(window.notificationTimeout);
        }`;

if (oldShowNotification.test(content)) {
    content = content.replace(oldShowNotification, newShowNotification);
    fs.writeFileSync('inventory-manager-wix.html', content);
    console.log('✅ Notification close button added successfully!');
    console.log('✅ Users can now click the X to dismiss notifications');
} else {
    console.log('❌ Could not find showNotification function');
}
