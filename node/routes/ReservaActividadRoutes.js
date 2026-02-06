import express from 'express';
import { getAllReservaActividad, getReservaActividad, createReservaActividad, updateReservaActividad, deleteReservaActividad } from '../controllers/ReservaActividadController.js';

const router = express.Router()

router.get('/', getAllReservaActividad);
router.get('/:id', getReservaActividad);
router.post('/', createReservaActividad);
router.put('/:id', updateReservaActividad);
router.delete('/:id', deleteReservaActividad);

export default router;