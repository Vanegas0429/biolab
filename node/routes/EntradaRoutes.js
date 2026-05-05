import express from 'express'
import { getAllEntradas, getEntrada, CreateEntrada, updateEntrada, deleteEntrada } from '../controllers/EntradaController.js'

import { verifyToken } from '../middlewares/authMiddlewares.js';
import { checkMiddlewareX } from '../middlewares/middlewareX.js';

const router = express.Router()

router.get('/', verifyToken, checkMiddlewareX, getAllEntradas);
router.get('/:id', verifyToken, checkMiddlewareX, getEntrada);
router.post('/', verifyToken, checkMiddlewareX, CreateEntrada);
router.put('/:id', verifyToken, checkMiddlewareX, updateEntrada);
router.delete('/:id', verifyToken, checkMiddlewareX, deleteEntrada);

export default router;
