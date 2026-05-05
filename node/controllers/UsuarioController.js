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
