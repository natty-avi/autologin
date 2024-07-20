const {
    getAllPartners,
    getPartnerById,
    createPartner,
    updatePartner,
    deletePartner
} = require('../models/Partner');
const bcrypt = require('bcrypt');

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

const handleGetPartners = async (req, res) => {
    try {
        const partners = await getAllPartners();
        res.json(partners);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch partners' });
    }
};

module.exports = {
    handleCreatePartner,
    handleUpdatePartner,
    handleDeletePartner,
    handleGetPartners
};
