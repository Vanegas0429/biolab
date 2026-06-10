import UsuarioService from "../services/UsuarioService.js";

// REGISTRAR USUARIO
export const registerUsuario = async (req, res) => {
  try {
    await UsuarioService.register(req.body);
    res.status(201).json({ message: "Usuario registrado con éxito" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// LOGIN USUARIO
export const loginUsuario = async (req, res) => {
  try {
    const usuario = await UsuarioService.login(req.body);
    console.log(usuario)
    res.status(200).json(usuario);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// OBTENER TODOS LOS USUARIOS (ADMIN)
export const getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await UsuarioService.getAll();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ACTUALIZAR ROL DE USUARIO (ADMIN)
export const updateUsuarioRol = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol } = req.body;
    const usuario = await UsuarioService.updateRol(id, rol);
    res.status(200).json(usuario);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// OLVIDASTE CONTRASEÑA (RECUperar)
export const forgotPassword = async (req, res) => {
  try {
    const { correo } = req.body;
    console.log(`[FORGOT] Solicitud de recuperación para: ${correo}`);
    
    // Llamar al servicio para generar token y enviar email
    await UsuarioService.forgotPassword(correo);
    
    console.log(`[FORGOT] ✅ Correo de recuperación enviado exitosamente a: ${correo}`);
    // Siempre respondemos éxito para no revelar si el correo existe o no
    res.status(200).json({ message: "Si el correo está registrado, hemos enviado las instrucciones." });
  } catch (error) {
    console.error(`[FORGOT] ❌ Error para ${req.body?.correo}:`, error.message);
    // Si el error es controlado (ej. correo no existe) igual enviamos un 200 por seguridad
    res.status(200).json({ message: "Si el correo está registrado, hemos enviado las instrucciones." });
  }
};

// RESTABLECER CONTRASEÑA
export const resetPassword = async (req, res) => {
  try {
    const { token, nuevaContraseña } = req.body;
    
    await UsuarioService.resetPassword(token, nuevaContraseña);
    
    res.status(200).json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

