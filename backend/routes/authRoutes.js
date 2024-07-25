const express = require('express');
const { handleRegister, handleLogin } = require('../controllers/authController');
const { validateRegister, validateLogin, handleErrors } = require('../middlewares/validationMiddleware');

const router = express.Router();

router.post('/register', validateRegister, handleErrors, handleRegister);
router.post('/login', validateLogin, handleErrors, handleLogin);

module.exports = router;