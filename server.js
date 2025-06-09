require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

const APP_KEY = process.env.APP_KEY;
const APP_SECRET = process.env.ALIEXPRESS_APP_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

app.get('/auth/start', (req, res) => {
    const authUrl = `https://oauth.aliexpress.com/authorize?response_type=code&client_id=${APP_KEY}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=start`;
    res.redirect(authUrl);
});

app.get('/auth/redirect', async (req, res) => {
    const { code } = req.query;
    if (!code) {
        return res.status(400).send('No authorization code received.');
    }

    try {
        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('client_id', APP_KEY);
        params.append('client_secret', APP_SECRET);
        params.append('redirect_uri', REDIRECT_URI);

        const response = await axios.post(
            'https://api-sg.aliexpress.com/oauth/token',
            params,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        console.log('✅ Access token received:', response.data);
        res.send(response.data);
    } catch (error) {
        console.error('❌ Token error:', error.response?.data || error.message);
        res.status(500).send('Failed to get token');
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
