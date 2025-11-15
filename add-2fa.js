const fs = require('fs');

let content = fs.readFileSync('inventory-manager-wix.html', 'utf8');

// TOTP implementation code to add before the AUTH_CREDENTIALS
const totpCode = `
        // ==================== TOTP 2FA Implementation ====================

        // Base32 encoding/decoding for TOTP secrets
        const base32 = {
            charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',

            encode: function(buffer) {
                let bits = 0;
                let value = 0;
                let output = '';

                for (let i = 0; i < buffer.length; i++) {
                    value = (value << 8) | buffer[i];
                    bits += 8;

                    while (bits >= 5) {
                        output += this.charset[(value >>> (bits - 5)) & 31];
                        bits -= 5;
                    }
                }

                if (bits > 0) {
                    output += this.charset[(value << (5 - bits)) & 31];
                }

                return output;
            },

            decode: function(str) {
                let bits = 0;
                let value = 0;
                let index = 0;
                const output = new Uint8Array(Math.ceil(str.length * 5 / 8));

                for (let i = 0; i < str.length; i++) {
                    const idx = this.charset.indexOf(str[i].toUpperCase());
                    if (idx === -1) continue;

                    value = (value << 5) | idx;
                    bits += 5;

                    if (bits >= 8) {
                        output[index++] = (value >>> (bits - 8)) & 255;
                        bits -= 8;
                    }
                }

                return output;
            }
        };

        // HMAC-SHA1 implementation
        function hmacSHA1(key, message) {
            const blockSize = 64;

            if (key.length > blockSize) {
                key = sha1(key);
            }

            const keyPadded = new Uint8Array(blockSize);
            keyPadded.set(key);

            const ipad = new Uint8Array(blockSize);
            const opad = new Uint8Array(blockSize);

            for (let i = 0; i < blockSize; i++) {
                ipad[i] = keyPadded[i] ^ 0x36;
                opad[i] = keyPadded[i] ^ 0x5c;
            }

            const innerHash = sha1(concat(ipad, message));
            return sha1(concat(opad, innerHash));
        }

        function sha1(data) {
            const msg = new Uint8Array(data);
            const msgLen = msg.length;
            const bitLen = msgLen * 8;

            const paddedLen = Math.ceil((msgLen + 9) / 64) * 64;
            const padded = new Uint8Array(paddedLen);
            padded.set(msg);
            padded[msgLen] = 0x80;

            const view = new DataView(padded.buffer);
            view.setUint32(paddedLen - 4, bitLen, false);

            let h0 = 0x67452301;
            let h1 = 0xEFCDAB89;
            let h2 = 0x98BADCFE;
            let h3 = 0x10325476;
            let h4 = 0xC3D2E1F0;

            for (let offset = 0; offset < paddedLen; offset += 64) {
                const w = new Array(80);

                for (let i = 0; i < 16; i++) {
                    w[i] = view.getUint32(offset + i * 4, false);
                }

                for (let i = 16; i < 80; i++) {
                    w[i] = rotl(w[i-3] ^ w[i-8] ^ w[i-14] ^ w[i-16], 1);
                }

                let a = h0, b = h1, c = h2, d = h3, e = h4;

                for (let i = 0; i < 80; i++) {
                    let f, k;
                    if (i < 20) {
                        f = (b & c) | ((~b) & d);
                        k = 0x5A827999;
                    } else if (i < 40) {
                        f = b ^ c ^ d;
                        k = 0x6ED9EBA1;
                    } else if (i < 60) {
                        f = (b & c) | (b & d) | (c & d);
                        k = 0x8F1BBCDC;
                    } else {
                        f = b ^ c ^ d;
                        k = 0xCA62C1D6;
                    }

                    const temp = (rotl(a, 5) + f + e + k + w[i]) | 0;
                    e = d;
                    d = c;
                    c = rotl(b, 30);
                    b = a;
                    a = temp;
                }

                h0 = (h0 + a) | 0;
                h1 = (h1 + b) | 0;
                h2 = (h2 + c) | 0;
                h3 = (h3 + d) | 0;
                h4 = (h4 + e) | 0;
            }

            const result = new Uint8Array(20);
            const resultView = new DataView(result.buffer);
            resultView.setUint32(0, h0, false);
            resultView.setUint32(4, h1, false);
            resultView.setUint32(8, h2, false);
            resultView.setUint32(12, h3, false);
            resultView.setUint32(16, h4, false);

            return result;
        }

        function rotl(n, s) {
            return (n << s) | (n >>> (32 - s));
        }

        function concat(a, b) {
            const result = new Uint8Array(a.length + b.length);
            result.set(a);
            result.set(b, a.length);
            return result;
        }

        // Generate TOTP code
        function generateTOTP(secret, timeStep = 30) {
            const epoch = Math.floor(Date.now() / 1000);
            const counter = Math.floor(epoch / timeStep);

            const key = base32.decode(secret);
            const message = new Uint8Array(8);
            const view = new DataView(message.buffer);
            view.setUint32(4, counter, false);

            const hash = hmacSHA1(key, message);
            const offset = hash[19] & 0xf;
            const binary = ((hash[offset] & 0x7f) << 24) |
                          ((hash[offset + 1] & 0xff) << 16) |
                          ((hash[offset + 2] & 0xff) << 8) |
                          (hash[offset + 3] & 0xff);

            const otp = binary % 1000000;
            return otp.toString().padStart(6, '0');
        }

        // Generate random secret for new 2FA setup
        function generateSecret() {
            const buffer = new Uint8Array(20);
            crypto.getRandomValues(buffer);
            return base32.encode(buffer);
        }

        // Generate QR code URL for Microsoft Authenticator
        function generateQRCodeURL(username, secret) {
            const issuer = 'Femi By Jojo';
            const accountName = username + '@FemiByJojo';
            const otpauth = 'otpauth://totp/' + encodeURIComponent(issuer + ':' + accountName) +
                          '?secret=' + secret +
                          '&issuer=' + encodeURIComponent(issuer) +
                          '&algorithm=SHA1&digits=6&period=30';

            // Use Google Charts API to generate QR code
            return 'https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=' + encodeURIComponent(otpauth);
        }

        // Get or create 2FA secret for user
        function get2FASecret(username) {
            const secrets = JSON.parse(localStorage.getItem('totp_secrets') || '{}');

            if (!secrets[username]) {
                secrets[username] = generateSecret();
                localStorage.setItem('totp_secrets', JSON.stringify(secrets));
            }

            return secrets[username];
        }

        // Check if user has completed 2FA setup
        function is2FASetup(username) {
            const setupComplete = JSON.parse(localStorage.getItem('totp_setup_complete') || '{}');
            return setupComplete[username] === true;
        }

        // Mark 2FA setup as complete
        function complete2FASetup(username) {
            const setupComplete = JSON.parse(localStorage.getItem('totp_setup_complete') || '{}');
            setupComplete[username] = true;
            localStorage.setItem('totp_setup_complete', JSON.stringify(setupComplete));
        }

        // Validate TOTP code (with time window tolerance)
        function validateTOTP(secret, userCode) {
            // Check current time window and +/- 1 window for clock drift tolerance
            for (let drift = -1; drift <= 1; drift++) {
                const epoch = Math.floor(Date.now() / 1000) + (drift * 30);
                const counter = Math.floor(epoch / 30);

                const key = base32.decode(secret);
                const message = new Uint8Array(8);
                const view = new DataView(message.buffer);
                view.setUint32(4, counter, false);

                const hash = hmacSHA1(key, message);
                const offset = hash[19] & 0xf;
                const binary = ((hash[offset] & 0x7f) << 24) |
                              ((hash[offset + 1] & 0xff) << 16) |
                              ((hash[offset + 2] & 0xff) << 8) |
                              (hash[offset + 3] & 0xff);

                const otp = (binary % 1000000).toString().padStart(6, '0');

                if (otp === userCode) {
                    return true;
                }
            }

            return false;
        }

        // ==================== End TOTP Implementation ====================
`;

// Find where to insert the TOTP code (before AUTH_CREDENTIALS)
const authCredentialsIndex = content.indexOf('// Authentication System');

if (authCredentialsIndex !== -1) {
    content = content.slice(0, authCredentialsIndex) + totpCode + '\n        ' + content.slice(authCredentialsIndex);

    // Now update the AUTH_CREDENTIALS to include 2FA requirement flag
    const oldAuthArray = /const AUTH_CREDENTIALS = \[[\s\S]*?\];/;
    const newAuthArray = `const AUTH_CREDENTIALS = [
            { username: 'admin', passwordHash: '2eb9771b', requires2FA: true },
            { username: 'Jojo', passwordHash: '29c5f3e4', requires2FA: true },
            { username: 'zooman', passwordHash: '2eb9769f', requires2FA: true }
        ];`;

    content = content.replace(oldAuthArray, newAuthArray);

    fs.writeFileSync('inventory-manager-wix.html', content);
    console.log('✅ TOTP 2FA code added successfully!');
    console.log('Next: Update authentication modal and add 2FA UI');
} else {
    console.log('❌ Could not find AUTH_CREDENTIALS section');
}
