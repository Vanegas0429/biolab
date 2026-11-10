import express from 'express';
import { getAllEquipos, getEquipo, createEquipo, updateEquipo, deleteEquipo } from '../controllers/EquipoController.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { verifyToken } from '../middlewares/authMiddlewares.js';

const router = express.Router();

const uploadDir = 'public/uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const almacenamiento = multer.diskStorage({
    destination: (req, file, cb ) => {
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E4) + path.extname(file.originalname));
    }
});

const upload = multer({ storage: almacenamiento });

const uploadFields = upload.fields([
    { name: 'ficha_tecnica', maxCount: 1 }
]);

router.get('/', verifyToken, getAllEquipos);
router.get('/:id', verifyToken, getEquipo);
router.post('/', verifyToken, uploadFields, createEquipo);
router.put('/:id', verifyToken, uploadFields, updateEquipo);
router.delete('/:id', verifyToken, deleteEquipo);

export default router;
