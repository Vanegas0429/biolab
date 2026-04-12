import express from 'express';
import { getAllActividadMaterial, getActividadMaterial, createActividadMaterial, updateActividadMaterial, deleteActividadMaterial } from '../controllers/ActividadMaterialController.js';

const router = express.Router()

router.get('/', getAllActividadMaterial);
router.get('/:id', getActividadMaterial);
router.post('/', createActividadMaterial);
router.put('/:id', updateActividadMaterial);
router.delete('/:id', deleteActividadMaterial);

export default router;