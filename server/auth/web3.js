const express = require('express');
const router = express.Router();
module.exports = router;

/** POST /auth/web3 */
router.post('/', require('./utils'));
