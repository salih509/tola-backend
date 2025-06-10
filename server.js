const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5050;

// AliExpress credentials
const appKey = '512684'; // Replace with your real appKey
const appSecret = '1Ks2k6EOqIviirghk3gxBFp9vCFgs17'; // Replace with your real appSecret
const accessToken = '50000300c06uKmAmwo1370035aUEeZgWekuhxPf6jiP5sTUcjjtJ0muvjGr6AvIhXnCq'; // Use your token

// Generate MD5 signature
function generateSign(params, appSecret) {
    // Step 1: Sort parameters
    const sorted = Object.keys(params).sort().map(key => `${key}${params[key]}`).join('');
    
    // Step 2: Concatenate with secret
    const signString = appSecret + sorted + appSecret;

    // Step 3: MD5 hash and toUpperCase
    return crypto.createHash('md5').update(signString).digest('hex').toUpperCase();
}

app.get('/products', async (req, res) => {
    const timestamp = Date.now();

    const params = {
        app_key: appKey,
        access_token: accessToken,
        timestamp: timestamp,
        sign_method: 'md5'
    };

    // Generate signature
    const sign = generateSign(params, appSecret);
    const fullParams = {
        ...params,
        sign: sign
    };

    const queryString = Object.entries(fullParams).map(([k, v]) => `${k}=${v}`).join('&');

    const url = `https://api-sg.aliexpress.com/syncAPI/seller/api/v1/productList?${queryString}`;

    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (err) {
        console.error('API call failed:', err.response?.data || err.message);
        res.status(500).json({ error: err.response?.data || err.message });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
