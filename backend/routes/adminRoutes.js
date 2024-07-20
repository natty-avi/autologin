const express = require('express');
const {
    handleCreatePartner,
    handleUpdatePartner,
    handleDeletePartner,
    handleGetPartners
} = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/partners', handleGetPartners);
router.post('/partners', handleCreatePartner);
router.put('/partners/:id', handleUpdatePartner);
router.delete('/partners/:id', handleDeletePartner);

module.exports = router;
