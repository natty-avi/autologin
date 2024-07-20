const express = require('express');
const { loginToPartner } = require('../controllers/agentController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/login', authMiddleware, loginToPartner);

module.exports = router;
