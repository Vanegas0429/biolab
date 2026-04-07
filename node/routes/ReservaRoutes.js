import express from 'express';
import { getAllReserva, getReserva, createReserva, updateReserva, deleteReserva } from '../controllers/ReservaController.js';
import multer from 'multer';
import path from 'path'
import authMiddleware from '../middlewares/authMiddlewares.js';

const router = express.Router();

const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});


const upload = multer({ storage: almacenamiento });
router.get('/', getAllReserva);
router.get('/:id', authMiddleware, getReserva);
router.post('/', createReserva);
router.put('/:id', authMiddleware, updateReserva);//Aquí deben incluir el middleware para validar el rol instructor
router.delete('/:id', authMiddleware, deleteReserva);

export default router;
