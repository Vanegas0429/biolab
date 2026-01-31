import express from 'express';
import { getAllEstado, getEstado, createEstado, updateEstado, deleteEstado } from '../controllers/EstadoController.js';

const router = express.Router()

router.get('/', getAllEstado);
router.get('/:id', getEstado);
router.post('/', createEstado);
router.put('/:id', updateEstado);
router.delete('/:id', deleteEstado);

export default router;