import express from 'express';
import { getAllEspecies, getEspecie, createEspecie, updateEspecie, deleteEspecie, deleteEspecieImage } from '../controllers/EspeciesController.js';

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
const uploadFields = upload.fields([
    { name: 'img_especie', maxCount: 10 }
]);

router.get('/', verifyToken, checkMiddlewareX, getAllEspecies);
router.get('/:id', verifyToken, checkMiddlewareX, getEspecie);
router.post('/', verifyToken, checkMiddlewareX, uploadFields, createEspecie);
router.put('/:id', verifyToken, checkMiddlewareX, uploadFields, updateEspecie);
router.delete('/:id', verifyToken, checkMiddlewareX, deleteEspecie);
router.delete('/:id/imagen/:filename', verifyToken, checkMiddlewareX, deleteEspecieImage);

export default router;
