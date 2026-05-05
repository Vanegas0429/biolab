import express from 'express';
import { getAllMaterial, getMaterial, createMaterial, updateMaterial, deleteMaterial } from '../controllers/MaterialController.js';

import { verifyToken } from '../middlewares/authMiddlewares.js';
import { checkMiddlewareX } from '../middlewares/middlewareX.js';

const router = express.Router()

;

router.get('/', verifyToken, checkMiddlewareX, getAllMaterial);
router.get('/:id', verifyToken, checkMiddlewareX, getMaterial);
router.post('/', verifyToken, checkMiddlewareX, createMaterial);
router.put('/:id', verifyToken, checkMiddlewareX, updateMaterial);
router.delete('/:id', verifyToken, checkMiddlewareX, deleteMaterial);

export default router;
