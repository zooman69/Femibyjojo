// Local development server for Femibyjojo Inventory Manager
// Serves static files and handles API routes

const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Import API handlers
const wixProxyHandler = require('./api/wix-proxy.js');
const sendSmsHandler = require('./api/send-sms.js');
const sendTelegramHandler = require('./api/send-telegram.js');

// API route for Wix proxy
app.all('/api/wix-proxy', async (req, res) => {
    await wixProxyHandler(req, res);
});

// API route for SMS notifications (Twilio - paid)
app.all('/api/send-sms', async (req, res) => {
    await sendSmsHandler(req, res);
});

// API route for Telegram notifications (free)
app.all('/api/send-telegram', async (req, res) => {
    await sendTelegramHandler(req, res);
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'inventory-manager-wix.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`\n===========================================`);
    console.log(`  Femibyjojo Inventory Manager`);
    console.log(`===========================================`);
    console.log(`  Server running at: http://localhost:${PORT}`);
    console.log(`  Main app: http://localhost:${PORT}/inventory-manager-wix.html`);
    console.log(`  API endpoint: http://localhost:${PORT}/api/wix-proxy`);
    console.log(`===========================================\n`);
});
