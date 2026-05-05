import express from 'express'
import { getAllEquipos, getEquipo, createEquipo, updateEquipo, deleteEquipo, deleteEquipoImage } from '../controllers/EquipoController.js'
import multer from 'multer';
import path from 'path';
import { verifyToken } from '../middlewares/authMiddlewares.js';

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

// Configuración de campos múltiples: hasta 10 imágenes + 1 PDF
const uploadFields = upload.fields([
    { name: 'img_equipo', maxCount: 10 },
    { name: 'ficha_tecnica', maxCount: 1 }
]);

router.get('/', verifyToken, getAllEquipos);
router.get('/:id', verifyToken, getEquipo);
router.post('/', verifyToken, uploadFields, createEquipo);
router.put('/:id', verifyToken, uploadFields, updateEquipo);
router.delete('/:id', verifyToken, deleteEquipo);
router.delete('/:id/imagen/:filename', verifyToken, deleteEquipoImage);

export default router;