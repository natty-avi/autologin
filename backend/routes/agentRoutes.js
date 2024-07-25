const express = require('express');
const { loginToPartner } = require('../controllers/agentController');
const router = express.Router();

router.post('/login', loginToPartner);

module.exports = router;