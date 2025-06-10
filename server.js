const express = require('express');
const axios = require('axios');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5050;

// AliExpress credentials
const appKey = '512684';
const appSecret = '1Ks2k6EOqIviirghk3gxBFp9vCFgs17';
const accessToken = '50000300c06uKmAmwo1370035aUEeZgWekuhxPf6jiP5sTUcjjtJ0muvjGr6AvIhXnCq';

// Signature generator for OpenAPI
function generateSignature(params) {
    const sortedKeys = Object.keys(params).sort();
    let baseStr = appSecret;
    for (let key of sortedKeys) {
        baseStr += key + params[key];
    }
    baseStr += appSecret;
    return crypto.createHash('md5').update(baseStr, 'utf8').digest('hex').toUpperCase();
}

// Test route
app.get('/', (req, res) => {
    res.send('AliExpress backend is working and ready!');
});

// Fetch product list
app.get('/products', async (req, res) => {
    try {
        const timestamp = Date.now();
        const apiParams = {
            app_key: appKey,
            access_token: accessToken,
            sign_method: 'md5',
            timestamp: timestamp.toString(),
            v: '2.0',
            page_no: '1',
            page_size: '10'
        };

        const sign = generateSignature(apiParams);
        const queryParams = new URLSearchParams({ ...apiParams, sign }).toString();

        // Final endpoint: OpenAPI format
        const url = `https://api-sg.aliexpress.com/openapi/param2/2/syncAPI/seller/api/v1/productList/${appKey}?${queryParams}`;

        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
