import express from 'express'
import { getAllEntradas, getEntrada, CreateEntrada, updateEntrada, deleteEntrada } from '../controllers/EntradaController.js'

const router = express.Router()

router.get('/', getAllEntradas);
router.get('/:id', getEntrada);
router.post('/', CreateEntrada);
router.put('/:id', updateEntrada);
router.delete('/:id', deleteEntrada);

export default router;
