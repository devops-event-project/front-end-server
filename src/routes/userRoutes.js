const express = require('express');
const router = express.Router();

// Example GET route for fetching user data
router.get('/fetch-data', (req, res) => {
  // Example response
  res.json({ message: "Successfully fetched user data" });
});

module.exports = router;