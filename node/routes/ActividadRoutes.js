import express from 'express';
import {
    getAllActividad,
    getActividad,
    getRecursosActividad,
    createActividad,
    updateActividad,
    deleteActividad
} from '../controllers/ActividadController.js';

const router = express.Router();

router.get('/', getAllActividad);
router.get('/:id', getActividad);
router.post('/recursos', getRecursosActividad);
router.post('/', createActividad);
router.put('/:id', updateActividad);
router.delete('/:id', deleteActividad);

export default router;