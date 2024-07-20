const bcrypt = require('bcrypt');
const pool = require('../config/db');

const createPartnerTable = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS partners (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            login_url VARCHAR(255) NOT NULL,
            username VARCHAR(100) NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
};

createPartnerTable();

const getAllPartners = async () => {
    const result = await pool.query('SELECT * FROM partners');
    return result.rows;
};

const getPartnerById = async (id) => {
    const result = await pool.query('SELECT * FROM partners WHERE id = $1', [id]);
    return result.rows[0];
};

const addPartner = async (name, login_url, username, password, username_selector, password_selector, login_button_selector) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
        'INSERT INTO partners (name, login_url, username, password, username_selector, password_selector, login_button_selector) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [name, login_url, username, hashedPassword, username_selector, password_selector, login_button_selector]
    );
};

const updatePartner = async (id, name, login_url, username, password, username_selector, password_selector, login_button_selector) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
        'UPDATE partners SET name = $1, login_url = $2, username = $3, password = $4, username_selector = $5, password_selector = $6, login_button_selector = $7 WHERE id = $8',
        [name, login_url, username, hashedPassword, username_selector, password_selector, login_button_selector, id]
    );
};

const deletePartner = async (id) => {
    await pool.query('DELETE FROM partners WHERE id = $1', [id]);
};

module.exports = {
    getAllPartners,
    getPartnerById,
    addPartner,
    updatePartner,
    deletePartner
};
