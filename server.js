const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static(__dirname));

// Fallback to index.html for single-page app routing (optional, but good practice)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Lamborghini Prototype Server running at http://localhost:${PORT}`);
});

