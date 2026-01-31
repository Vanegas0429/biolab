import express from 'express';
import { getAllReservaMaterial, getReservaMaterial, createReservaMaterial, updateReservaMaterial, deleteReservaMaterial } from '../controllers/ReservaMaterialController.js';

const router = express.Router()

router.get('/', getAllReservaMaterial);
router.get('/:id', getReservaMaterial);
router.post('/', createReservaMaterial);
router.put('/:id', updateReservaMaterial);
router.delete('/:id', deleteReservaMaterial);

export default router;