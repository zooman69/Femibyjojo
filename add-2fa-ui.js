const fs = require('fs');

let content = fs.readFileSync('inventory-manager-wix.html', 'utf8');

// Add 2FA-specific CSS styles
const twofaCSS = `
        /* 2FA Specific Styles */
        .auth-step {
            display: none;
        }

        .auth-step.active {
            display: block;
        }

        .qr-code-container {
            text-align: center;
            margin: 20px 0;
        }

        .qr-code-container img {
            border: 3px solid #00d9ff;
            border-radius: 12px;
            padding: 10px;
            background: white;
            margin: 15px 0;
        }

        .secret-key {
            background: #252525;
            padding: 12px;
            border-radius: 8px;
            font-family: monospace;
            font-size: 14px;
            color: #00d9ff;
            word-break: break-all;
            margin: 15px 0;
            border: 1px solid #2a2a2a;
        }

        .instructions {
            text-align: left;
            background: rgba(0, 217, 255, 0.1);
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
            border-left: 3px solid #00d9ff;
        }

        .instructions ol {
            margin: 10px 0 10px 20px;
            color: #a0a0a0;
        }

        .instructions ol li {
            margin: 8px 0;
            line-height: 1.5;
        }

        .auth-form input[type="text"].code-input {
            text-align: center;
            font-size: 24px;
            font-weight: 600;
            letter-spacing: 8px;
            font-family: monospace;
        }

        .auth-subtitle {
            color: #a0a0a0;
            margin: 10px 0;
            font-size: 14px;
        }
`;

// Find the end of existing styles and add 2FA CSS
const styleEndIndex = content.indexOf('</style>');
if (styleEndIndex !== -1) {
    content = content.slice(0, styleEndIndex) + twofaCSS + '\n    ' + content.slice(styleEndIndex);
}

// Replace the authentication modal HTML with multi-step version
const oldAuthModal = /<div id="authOverlay" class="auth-overlay">[\s\S]*?<\/div>\s*<\/div>/;

const newAuthModal = `<div id="authOverlay" class="auth-overlay">
        <div class="auth-modal">
            <img src="https://static.wixstatic.com/media/ca757a_259168483bd74b31b0ca3ea1475b4ed3~mv2.png" alt="Femi By Jojo" class="auth-logo">
            <h2>Femi By Jojo</h2>
            <p>Inventory Manager - Secure Access</p>

            <!-- Step 1: Username & Password -->
            <div id="authStep1" class="auth-step active">
                <form class="auth-form" onsubmit="return checkPasswordAuth(event)">
                    <div class="form-group">
                        <label for="authUsername">Username</label>
                        <input type="text" id="authUsername" required autocomplete="username">
                    </div>
                    <div class="form-group">
                        <label for="authPassword">Password</label>
                        <input type="password" id="authPassword" required autocomplete="current-password">
                    </div>
                    <button type="submit">Continue</button>
                    <div class="auth-error" id="authError">Invalid username or password</div>
                </form>
            </div>

            <!-- Step 2: 2FA Setup (First Time) -->
            <div id="authStep2Setup" class="auth-step">
                <p class="auth-subtitle">Set up Two-Factor Authentication</p>
                <div class="instructions">
                    <ol>
                        <li>Open Microsoft Authenticator on your phone</li>
                        <li>Tap the "+" button to add an account</li>
                        <li>Select "Other account (Google, Facebook, etc.)"</li>
                        <li>Scan the QR code below</li>
                        <li>Enter the 6-digit code shown in the app</li>
                    </ol>
                </div>
                <div class="qr-code-container">
                    <img id="qrCodeImage" src="" alt="QR Code">
                    <div class="secret-key">
                        <strong>Manual Entry Key:</strong><br>
                        <span id="secretKeyDisplay"></span>
                    </div>
                </div>
                <form class="auth-form" onsubmit="return verify2FASetup(event)">
                    <div class="form-group">
                        <label for="setup2FACode">Enter 6-Digit Code</label>
                        <input type="text" id="setup2FACode" class="code-input" maxlength="6" pattern="[0-9]{6}" required autocomplete="off">
                    </div>
                    <button type="submit">Verify & Complete Setup</button>
                    <div class="auth-error" id="setup2FAError">Invalid code. Please try again.</div>
                </form>
            </div>

            <!-- Step 3: 2FA Verification (Every Login) -->
            <div id="authStep3Verify" class="auth-step">
                <p class="auth-subtitle">Two-Factor Authentication Required</p>
                <div class="instructions">
                    <p style="color: #a0a0a0; text-align: center; padding: 10px;">
                        Open Microsoft Authenticator and enter the 6-digit code for <strong id="current2FAUser" style="color: #00d9ff;"></strong>
                    </p>
                </div>
                <form class="auth-form" onsubmit="return verify2FA(event)">
                    <div class="form-group">
                        <label for="verify2FACode">Enter 6-Digit Code</label>
                        <input type="text" id="verify2FACode" class="code-input" maxlength="6" pattern="[0-9]{6}" required autocomplete="off">
                    </div>
                    <button type="submit">Verify</button>
                    <div class="auth-error" id="verify2FAError">Invalid code. Please try again.</div>
                </form>
                <button class="close-modal" onclick="reset2FAFlow()" style="margin-top: 15px; width: 100%;">Back to Login</button>
            </div>
        </div>
    </div>`;

