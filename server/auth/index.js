const express = require('express');
const router = express.Router();

router.use('/web3', require('./web3'))

module.exports = router
