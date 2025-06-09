const express = require('express');
const app = express();

// Use Render's assigned port, or 5050 locally
const PORT = process.env.PORT || 5050;

// Homepage route
app.get('/', (req, res) => {
  res.send('AliExpress backend is working and ready!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
