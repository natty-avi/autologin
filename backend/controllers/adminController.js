const {
    createPartner,
    updatePartner,
    deletePartner
} = require('../models/Partner');

import pool from '../config/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const handleCreatePartner = async (req, res) => {
    const { name, login_url, username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const partner = await createPartner(name, login_url, username, hashedPassword);
        res.json(partner);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create partner' });
    }
};

const handleUpdatePartner = async (req, res) => {
    const { id } = req.params;
    const { name, login_url, username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const partner = await updatePartner(id, name, login_url, username, hashedPassword);
        res.json(partner);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update partner' });
    }
};

const handleDeletePartner = async (req, res) => {
    const { id } = req.params;
    try {
        await deletePartner(id);
        res.json({ message: 'Partner deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete partner' });
    }
};

const handleGetPartners = async (_, res) => {
    try {
        const partners = await getAllPartners();
        res.json(partners);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch partners' });
    }
};

const register = async (req, res) => {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
        'INSERT INTO users (username, password, role) VALUES ($1, $2, $3)',
        [username, hashedPassword, role]
    );
    res.status(201).send('User registered');
};

const login = async (req, res) => {
    const { username, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send('Invalid credentials');
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
    res.json({ token });
};

const addPartner = async (req, res) => {
    const { name, login_url, username, password, username_selector, password_selector, login_button_selector } = req.body;
    await pool.query(
        'INSERT INTO partners (name, login_url, username, password, username_selector, password_selector, login_button_selector) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [name, login_url, username, password, username_selector, password_selector, login_button_selector]
    );
    res.status(201).send('Partner added');
};

const getAllPartners = async () => {
    const result = await pool.query('SELECT * FROM partners');
    return result.rows;
};

module.exports = { register, 
    login,
    addPartner, 
    getAllPartners, 
    handleCreatePartner,
    handleUpdatePartner,
    handleDeletePartner,
    handleGetPartners 
};