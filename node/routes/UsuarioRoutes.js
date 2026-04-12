import express from "express";
import { registerUsuario, loginUsuario } from "../controllers/UsuarioController.js";
import { check } from "express-validator";

const UsuarioRouter = express.Router();

UsuarioRouter.post(
  "/",
  [
    check("correo", "Por favor digite un email válido").isEmail(),
    check("contraseña", "Por favor ingrese una contraseña con más de 8 caracteres")
      .isLength({ min: 8 })
  ],
  registerUsuario
);

UsuarioRouter.post("/login", loginUsuario);

export default UsuarioRouter;
