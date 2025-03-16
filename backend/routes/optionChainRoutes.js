const express = require('express');
const router = express.Router();
const optionChainController = require('../controllers/optionChainController');

router.get('/option-chain', optionChainController.getOptionChain);

module.exports = router;