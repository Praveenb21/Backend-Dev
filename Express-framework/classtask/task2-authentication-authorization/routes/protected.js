const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send(`Welcome to ${req.baseUrl.substring(1)}`);
});

module.exports = router;
