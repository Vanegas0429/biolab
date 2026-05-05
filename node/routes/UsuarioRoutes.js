import express from "express";
import { registerUsuario, loginUsuario, getAllUsuarios, updateUsuarioRol } from "../controllers/UsuarioController.js";
import { check } from "express-validator";
import { verifyToken } from "../middlewares/authMiddlewares.js";
import { checkMiddlewareY } from "../middlewares/middlewareY.js";

const UsuarioRouter = express.Router();

// Rutas Públicas
UsuarioRouter.post(
  "/",
  [
    check("correo", "Por favor digite un email válido").isEmail(),
    check("contraseña", "Por favor ingrese una contraseña con más de 8 caracteres")
      .isLength({ min: 8 }),
    check("telefono", "El número de teléfono es obligatorio").not().isEmpty()
  ],
  registerUsuario
);

UsuarioRouter.post("/login", loginUsuario);

// Rutas de Administración (Protegidas)
UsuarioRouter.get("/usuarios", verifyToken, checkMiddlewareY, getAllUsuarios);
UsuarioRouter.patch("/usuarios/:id/rol", verifyToken, checkMiddlewareY, updateUsuarioRol);

export default UsuarioRouter;