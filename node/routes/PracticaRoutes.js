import express from 'express'
import { getAllPracticas, getPractica, createPractica, updatePractica, deletePractica } from '../controllers/PracticaController.js'

const router = express.Router()

router.get('/', getAllPracticas);
router.get('/:id', getPractica);
router.post('/', createPractica);
router.put('/:id', updatePractica);
router.delete('/:id', deletePractica);

export default router;
