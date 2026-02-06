import express from 'express';
import { getAllReservaReactivo, getReservaReactivo, createReservaReactivo, updateReservaReactivo, deleteReservaReactivo } from '../controllers/ReservaReactivoController.js';

const router = express.Router()

router.get('/', getAllReservaReactivo);
router.get('/:id', getReservaReactivo);
router.post('/', createReservaReactivo);
router.put('/:id', updateReservaReactivo);
router.delete('/:id', deleteReservaReactivo);

export default router;