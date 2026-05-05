import express from 'express';
import { getAllReservaReactivo, getReservaReactivo, createReservaReactivo, updateReservaReactivo, deleteReservaReactivo } from '../controllers/ReservaReactivoController.js';

import { verifyToken } from '../middlewares/authMiddlewares.js';
import { checkMiddlewareX } from '../middlewares/middlewareX.js';

const router = express.Router()

router.get('/', verifyToken, checkMiddlewareX, getAllReservaReactivo);
router.get('/:id', verifyToken, checkMiddlewareX, getReservaReactivo);
router.post('/', verifyToken, checkMiddlewareX, createReservaReactivo);
router.put('/:id', verifyToken, checkMiddlewareX, updateReservaReactivo);
router.delete('/:id', verifyToken, checkMiddlewareX, deleteReservaReactivo);

export default router;