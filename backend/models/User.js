const bcrypt = require('bcrypt');
const pool = require('../config/db');

const createUserTable = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'agent')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
};

createUserTable();

const getUserByUsername = async (username) => {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
};

const createUser = async (username, password, role) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
        'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *',
        [username, hashedPassword, role]
    );
    return result.rows[0];
};

module.exports = {
    getUserByUsername,
    createUser
};
