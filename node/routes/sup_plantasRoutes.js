import express from 'express'
import { getAllSup_plantas, getSup_planta, createSup_planta, updateSup_planta, deleteSup_planta } from '../controllers/sup_plantasController.js'

const router = express.Router()

router.get('/', getAllSup_plantas);
router.get('/:id', getSup_planta);
router.post('/', createSup_planta);
router.put('/:id', updateSup_planta);
router.delete('/:id', deleteSup_planta);

export default router;