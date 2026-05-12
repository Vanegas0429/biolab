import express from 'express';
import { getAllMaterial, getMaterial, createMaterial, updateMaterial, deleteMaterial, deleteMaterialImage } from '../controllers/MaterialController.js';
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
const uploadFields = upload.fields([
    { name: 'img_material', maxCount: 10 }
]);

router.get('/', verifyToken, checkMiddlewareX, getAllMaterial);
router.get('/:id', verifyToken, checkMiddlewareX, getMaterial);
router.post('/', verifyToken, checkMiddlewareX, uploadFields, createMaterial);
router.put('/:id', verifyToken, checkMiddlewareX, uploadFields, updateMaterial);
router.delete('/:id', verifyToken, checkMiddlewareX, deleteMaterial);
router.delete('/:id/imagen/:filename', verifyToken, checkMiddlewareX, deleteMaterialImage);

export default router;
