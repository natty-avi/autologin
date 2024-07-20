const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { getUserByUsername, createUser } = require('../models/User');

const handleRegister = async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const user = await createUser(username, password, role);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to register user' });
    }
};

const handleLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await getUserByUsername(username);
        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Failed to login' });
    }
};

module.exports = {
    handleRegister,
    handleLogin
};
