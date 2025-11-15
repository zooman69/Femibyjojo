const fs = require('fs');

let content = fs.readFileSync('inventory-manager-wix.html', 'utf8');

// Find the DOMContentLoaded event listener
const searchPattern = /window\.addEventListener\('DOMContentLoaded', function\(\) \{[\s\S]*?loadWixConfig\(\);[\s\S]*?renderTable\(\);[\s\S]*?\}\);/;

const replacement = `window.addEventListener('DOMContentLoaded', async function() {
            loadWixConfig();
            renderTable();

            // Auto-import from Wix if connected
            if (wixConfig.connected && wixConfig.siteId && wixConfig.apiKey && wixConfig.accountId) {
                console.log('Auto-importing from Wix...');
                showNotification('Auto-importing products from Wix...', 'info');

                // Wait a moment for the UI to render
                setTimeout(async () => {
                    try {
                        await importFromWix();
                    } catch (error) {
                        console.error('Auto-import failed:', error);
                        showNotification('Auto-import failed. Click "Import from Wix" to try again.', 'error');
                    }
                }, 500);
            }
        });`;

if (searchPattern.test(content)) {
    content = content.replace(searchPattern, replacement);
    fs.writeFileSync('inventory-manager-wix.html', content);
    console.log('✅ Auto-import functionality added successfully!');
} else {
    console.log('❌ Could not find the DOMContentLoaded pattern');
    console.log('Looking for specific line...');

    // Try simpler replacement
    const simplePattern = "        window.addEventListener('DOMContentLoaded', function() {\n            loadWixConfig();\n            renderTable();\n        });";

    if (content.includes(simplePattern)) {
        content = content.replace(simplePattern, replacement);
        fs.writeFileSync('inventory-manager-wix.html', content);
        console.log('✅ Auto-import functionality added successfully (simple method)!');
    } else {
        console.log('❌ Simple pattern also not found. Showing last 500 chars:');
        console.log(content.slice(-500));
    }
}
