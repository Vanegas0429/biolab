import express from 'express';
import { getAllActividadEquipo, getActividadEquipo, createActividadEquipo, updateActividadEquipo, deleteActividadEquipo } from '../controllers/ActividadEquipoController.js';

const router = express.Router()

router.get('/', getAllActividadEquipo);
router.get('/:id', getActividadEquipo);
router.post('/', createActividadEquipo);
router.put('/:id', updateActividadEquipo);
router.delete('/:id', deleteActividadEquipo);

export default router;