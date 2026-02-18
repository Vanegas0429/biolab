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
    res.status(200).json(usuario);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
