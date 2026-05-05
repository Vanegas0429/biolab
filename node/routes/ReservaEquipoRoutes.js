import express from 'express';
import { getAllReservaEquipo, getReservaEquipo, createReservaEquipo, updateReservaEquipo, deleteReservaEquipo } from '../controllers/ReservaEquipoController.js';

import { verifyToken } from '../middlewares/authMiddlewares.js';
import { checkMiddlewareX } from '../middlewares/middlewareX.js';

const router = express.Router()

router.get('/', verifyToken, checkMiddlewareX, getAllReservaEquipo);
router.get('/:id', verifyToken, checkMiddlewareX, getReservaEquipo);
router.post('/', verifyToken, checkMiddlewareX, createReservaEquipo);
router.put('/:id', verifyToken, checkMiddlewareX, updateReservaEquipo);
router.delete('/:id', verifyToken, checkMiddlewareX, deleteReservaEquipo);

export default router;