const express = require('express');
const router = express.Router();
const { getStats } = require('./controller');

router.get('/', getStats);

module.exports = router;
