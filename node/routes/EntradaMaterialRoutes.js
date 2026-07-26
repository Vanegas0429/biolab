import express from 'express';
import {
    getAllEntradasMaterial,
    getEntradaMaterial,
    createEntradaMaterial,
    updateEntradaMaterial,
    deleteEntradaMaterial
} from '../controllers/EntradaMaterialController.js';

import { verifyToken } from '../middlewares/authMiddlewares.js';
import { checkMiddlewareX } from '../middlewares/middlewareX.js';

const router = express.Router();

router.get('/', verifyToken, checkMiddlewareX, getAllEntradasMaterial);
router.get('/:id', verifyToken, checkMiddlewareX, getEntradaMaterial);
router.post('/', verifyToken, checkMiddlewareX, createEntradaMaterial);
router.put('/:id', verifyToken, checkMiddlewareX, updateEntradaMaterial);
router.delete('/:id', verifyToken, checkMiddlewareX, deleteEntradaMaterial);

export default router;
