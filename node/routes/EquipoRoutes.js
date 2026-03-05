import express from 'express'
import { getAllEquipos, getEquipo, createEquipo, updateEquipo, deleteEquipo } from '../controllers/EquipoController.js'
import multer from 'multer';
import path from 'path';

const router = express.Router()

const almacenamiento = multer.diskStorage({
    destination: (req, file, cb ) => {
        cb(null,'public/uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))  // SOLO CAMBIO: Date.now() en lugar de Date,now()
    }
})

const upload = multer({ storage: almacenamiento })  // SOLO CAMBIO: "storage" en lugar de "almacenamiento"
router.get('/', getAllEquipos);
router.get('/:id', getEquipo);
router.post('/', upload.single('img_equipo'), createEquipo);
router.put('/:id', upload.single('img_equipo'), updateEquipo);
router.delete('/:id', deleteEquipo);

export default router;