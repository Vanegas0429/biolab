import express from 'express'
import { getAllSup_plantas, getSup_planta, createSup_planta, updateSup_planta, deleteSup_planta } from '../controllers/sup_plantasController.js'

import { verifyToken } from '../middlewares/authMiddlewares.js';
import { checkMiddlewareX } from '../middlewares/middlewareX.js';

const router = express.Router()

router.get('/', verifyToken, checkMiddlewareX, getAllSup_plantas);
router.get('/:id', verifyToken, checkMiddlewareX, getSup_planta);
router.post('/', verifyToken, checkMiddlewareX, createSup_planta);
router.put('/:id', verifyToken, checkMiddlewareX, updateSup_planta);
router.delete('/:id', verifyToken, checkMiddlewareX, deleteSup_planta);

export default router;