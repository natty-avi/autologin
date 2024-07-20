const express = require('express');
const {
    handleCreatePartner,
    handleUpdatePartner,
    handleDeletePartner,
    addPartner, 
    getAllPartners,
    handleGetPartners
} = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/partners', handleGetPartners);
router.post('/partners', handleCreatePartner);
router.put('/partners/:id', handleUpdatePartner);
router.delete('/partners/:id', handleDeletePartner);
router.post('/partners', authMiddleware, addPartner);
router.get('/partners', authMiddleware, getAllPartners);

module.exports = router;
