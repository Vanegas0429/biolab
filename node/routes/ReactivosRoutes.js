import express from 'express'
import { getAllReactivos, getReactivo, createReactivo, updateReactivo, deleteReactivo } from '../controllers/ReactivosController.js'
import multer from 'multer';
import path from 'path';

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

router.get('/', getAllReactivos);
router.get('/:id', getReactivo);
router.post('/', upload.single('Ficha_tecnica'), createReactivo);
router.put('/:id', upload.single('Ficha_tecnica'), updateReactivo);
router.delete('/:id', deleteReactivo);

export default router;
