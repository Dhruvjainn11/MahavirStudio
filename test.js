const express = require('express');
const app = express();

app.get('/test', (req, res) => {
  res.send('Test route working!');
});

app.listen(4000, () => console.log('Test server running on port 4000'));
