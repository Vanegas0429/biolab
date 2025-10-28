import express from 'express'
import { getAllCronogramas, getCronograma, createCronograma, updateCronograma, deleteCronograma } from '../controllers/CronogramaController.js'

const router = express.Router()

router.get('/', getAllCronogramas);
router.get('/:id', getCronograma);
router.post('/', createCronograma);
router.put('/:id', updateCronograma);
router.delete('/:id', deleteCronograma);

export default router;