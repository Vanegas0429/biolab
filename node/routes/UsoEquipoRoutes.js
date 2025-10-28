import express from 'express'
import { getAllUsoEquipos, getUsoEquipo, createUsoEquipo, updateUsoEquipo, deleteUsoEquipo } from '../controllers/UsoEquipoController.js'

const router = express.Router()

router.get('/', getAllUsoEquipos);
router.get('/:id', getUsoEquipo);
router.post('/', createUsoEquipo);
router.put('/:id', updateUsoEquipo);
router.delete('/:id', deleteUsoEquipo);

export default router;