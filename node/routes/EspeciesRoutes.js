import express from 'express';
import { getAllEspecies, getEspecie, createEspecie, updateEspecie, deleteEspecie } from '../controllers/EspeciesController.js';

import { verifyToken } from '../middlewares/authMiddlewares.js';
import { checkMiddlewareX } from '../middlewares/middlewareX.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const almacenamiento = multer.diskStorage({
    destination: (req, file, cb ) => {
        cb(null,'public/uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E4) + path.extname(file.originalname))
    }
});

const upload = multer({ storage: almacenamiento });

router.get('/', verifyToken, checkMiddlewareX, getAllEspecies);
router.get('/:id', verifyToken, checkMiddlewareX, getEspecie);
router.post('/', verifyToken, checkMiddlewareX, upload.single('img_especie'), createEspecie);
router.put('/:id', verifyToken, checkMiddlewareX, upload.single('img_especie'), updateEspecie);
router.delete('/:id', verifyToken, checkMiddlewareX, deleteEspecie);

export default router;
