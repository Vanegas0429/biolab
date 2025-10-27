import express from 'express';
import { getAllFuncionario, getFuncionario, createFuncionario, updateFuncionario, deleteFuncionario } from '../controllers/FuncionarioController.js';

const router = express.Router()

router.get('/', getAllFuncionario);
router.get('/:id', getFuncionario);
router.post('/', createFuncionario);
router.put('/:id', updateFuncionario);
router.delete('/:id', deleteFuncionario);

export default router;