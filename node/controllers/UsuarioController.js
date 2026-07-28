import UsuarioService from "../services/UsuarioService.js";

/**
 * Función auxiliar para enmascarar correos en los logs sin revelar datos sensibles
 */
const maskEmail = (email) => {
  if (!email || typeof email !== 'string' || !email.includes('@')) return '***@***';
  const [local, domain] = email.split('@');
  const maskedLocal = local.length > 2 ? local[0] + '***' + local[local.length - 1] : '***';
  return `${maskedLocal}@${domain}`;
};

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

// SOLICITAR RECUPERACIÓN DE CONTRASEÑA (RESPUESTA SIEMPRE GENÉRICA)
export const forgotPassword = async (req, res) => {
  const correo = req.body?.correo || req.body?.email;
  const ipAddress = req.ip;
  const userAgent = req.headers['user-agent'];

  console.log(`[FORGOT-PASSWORD] Solicitud recibida para: ${maskEmail(correo)} desde IP: ${ipAddress}`);

  try {
    await UsuarioService.forgotPassword(correo, ipAddress, userAgent);
  } catch (error) {
    console.error(`[FORGOT-PASSWORD ERROR] Falla interna al procesar solicitud:`, error.message);
  }

  // Respuesta siempre idéntica e incondicional por seguridad (previene enumeración)
  return res.status(200).json({
    message: "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña."
  });
};

// RESTABLECER CONTRASEÑA
export const resetPassword = async (req, res) => {
  try {
    const { token, password, nuevaContraseña, passwordConfirmation, confirmarContraseña } = req.body;

    const tokenFinal = token;
    const passwordFinal = password || nuevaContraseña;
    const confirmFinal = passwordConfirmation || confirmarContraseña;

    if (!tokenFinal || !passwordFinal) {
      return res.status(400).json({ message: "El enlace de recuperación no es válido o ha expirado." });
    }

    if (confirmFinal && passwordFinal !== confirmFinal) {
      return res.status(400).json({ message: "Las contraseñas no coinciden." });
    }

    await UsuarioService.resetPassword(tokenFinal, passwordFinal);
    
    console.log(`[RESET-PASSWORD SUCCESS] Contraseña restablecida exitosamente`);

    return res.status(200).json({ message: "Contraseña actualizada correctamente." });
  } catch (error) {
    console.error(`[RESET-PASSWORD ERROR]:`, error.message);
    return res.status(400).json({ message: error.message || "El enlace de recuperación no es válido o ha expirado." });
  }
};
