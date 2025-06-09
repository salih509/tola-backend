const express = require('express');
const axios = require('axios');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5050;

// Your AliExpress API credentials
const appKey = '512684';
const appSecret = '1Ks2k6EOqIviirghk3gxBFp9vCFgs17';
const accessToken = '50000300c06uKmAmwo1370035aUEeZgWekuhxPf6jiP5sTUcjjtJ0muvjGr6AvIhXnCq';

function generateSignature(params) {
    const sortedKeys = Object.keys(params).sort();
    let baseString = appSecret;
    for (let key of sortedKeys) {
        baseString += key + params[key];
    }
    baseString += appSecret;
    return crypto.createHash('md5').update(baseString, 'utf8').digest('hex').toUpperCase();
}

app.get('/', (req, res) => {
    res.send('AliExpress backend is working and ready!');
});

app.get('/products', async (req, res) => {
    try {
        const timestamp = Date.now();
        const apiParams = {
            app_key: appKey,
            method: 'aliexpress.solution.product.list.get',
            sign_method: 'md5',
            timestamp,
            v: '2.0',
            access_token: accessToken,
            page_size: '10',
            page_no: '1'
        };

        const sign = generateSignature(apiParams);
        const url = 'https://api-sg.aliexpress.com/syncAPI/seller/api/v1/productList';

        const query = new URLSearchParams({ ...apiParams, sign }).toString();
        const response = await axios.get(`${url}?${query}`);

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching AliExpress products:', error.message);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
