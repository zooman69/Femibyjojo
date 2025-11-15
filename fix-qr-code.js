const fs = require('fs');

let content = fs.readFileSync('inventory-manager-wix.html', 'utf8');

// Replace the generateQRCodeURL function with a client-side QR code generator
const oldQRFunction = /function generateQRCodeURL\(username, secret\) \{[\s\S]*?return 'https:\/\/chart\.googleapis\.com\/chart\?chs=200x200&cht=qr&chl=' \+ encodeURIComponent\(otpauth\);\s*\}/;

const newQRFunction = `function generateQRCodeURL(username, secret) {
            const issuer = 'Femi By Jojo';
            const accountName = username + '@FemiByJojo';
            const otpauth = 'otpauth://totp/' + encodeURIComponent(issuer + ':' + accountName) +
                          '?secret=' + secret +
                          '&issuer=' + encodeURIComponent(issuer) +
                          '&algorithm=SHA1&digits=6&period=30';

            // Use QR Server API (free, no API key needed)
            return 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(otpauth);
        }`;

if (oldQRFunction.test(content)) {
    content = content.replace(oldQRFunction, newQRFunction);
    fs.writeFileSync('inventory-manager-wix.html', content);
    console.log('✅ QR code generation fixed!');
    console.log('Now using QR Server API instead of deprecated Google Charts API');
} else {
    console.log('❌ Could not find generateQRCodeURL function');
}
