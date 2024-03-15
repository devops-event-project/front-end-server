/**
 * This script sets up a basic server using Express.js to serve static files 
 * from a specified directory. It listens for requests on port 3000 and serves 
 * files located in the "public" directory of the application.
 */


const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const hostname = '0.0.0.0'; 

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, hostname, () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});