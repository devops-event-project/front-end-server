const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const hostname = '0.0.0.0'; 

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', (req, res) => {
//     // Construct the absolute path to the file
//     const filePath = path.join(__dirname, 'public', 'index.html');
//     // Send the file
//     res.sendFile(filePath);
// });

// const http = require('http');
// const fs = require('fs');
// const path = require('path');

// const hostname = '0.0.0.0'; 
// const port = 3000;

// const app = http.createServer((req, res) => {
//     // Get the file path based on the request URL
//     let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
    
//     // Check if the requested file exists
//     fs.access(filePath, fs.constants.F_OK, (err) => {
//       if (err) {
//         // File not found, return 404 response
//         res.writeHead(404, { 'Content-Type': 'text/plain' });
//         res.end('404 Not Found');
//         return;
//       }
      
//       // Read the file and stream its content to the response
//       fs.createReadStream(filePath).pipe(res);
//     });
//   });

app.listen(port, hostname, () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});