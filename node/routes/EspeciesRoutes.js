import express from 'express';
import { getAllEspecies, getEspecie, createEspecie, updateEspecie, deleteEspecie } from '../controllers/EspeciesController.js';

import { verifyToken } from '../middlewares/authMiddlewares.js';
import { checkMiddlewareX } from '../middlewares/middlewareX.js';

const router = express.Router()

;

router.get('/', verifyToken, checkMiddlewareX, getAllEspecies);
router.get('/:id', verifyToken, checkMiddlewareX, getEspecie);
router.post('/', verifyToken, checkMiddlewareX, createEspecie);
router.put('/:id', verifyToken, checkMiddlewareX, updateEspecie);
router.delete('/:id', verifyToken, checkMiddlewareX, deleteEspecie);

export default router;
