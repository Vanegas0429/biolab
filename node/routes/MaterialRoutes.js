import express from 'express';
import { getAllMaterial, getMaterial, createMaterial, updateMaterial, deleteMaterial } from '../controllers/MaterialController.js';

const router = express.Router();

router.get('/', getAllMaterial);
router.get('/:id', getMaterial);
router.post('/', createMaterial);
router.put('/:id', updateMaterial);
router.delete('/:id', deleteMaterial);

export default router;
