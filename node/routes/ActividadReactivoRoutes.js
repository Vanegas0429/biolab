import express from 'express';
import { getAllActividadReactivo, getActividadReactivo, createActividadReactivo, updateActividadReactivo, deleteActividadReactivo } from '../controllers/ActividadReactivoController.js';

import { verifyToken } from '../middlewares/authMiddlewares.js';
import { checkMiddlewareX } from '../middlewares/middlewareX.js';

const router = express.Router()

router.get('/', verifyToken, checkMiddlewareX, getAllActividadReactivo);
router.get('/:id', verifyToken, checkMiddlewareX, getActividadReactivo);
router.post('/', verifyToken, checkMiddlewareX, createActividadReactivo);
router.put('/:id', verifyToken, checkMiddlewareX, updateActividadReactivo);
router.delete('/:id', verifyToken, checkMiddlewareX, deleteActividadReactivo);

export default router;