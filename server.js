const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const app = express();

const PORT = process.env.PORT || 5050;

// AliExpress API credentials
const appKey = '512684';
const appSecret = '1Ks2k6EOqIviirghk3gxBFp9vCFgs17';
const accessToken = '50000300c06uKmAmwo1370035aUEeZgWekuhxPf6jiP5sTUcjjtJ0muvjGr6AvIhXnCq';

// Signature generation function
function generateSignature(params, secret) {
    const sortedKeys = Object.keys(params).sort();
    let baseString = secret;
    for (const key of sortedKeys) {
        baseString += key + params[key];
    }
    baseString += secret;

    return crypto.createHash('md5').update(baseString, 'utf8').digest('hex').toUpperCase();
}

// AliExpress products API endpoint
app.get('/products', async (req, res) => {
    const params = {
        app_key: appKey,
        access_token: accessToken,
        sign_method: 'md5',
        timestamp: Date.now().toString(),
        v: '2.0',
        page_no: '1',
        page_size: '10'
    };

    const sign = generateSignature(params, appSecret);
    const query = new URLSearchParams({ ...params, sign }).toString();

    const url = `https://api-sg.aliexpress.com/openapi/param2/2/syncAPI/seller/api/v1/productList/${appKey}?${query}`;

    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message, detail: error.response?.data });
    }
});

// Root route
app.get('/', (req, res) => {
    res.send('AliExpress backend is running and ready!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
