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

const createPartner = async (name, login_url, username, password) => {
    const result = await pool.query(
        'INSERT INTO partners (name, login_url, username, password) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, login_url, username, password]
    );
    return result.rows[0];
};

const updatePartner = async (id, name, login_url, username, password) => {
    const result = await pool.query(
        'UPDATE partners SET name = $1, login_url = $2, username = $3, password = $4 WHERE id = $5 RETURNING *',
        [name, login_url, username, password, id]
    );
    return result.rows[0];
};

const deletePartner = async (id) => {
    await pool.query('DELETE FROM partners WHERE id = $1', [id]);
};

module.exports = {
    getAllPartners,
    getPartnerById,
    createPartner,
    updatePartner,
    deletePartner
};
