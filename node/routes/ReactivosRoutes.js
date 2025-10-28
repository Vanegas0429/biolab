import express from 'express'
import { getAllReactivos, getReactivo, createReactivo, updateReactivo, deleteReactivo } from '../controllers/ReactivosController.js'

const router = express.Router()

router.get('/', getAllReactivos);
router.get('/:id', getReactivo);
router.post('/', createReactivo);
router.put('/:id', updateReactivo);
router.delete('/:id', deleteReactivo);

export default router;
