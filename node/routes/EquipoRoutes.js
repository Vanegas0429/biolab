import express from 'express'
import { getAllEquipos, getEquipo, createEquipo, updateEquipo, deleteEquipo, deleteEquipoImage } from '../controllers/EquipoController.js'
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

// Configuración de campos múltiples: hasta 10 imágenes + 1 PDF
const uploadFields = upload.fields([
    { name: 'img_equipo', maxCount: 10 },
    { name: 'ficha_tecnica', maxCount: 1 }
]);

router.get('/', getAllEquipos);
router.get('/:id', getEquipo);
router.post('/', uploadFields, createEquipo);
router.put('/:id', uploadFields, updateEquipo);
router.delete('/:id', deleteEquipo);
router.delete('/:id/imagen/:filename', deleteEquipoImage);

export default router;