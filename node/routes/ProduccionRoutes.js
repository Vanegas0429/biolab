import express from 'express'
import { getAllProducciones, getProduccion, createProduccion, updateProduccion, deleteProduccion } from '../controllers/ProduccionController.js'

const router = express.Router()

router.get('/', getAllProducciones);
router.get('/:id', getProduccion);
router.post('/', createProduccion);
router.put('/:id', updateProduccion);
router.delete('/:id', deleteProduccion);

export default router;
