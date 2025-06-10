const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5050;

const APP_KEY = process.env.APP_KEY;
const APP_SECRET = process.env.APP_SECRET;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

function generateSignature(params, appSecret) {
    const sortedKeys = Object.keys(params).sort();
    let baseString = appSecret;

    for (const key of sortedKeys) {
        baseString += key + params[key];
    }
    baseString += appSecret;

    return crypto.createHash('sha256').update(baseString).digest('hex').toUpperCase();
}

app.get('/products', async (req, res) => {
    const timestamp = Date.now().toString();

    const params = {
        app_key: APP_KEY,
        access_token: ACCESS_TOKEN,
        timestamp: timestamp,
        sign_method: 'sha256',
    };

    const signature = generateSignature(params, APP_SECRET);

    const url = `https://api-sg.aliexpress.com/sync?method=api.v1.productList` +
                `&app_key=${APP_KEY}` +
                `&access_token=${ACCESS_TOKEN}` +
                `&timestamp=${timestamp}` +
                `&sign_method=sha256` +
                `&sign=${signature}`;

    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
