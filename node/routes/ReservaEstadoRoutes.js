import express from 'express';
import { getAllReservaEstado, getReservaEstado, createReservaEstado, updateReservaEstado, deleteReservaEstado } from '../controllers/ReservaEstadoController.js';

import { verifyToken } from '../middlewares/authMiddlewares.js';
import { checkMiddlewareX } from '../middlewares/middlewareX.js';

const router = express.Router()

router.get('/', verifyToken, checkMiddlewareX, getAllReservaEstado);
router.get('/:id', verifyToken, checkMiddlewareX, getReservaEstado);
router.post('/', verifyToken, checkMiddlewareX, createReservaEstado);
router.put('/:id', verifyToken, checkMiddlewareX, updateReservaEstado);
router.delete('/:id', verifyToken, checkMiddlewareX, deleteReservaEstado);

export default router;