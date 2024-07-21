const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const pool = new Pool();

app.use(express.json());

const createDefaultUsers = async () => {
    const client = await pool.connect();
    try {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await client.query(
            `INSERT INTO users (username, password, role) VALUES ('admin', $1, 'admin') ON CONFLICT (username) DO NOTHING`,
            [hashedPassword]
        );
        console.log('Default admin user created with username: admin and password: admin123');
    } catch (err) {
        console.error(err);
    } finally {
        client.release();
    }
};

createDefaultUsers();

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    } finally {
        client.release();
    }
});

app.get('/partners', async (req, res) => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT id, name, login_url FROM partners');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    } finally {
        client.release();
    }
});

app.post('/partners', async (req, res) => {
    const { name, login_url, username, password } = req.body;
    const client = await pool.connect();
    try {
        await client.query(
            'INSERT INTO partners (name, login_url, username, password) VALUES ($1, $2, $3, $4)',
            [name, login_url, username, password]
        );
        res.status(201).json({ message: 'Partner added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    } finally {
        client.release();
    }
});

app.put('/partners/:id', async (req, res) => {
    const { id } = req.params;
    const { name, login_url, username, password } = req.body;
    const client = await pool.connect();
    try {
        await client.query(
            'UPDATE partners SET name = $1, login_url = $2, username = $3, password = $4 WHERE id = $5',
            [name, login_url, username, password, id]
        );
        res.json({ message: 'Partner updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    } finally {
        client.release();
    }
});

app.post('/autologin', async (req, res) => {
    const { partnerId } = req.body;
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT login_url, username, password FROM partners WHERE id = $1', [partnerId]);
        const partner = result.rows[0];

        if (!partner) {
            return res.status(400).json({ message: 'Partner not found' });
        }

        res.json(partner);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    } finally {
        client.release();
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
