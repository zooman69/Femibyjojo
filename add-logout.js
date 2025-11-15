const fs = require('fs');

let content = fs.readFileSync('inventory-manager-wix.html', 'utf8');

// Add logout button CSS
const logoutCSS = `
        .logout-btn {
            padding: 8px 16px;
            background: rgba(255, 107, 107, 0.2);
            border: 1px solid rgba(255, 107, 107, 0.5);
            border-radius: 8px;
            color: #ff6b6b;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

        .logout-btn:hover {
            background: rgba(255, 107, 107, 0.3);
            border-color: #ff6b6b;
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        }

        .user-info {
            display: flex;
            align-items: center;
            gap: 10px;
            color: #a0a0a0;
            font-size: 13px;
        }

        .user-name {
            color: #00d9ff;
            font-weight: 600;
        }
`;

// Find the end of the styles section and add logout CSS
const styleEndIndex = content.indexOf('</style>');
if (styleEndIndex !== -1) {
    content = content.slice(0, styleEndIndex) + logoutCSS + '\n    ' + content.slice(styleEndIndex);
}

// Add logout button and user info to header-right
const oldHeaderRight = /<div class="header-right">\s*<div class="wix-status" onclick="openWixSettings\(\)">\s*<span class="status-dot" id="wixStatusDot"><\/span>\s*<span id="wixStatusText">Wix: Not Connected<\/span>\s*<\/div>\s*<\/div>/;

const newHeaderRight = `<div class="header-right">
                    <div class="user-info">
                        <span>Logged in as <span class="user-name" id="currentUser"></span></span>
                        <button class="logout-btn" onclick="logout()">
                            <span>Logout</span>
                        </button>
                    </div>
                    <div class="wix-status" onclick="openWixSettings()">
                        <span class="status-dot" id="wixStatusDot"></span>
                        <span id="wixStatusText">Wix: Not Connected</span>
                    </div>
                </div>`;

if (oldHeaderRight.test(content)) {
    content = content.replace(oldHeaderRight, newHeaderRight);
}

// Add logout function
const logoutFunction = `
        function logout() {
            if (confirm('Are you sure you want to logout?')) {
                // Clear session
                sessionStorage.removeItem('authenticated');
                sessionStorage.removeItem('username');

                // Show auth overlay
                document.getElementById('authOverlay').style.display = 'flex';

                // Reset auth flow
                reset2FAFlow();

                showNotification('Logged out successfully', 'info');
            }
        }

        function updateUserDisplay() {
            const username = sessionStorage.getItem('username');
            if (username) {
                document.getElementById('currentUser').textContent = username;
            }
        }
`;

// Find where to insert the logout function (after reset2FAFlow)
const reset2FAFlowIndex = content.indexOf('function reset2FAFlow()');
if (reset2FAFlowIndex !== -1) {
    // Find the end of reset2FAFlow function
    let braceCount = 0;
    let inFunction = false;
    let endIndex = reset2FAFlowIndex;

    for (let i = reset2FAFlowIndex; i < content.length; i++) {
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

    content = content.slice(0, endIndex) + logoutFunction + content.slice(endIndex);
}

// Update DOMContentLoaded to call updateUserDisplay
const domContentLoadedPattern = /window\.addEventListener\('DOMContentLoaded', async function\(\) \{[\s\S]*?loadWixConfig\(\);/;

const domContentLoadedMatch = content.match(domContentLoadedPattern);
if (domContentLoadedMatch) {
    const oldDOMContentLoaded = domContentLoadedMatch[0];
    const newDOMContentLoaded = oldDOMContentLoaded.replace(
        'loadWixConfig();',
        'loadWixConfig();\n            updateUserDisplay();'
    );
    content = content.replace(oldDOMContentLoaded, newDOMContentLoaded);
}

// Update grantAccess to call updateUserDisplay
const grantAccessPattern = /function grantAccess\(username\) \{[\s\S]*?sessionStorage\.setItem\('username', username\);/;

const grantAccessMatch = content.match(grantAccessPattern);
if (grantAccessMatch) {
    const oldGrantAccess = grantAccessMatch[0];
    const newGrantAccess = oldGrantAccess.replace(
        "sessionStorage.setItem('username', username);",
        "sessionStorage.setItem('username', username);\n\n            // Update user display\n            updateUserDisplay();"
    );
    content = content.replace(oldGrantAccess, newGrantAccess);
}

fs.writeFileSync('inventory-manager-wix.html', content);
console.log('✅ Logout button added successfully!');
console.log('✅ User info display added to header');
console.log('✅ Logout functionality implemented');
