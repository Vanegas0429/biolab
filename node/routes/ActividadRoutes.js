import express from 'express';
import {
    getAllActividad,
    getActividad,
    getRecursosActividad,
    createActividad,
    updateActividad,
    deleteActividad
} from '../controllers/ActividadController.js';

import { verifyToken } from '../middlewares/authMiddlewares.js';
import { checkMiddlewareX } from '../middlewares/middlewareX.js';

const router = express.Router()

router.get('/', verifyToken, checkMiddlewareX, getAllActividad);
router.get('/:id', verifyToken, checkMiddlewareX, getActividad);
router.post('/recursos', verifyToken, checkMiddlewareX, getRecursosActividad);
router.post('/', verifyToken, checkMiddlewareX, createActividad);
router.put('/:id', verifyToken, checkMiddlewareX, updateActividad);
router.delete('/:id', verifyToken, checkMiddlewareX, deleteActividad);

export default router;