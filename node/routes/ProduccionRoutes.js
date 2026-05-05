import express from 'express'
import { getAllProducciones, getProduccion, createProduccion, updateProduccion, deleteProduccion } from '../controllers/ProduccionController.js'

import { verifyToken } from '../middlewares/authMiddlewares.js';
import { checkMiddlewareX } from '../middlewares/middlewareX.js';

const router = express.Router()

router.get('/', verifyToken, checkMiddlewareX, getAllProducciones);
router.get('/:id', verifyToken, checkMiddlewareX, getProduccion);
router.post('/', verifyToken, checkMiddlewareX, createProduccion);
router.put('/:id', verifyToken, checkMiddlewareX, updateProduccion);
router.delete('/:id', verifyToken, checkMiddlewareX, deleteProduccion);

export default router;
