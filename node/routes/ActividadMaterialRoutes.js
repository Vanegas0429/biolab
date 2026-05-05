import express from 'express';
import { getAllActividadMaterial, getActividadMaterial, createActividadMaterial, updateActividadMaterial, deleteActividadMaterial } from '../controllers/ActividadMaterialController.js';

import { verifyToken } from '../middlewares/authMiddlewares.js';
import { checkMiddlewareX } from '../middlewares/middlewareX.js';

const router = express.Router()

router.get('/', verifyToken, checkMiddlewareX, getAllActividadMaterial);
router.get('/:id', verifyToken, checkMiddlewareX, getActividadMaterial);
router.post('/', verifyToken, checkMiddlewareX, createActividadMaterial);
router.put('/:id', verifyToken, checkMiddlewareX, updateActividadMaterial);
router.delete('/:id', verifyToken, checkMiddlewareX, deleteActividadMaterial);

export default router;