import express from 'express'
import {
  getAllEquipos,
  getEquipo,
  createEquipo,
  updateEquipo,
  deleteEquipo
} from '../controllers/EquipoController.js'

import multer from 'multer';
import path from 'path';

const router = express.Router();

const almacenamiento = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage: almacenamiento });

router.get('/', getAllEquipos);
router.get('/:id', getEquipo);
router.post('/', upload.single('equipo_img'), createEquipo);
router.put('/:id', upload.single('equipo_img'), updateEquipo);

// ESTE AHORA CAMBIA ESTADO (NO BORRA)
router.delete('/:id', deleteEquipo);

export default router;