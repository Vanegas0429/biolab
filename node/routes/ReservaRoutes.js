import express from 'express';
import {
    getAllReserva,
    getReserva,
    createReserva,
    cambiarEstadoReserva,
    updateReserva,
    deleteReserva
} from '../controllers/ReservaController.js';

const router = express.Router();

router.get('/', getAllReserva);
router.get('/:id', getReserva);
router.post('/', createReserva);
router.put('/:id/estado', cambiarEstadoReserva);
router.put('/:id', updateReserva);
router.delete('/:id', deleteReserva);

export default router;