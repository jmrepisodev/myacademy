const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

const path = require('path');

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

//router.get('/', (req, res) => res.redirect('/index.html'));


module.exports = router;