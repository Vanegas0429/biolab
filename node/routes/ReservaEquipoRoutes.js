import express from 'express';
import { getAllReservaEquipo, getReservaEquipo, createReservaEquipo, updateReservaEquipo, deleteReservaEquipo } from '../controllers/ReservaEquipoController.js';

const router = express.Router()

router.get('/', getAllReservaEquipo);
router.get('/:id', getReservaEquipo);
router.post('/', createReservaEquipo);
router.put('/:id', updateReservaEquipo);
router.delete('/:id', deleteReservaEquipo);

export default router;