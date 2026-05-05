import express from 'express';
import { getAllReservaMaterial, getReservaMaterial, createReservaMaterial, updateReservaMaterial, deleteReservaMaterial } from '../controllers/ReservaMaterialController.js';

import { verifyToken } from '../middlewares/authMiddlewares.js';
import { checkMiddlewareX } from '../middlewares/middlewareX.js';

const router = express.Router()

router.get('/', verifyToken, checkMiddlewareX, getAllReservaMaterial);
router.get('/:id', verifyToken, checkMiddlewareX, getReservaMaterial);
router.post('/', verifyToken, checkMiddlewareX, createReservaMaterial);
router.put('/:id', verifyToken, checkMiddlewareX, updateReservaMaterial);
router.delete('/:id', verifyToken, checkMiddlewareX, deleteReservaMaterial);

export default router;