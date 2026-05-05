import express from 'express'
import { getAllPracticas, getPractica, createPractica, updatePractica, deletePractica } from '../controllers/PracticaController.js'

import { verifyToken } from '../middlewares/authMiddlewares.js';
import { checkMiddlewareX } from '../middlewares/middlewareX.js';

const router = express.Router()

router.get('/', verifyToken, checkMiddlewareX, getAllPracticas);
router.get('/:id', verifyToken, checkMiddlewareX, getPractica);
router.post('/', verifyToken, checkMiddlewareX, createPractica);
router.put('/:id', verifyToken, checkMiddlewareX, updatePractica);
router.delete('/:id', verifyToken, checkMiddlewareX, deletePractica);

export default router;
