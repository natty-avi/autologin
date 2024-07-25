import express from 'express';
import {
    handleCreatePartner,
    handleUpdatePartner,
    handleDeletePartner,
    addPartner, 
    getAllPartners,
    handleGetPartners
} from '../controllers/adminController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

router.use(authMiddleware);

router.get('/partners', handleGetPartners);
router.post('/partners', handleCreatePartner);
router.put('/partners/:id', handleUpdatePartner);
router.delete('/partners/:id', handleDeletePartner);
router.post('/partners', authMiddleware, addPartner);
router.get('/partners', authMiddleware, getAllPartners);

module.exports = router;
