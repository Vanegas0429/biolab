import express from 'express';
import { getAllEspecies, getEspecie, createEspecie, updateEspecie, deleteEspecie } from '../controllers/EspeciesController.js';

const router = express.Router();

router.get('/', getAllEspecies);
router.get('/:id', getEspecie);
router.post('/', createEspecie);
router.put('/:id', updateEspecie);
router.delete('/:id', deleteEspecie);

export default router;
