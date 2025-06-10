const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5050;

const appKey = process.env.APP_KEY; // "512684"
const appSecret = process.env.APP_SECRET; // "your-secret"
const accessToken = process.env.ACCESS_TOKEN; // your token

function generateSignature(params, appSecret) {
  // Sort keys
  const sortedKeys = Object.keys(params).sort();
  let baseString = appSecret;

  for (const key of sortedKeys) {
    baseString += key + params[key];
  }

  baseString += appSecret;

  // SHA256 hash and toUpperCase
  const hash = crypto.createHash('sha256').update(baseString).digest('hex').toUpperCase();
  return hash;
}

app.get('/products', async (req, res) => {
  const timestamp = Date.now();

  const params = {
    app_key: appKey,
    access_token: accessToken,
    timestamp: timestamp,
    sign_method: 'sha256',
  };

  const sign = generateSignature(params, appSecret);

  const query = new URLSearchParams({
    ...params,
    sign,
  }).toString();

  const url = `https://api-sg.aliexpress.com/syncAPI/seller/api/v1/productList?${query}`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message, detail: error.response?.data });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
