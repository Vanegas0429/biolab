import express from 'express';
import { getAllEstado, getEstado, createEstado, updateEstado, deleteEstado } from '../controllers/EstadoController.js';

import { verifyToken } from '../middlewares/authMiddlewares.js';
import { checkMiddlewareX } from '../middlewares/middlewareX.js';

const router = express.Router()

router.get('/', verifyToken, checkMiddlewareX, getAllEstado);
router.get('/:id', verifyToken, checkMiddlewareX, getEstado);
router.post('/', verifyToken, checkMiddlewareX, createEstado);
router.put('/:id', verifyToken, checkMiddlewareX, updateEstado);
router.delete('/:id', verifyToken, checkMiddlewareX, deleteEstado);

export default router;