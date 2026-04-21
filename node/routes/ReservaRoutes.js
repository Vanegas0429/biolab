import express from "express";
import {
  getAllReserva,
  getReserva,
  createReserva,
  updateReserva,
  deleteReserva,
  cambiarEstadoReserva
} from "../controllers/ReservaController.js";


const router = express.Router();

// 🔐 PROTEGIDO
router.get("/", getAllReserva);
router.get("/:id", getReserva);
router.post("/", createReserva);
router.put("/:id", updateReserva);
router.put("/:id/estado", cambiarEstadoReserva);
router.delete("/:id", deleteReserva);

export default router;