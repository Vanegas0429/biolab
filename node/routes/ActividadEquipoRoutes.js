import express from 'express';
import { getAllActividadEquipo, getActividadEquipo, createActividadEquipo, updateActividadEquipo, deleteActividadEquipo } from '../controllers/ActividadEquipoController.js';

import { verifyToken } from '../middlewares/authMiddlewares.js';
import { checkMiddlewareX } from '../middlewares/middlewareX.js';

const router = express.Router()

router.get('/', verifyToken, checkMiddlewareX, getAllActividadEquipo);
router.get('/:id', verifyToken, checkMiddlewareX, getActividadEquipo);
router.post('/', verifyToken, checkMiddlewareX, createActividadEquipo);
router.put('/:id', verifyToken, checkMiddlewareX, updateActividadEquipo);
router.delete('/:id', verifyToken, checkMiddlewareX, deleteActividadEquipo);

export default router;