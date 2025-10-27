import express from 'express'
import { getAllInsumos, getInsumo, createInsumo, updateInsumo, deleteInsumo} from '../controller/InsumosController.js'

const router = express.Router()

router.get('/', getAllInsumos);
router.get('/:id', getInsumo);
router.post('/', createInsumo);
router.put('/:id', updateInsumo);
router.delete('/:id', deleteInsumo);

export default router;
