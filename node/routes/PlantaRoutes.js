import express from 'express'
import { getAllPlantas, getPlanta, createPlanta, updatePlanta, deletePlanta } from '../controllers/PlantaController.js'

const router = express.Router()

router.get('/', getAllPlantas);
router.get('/:id', getPlanta);
router.post('/', createPlanta);
router.put('/:id', updatePlanta);
router.delete('/:id', deletePlanta);

export default router;