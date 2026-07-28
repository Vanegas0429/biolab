import express from "express";
import { registerUsuario, loginUsuario, getAllUsuarios, updateUsuarioRol, forgotPassword, resetPassword } from "../controllers/UsuarioController.js";
import { check } from "express-validator";
import { verifyToken } from "../middlewares/authMiddlewares.js";
import { checkMiddlewareY } from "../middlewares/middlewareY.js";
import rateLimit from "express-rate-limit";

const UsuarioRouter = express.Router();

// Configuración de Rate Limiters para Seguridad
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 solicitudes por ventana por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Demasiadas solicitudes de recuperación de contraseña. Intente nuevamente en 15 minutos." }
});

const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Máximo 10 intentos de restablecimiento por ventana por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Demasiados intentos de restablecimiento. Intente nuevamente en 15 minutos." }
});

// Rutas Públicas
UsuarioRouter.post(
  "/",
  [
    check("correo", "Por favor digite un email válido").isEmail(),
    check("contraseña", "Por favor ingrese una contraseña con más de 8 caracteres").isLength({ min: 8 }),
    check("telefono", "El número de teléfono es obligatorio").not().isEmpty()
  ],
  registerUsuario
);

UsuarioRouter.post("/login", loginUsuario);
UsuarioRouter.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
UsuarioRouter.post("/reset-password", resetPasswordLimiter, resetPassword);

// Rutas de Administración (Protegidas)
UsuarioRouter.get("/usuarios", verifyToken, checkMiddlewareY, getAllUsuarios);
UsuarioRouter.patch("/usuarios/:id/rol", verifyToken, checkMiddlewareY, updateUsuarioRol);

export default UsuarioRouter;