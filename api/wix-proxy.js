// Vercel Serverless Function to proxy Wix API requests
// This solves CORS issues by making server-side requests to Wix

module.exports = async function handler(req, res) {
    // Enable CORS for your GitHub Pages site
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, wix-site-id, wix-account-id');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const { endpoint, method, body, headers } = req.body;

        if (!endpoint) {
            return res.status(400).json({ error: 'Missing endpoint parameter' });
        }

        // Validate required Wix headers
        const wixSiteId = headers['wix-site-id'];
        const wixAccountId = headers['wix-account-id'];
        const authorization = headers['authorization'];

        if (!wixSiteId || !wixAccountId || !authorization) {
            return res.status(400).json({
                error: 'Missing required Wix headers: wix-site-id, wix-account-id, authorization'
            });
        }

        // Make request to Wix API
        const wixUrl = `https://www.wixapis.com${endpoint}`;

        const response = await fetch(wixUrl, {
            method: method || 'GET',
            headers: {
                'Authorization': authorization,
                'wix-site-id': wixSiteId,
                'wix-account-id': wixAccountId,
                'Content-Type': 'application/json'
            },
            body: body ? JSON.stringify(body) : undefined
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: 'Wix API error',
                status: response.status,
                statusText: response.statusText,
                details: data
            });
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error('Proxy error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}
