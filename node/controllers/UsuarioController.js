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

// OLVIDASTE CONTRASEÑA (Recuperar)
export const forgotPassword = async (req, res) => {
  try {
    const { correo } = req.body;
    console.log(`[FORGOT] Solicitud de recuperación recibida para: ${correo}`);
    
    // Llamar al servicio para generar token y enviar email
    const result = await UsuarioService.forgotPassword(correo);
    
    console.log(`[FORGOT] ✅ Proceso completado exitosamente para: ${correo}`);

    // Si estamos en entorno local o si no hay credenciales SMTP configuradas, adjuntamos devLink para pruebas locales
    const isDev = process.env.NODE_ENV !== 'production' || !process.env.SMTP_USER;
    
    res.status(200).json({ 
      message: "Si el correo está registrado, hemos enviado las instrucciones de recuperación.",
      ...(isDev && result?.resetLink ? { devLink: result.resetLink } : {})
    });
  } catch (error) {
    console.error(`[FORGOT] ❌ Error inesperado para ${req.body?.correo}:`, error.message);
    res.status(200).json({ message: "Si el correo está registrado, hemos enviado las instrucciones de recuperación." });
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

