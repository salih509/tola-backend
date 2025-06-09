const express = require('express');
const app = express();

const PORT = process.env.PORT || 5050;

app.get('/', (req, res) => {
    res.send('AliExpress backend is running!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
