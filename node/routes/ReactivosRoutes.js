import express from 'express'
import { getAllReactivos, getReactivo, createReactivo, updateReactivo, deleteReactivo } from '../controllers/ReactivosController.js'
import multer from 'multer';
import path from 'path';

import { verifyToken } from '../middlewares/authMiddlewares.js';
import { checkMiddlewareX } from '../middlewares/middlewareX.js';

const router = express.Router()

const almacenamiento = multer.diskStorage({
    destination: (req, file, cb ) => {
        cb(null,'public/uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E4) + path.extname(file.originalname))
    }
})

const upload = multer({ storage: almacenamiento })

router.get('/', verifyToken, checkMiddlewareX, getAllReactivos);
router.get('/:id', verifyToken, checkMiddlewareX, getReactivo);
router.post('/', verifyToken, checkMiddlewareX, upload.single('Ficha_tecnica'), createReactivo);
router.put('/:id', verifyToken, checkMiddlewareX, upload.single('Ficha_tecnica'), updateReactivo);
router.delete('/:id', verifyToken, checkMiddlewareX, deleteReactivo);

export default router;