content = content.replace(oldAuthModal, newAuthModal);

// Now update the checkAuth function to support 2FA flow
const oldCheckAuth = /function checkAuth\(event\) \{[\s\S]*?return false;\s*\}/;

const newCheckAuthFunctions = `let currentAuthUser = null;
        let currentAuthUsername = null;

        function checkPasswordAuth(event) {
            event.preventDefault();

            const username = document.getElementById('authUsername').value;
            const password = document.getElementById('authPassword').value;
            const passwordHash = simpleHash(password);

            // Check if credentials match any user
            const validUser = AUTH_CREDENTIALS.find(user =>
                user.username === username && user.passwordHash === passwordHash
            );

            if (validUser) {
                currentAuthUser = validUser;
                currentAuthUsername = username;

                // Check if 2FA is required
                if (validUser.requires2FA) {
                    // Check if user has completed 2FA setup
                    if (is2FASetup(username)) {
                        // Show 2FA verification step
                        show2FAVerification(username);
                    } else {
                        // Show 2FA setup step
                        show2FASetup(username);
                    }
                } else {
                    // No 2FA required, grant access
                    grantAccess(username);
                }

                // Hide error
                document.getElementById('authError').style.display = 'none';
            } else {
                document.getElementById('authError').style.display = 'block';
                document.getElementById('authPassword').value = '';
            }

            return false;
        }

        function show2FASetup(username) {
            // Hide step 1, show step 2
            document.getElementById('authStep1').classList.remove('active');
            document.getElementById('authStep2Setup').classList.add('active');

            // Generate secret and QR code
            const secret = get2FASecret(username);
            const qrURL = generateQRCodeURL(username, secret);

            document.getElementById('qrCodeImage').src = qrURL;
            document.getElementById('secretKeyDisplay').textContent = secret;
            document.getElementById('setup2FACode').value = '';
            document.getElementById('setup2FAError').style.display = 'none';
        }

        function show2FAVerification(username) {
            // Hide step 1, show step 3
            document.getElementById('authStep1').classList.remove('active');
            document.getElementById('authStep3Verify').classList.add('active');

            document.getElementById('current2FAUser').textContent = username;
            document.getElementById('verify2FACode').value = '';
            document.getElementById('verify2FAError').style.display = 'none';

            // Auto-focus the code input
            setTimeout(() => {
                document.getElementById('verify2FACode').focus();
            }, 100);
        }

        function verify2FASetup(event) {
            event.preventDefault();

            const code = document.getElementById('setup2FACode').value;
            const secret = get2FASecret(currentAuthUsername);

            if (validateTOTP(secret, code)) {
                // Mark 2FA setup as complete
                complete2FASetup(currentAuthUsername);

                // Grant access
                grantAccess(currentAuthUsername);

                showNotification('2FA setup completed successfully!', 'success');
            } else {
                document.getElementById('setup2FAError').style.display = 'block';
                document.getElementById('setup2FACode').value = '';
            }

            return false;
        }

        function verify2FA(event) {
            event.preventDefault();

            const code = document.getElementById('verify2FACode').value;
            const secret = get2FASecret(currentAuthUsername);

            if (validateTOTP(secret, code)) {
                // Grant access
                grantAccess(currentAuthUsername);
            } else {
                document.getElementById('verify2FAError').style.display = 'block';
                document.getElementById('verify2FACode').value = '';
            }

            return false;
        }

        function grantAccess(username) {
            // Store authentication in session
            sessionStorage.setItem('authenticated', 'true');
            sessionStorage.setItem('username', username);

            // Hide auth overlay
            document.getElementById('authOverlay').style.display = 'none';

            // Reset to step 1 for next login
            reset2FAFlow();

            showNotification('Login successful! Welcome back, ' + username + '.', 'success');
        }

        function reset2FAFlow() {
            // Show step 1, hide others
            document.getElementById('authStep1').classList.add('active');
            document.getElementById('authStep2Setup').classList.remove('active');
            document.getElementById('authStep3Verify').classList.remove('active');

            // Clear form fields
            document.getElementById('authUsername').value = '';
            document.getElementById('authPassword').value = '';
            document.getElementById('authError').style.display = 'none';

            currentAuthUser = null;
            currentAuthUsername = null;
        }`;

content = content.replace(oldCheckAuth, newCheckAuthFunctions);

fs.writeFileSync('inventory-manager-wix.html', content);
console.log('✅ 2FA UI and authentication flow added successfully!');
console.log('✅ Multi-step authentication with QR code setup implemented!');
