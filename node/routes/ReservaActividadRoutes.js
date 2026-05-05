import express from 'express';
import { getAllReservaActividad, getReservaActividad, createReservaActividad, updateReservaActividad, deleteReservaActividad } from '../controllers/ReservaActividadController.js';

import { verifyToken } from '../middlewares/authMiddlewares.js';
import { checkMiddlewareX } from '../middlewares/middlewareX.js';

const router = express.Router()

router.get('/', verifyToken, checkMiddlewareX, getAllReservaActividad);
router.get('/:id', verifyToken, checkMiddlewareX, getReservaActividad);
router.post('/', verifyToken, checkMiddlewareX, createReservaActividad);
router.put('/:id', verifyToken, checkMiddlewareX, updateReservaActividad);
router.delete('/:id', verifyToken, checkMiddlewareX, deleteReservaActividad);

export default router;