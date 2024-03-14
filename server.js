const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const hostname = '0.0.0.0'; 

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, hostname, () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});