import express from 'express';
import { getMovimientosByEntrada } from '../controllers/MovimientoReactivoController.js';

const router = express.Router();

router.get('/entrada/:id', getMovimientosByEntrada);

export default router;
