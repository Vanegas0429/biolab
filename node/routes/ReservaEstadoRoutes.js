import express from 'express';
import { getAllReservaEstado, getReservaEstado, createReservaEstado, updateReservaEstado, deleteReservaEstado } from '../controllers/ReservaEstadoController.js';

const router = express.Router()

router.get('/', getAllReservaEstado);
router.get('/:id', getReservaEstado);
router.post('/', createReservaEstado);
router.put('/:id', updateReservaEstado);
router.delete('/:id', deleteReservaEstado);

export default router;