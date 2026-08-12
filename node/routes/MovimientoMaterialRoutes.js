import express from "express";
import { getMovimientosByEntradaMaterial } from "../controllers/MovimientoMaterialController.js";

const router = express.Router();

router.get("/entrada/:id", getMovimientosByEntradaMaterial);

export default router;
