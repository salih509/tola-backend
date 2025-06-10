const express = require('express');
const cors = require('cors');
const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

const { APP_KEY, APP_SECRET, ACCESS_TOKEN } = process.env;
const app = express();
app.use(cors()); // allow calls from Wix frontend

function makeSignature(params) {
  const sorted = Object.keys(params).sort()
    .map(k => `${k}${params[k]}`).join('');
  const base = APP_SECRET + sorted + APP_SECRET;
  return crypto.createHash('md5').update(base).digest('hex').toUpperCase();
}

app.get('/products', async (req, res) => {
  const timestamp = Date.now();
  const params = {
    app_key: APP_KEY,
    access_token: ACCESS_TOKEN,
    timestamp: timestamp,
    sign_method: 'md5',
    // business params:
    page_size: '10',
    page: '1'
  };
  params.sign = makeSignature(params);
  try {
    const url = 'https://api-sg.aliexpress.com/sync?method=aliexpress.seller.product.getList.';  // example
    const { data } = await axios.get(url, { params });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message, detail: e.response?.data });
  }
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server up on port ${PORT}`));
