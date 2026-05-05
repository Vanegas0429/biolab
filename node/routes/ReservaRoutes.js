import express from "express";
import {
  getAllReserva,
  getReserva,
  createReserva,
  updateReserva,
  deleteReserva,
  cambiarEstadoReserva
} from "../controllers/ReservaController.js";
import { verifyToken } from "../middlewares/authMiddlewares.js";


const router = express.Router();

// 🔐 PROTEGIDO
router.get("/", verifyToken, getAllReserva);
router.get("/:id", verifyToken, getReserva);
router.post("/", verifyToken, createReserva);
router.put("/:id", verifyToken, updateReserva);
router.put("/:id/estado", verifyToken, cambiarEstadoReserva);
router.delete("/:id", verifyToken, deleteReserva);

export default router;