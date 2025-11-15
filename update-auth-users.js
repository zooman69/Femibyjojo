const fs = require('fs');

// Simple hash function (matching the one in HTML)
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
}

// Calculate hashes for all three users
const users = [
    { username: 'admin', password: 'Air force one 2025!' },
    { username: 'Jojo', password: 'Sweetryder69!' },
    { username: 'zooman', password: 'Air force one 2021!' }
];

console.log('Password hashes:');
users.forEach(user => {
    const hash = simpleHash(user.password);
    console.log(`${user.username}: ${hash}`);
});

// Read the HTML file
let content = fs.readFileSync('inventory-manager-wix.html', 'utf8');

// Find and replace the AUTH_CREDENTIALS section
const oldAuthPattern = /const AUTH_CREDENTIALS = (\{[\s\S]*?\}|\[[\s\S]*?\]);/;

const newAuthCode = `const AUTH_CREDENTIALS = [
            { username: 'admin', passwordHash: '${simpleHash('Air force one 2025!')}' },
            { username: 'Jojo', passwordHash: '${simpleHash('Sweetryder69!')}' },
            { username: 'zooman', passwordHash: '${simpleHash('Air force one 2021!')}' }
        ];`;

if (oldAuthPattern.test(content)) {
    content = content.replace(oldAuthPattern, newAuthCode);

    // Also update the checkAuth function to check against array
    const oldCheckAuth = /function checkAuth\(event\) \{[\s\S]*?const passwordHash = simpleHash\(password\);[\s\S]*?if \(username === AUTH_CREDENTIALS\.username && passwordHash === AUTH_CREDENTIALS\.passwordHash\) \{/;

    const newCheckAuth = `function checkAuth(event) {
            event.preventDefault();

            const username = document.getElementById('authUsername').value;
            const password = document.getElementById('authPassword').value;
            const passwordHash = simpleHash(password);

            // Check if credentials match any user
            const validUser = AUTH_CREDENTIALS.find(user =>
                user.username === username && user.passwordHash === passwordHash
            );

            if (validUser) {`;

    if (oldCheckAuth.test(content)) {
        content = content.replace(oldCheckAuth, newCheckAuth);
        fs.writeFileSync('inventory-manager-wix.html', content);
        console.log('\n✅ Authentication updated with 3 users!');
        console.log('Users: admin, Jojo, zooman');
    } else {
        console.log('❌ Could not find checkAuth function pattern');
    }
} else {
    console.log('❌ Could not find AUTH_CREDENTIALS pattern');
}
