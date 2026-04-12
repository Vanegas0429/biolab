import express from 'express';
import { getAllActividadReactivo, getActividadReactivo, createActividadReactivo, updateActividadReactivo, deleteActividadReactivo } from '../controllers/ActividadReactivoController.js';

const router = express.Router()

router.get('/', getAllActividadReactivo);
router.get('/:id', getActividadReactivo);
router.post('/', createActividadReactivo);
router.put('/:id', updateActividadReactivo);
router.delete('/:id', deleteActividadReactivo);

export default router;