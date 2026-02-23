import EquipoService from "../services/EquipoService.js"; // Servicio que maneja la lógica de base de datos
import EquipoModel from "../models/EquipoModel.js"; // Modelo Sequelize directo


// ================== OBTENER TODOS LOS EQUIPOS ==================
export const getAllEquipos = async (req, res) => {
    try {
        const Equipos = await EquipoService.getAll(); // Trae todos los equipos desde el service
        res.status(200).json(Equipos);  // Respuesta OK con datos
    } catch (error) {
        res.status(500).json({ message: error.message });  // Error del servidor
    }
}


// ================== OBTENER UN EQUIPO POR ID ==================
export const getEquipo = async (req, res) => {
    try {
        const Equipo = await EquipoService.getById(req.params.id_equipo); // Busca equipo por ID
        res.status(200).json(Equipo);  // Devuelve el equipo encontrado
    } catch (error) {
        res.statu(400).json({ message: error.message });  // Error (nota: aquí hay un typo en status)
    }
}


// ================== CREAR UN NUEVO EQUIPO ==================
export const createEquipo = async (req, res) => {
    try {
        console.log("BODY:", req.body); // Muestra datos enviados desde el frontend
        console.log("FILE:", req.file); // Muestra archivo de imagen si existe


        const data = {
            ...req.body, // Copia todos los campos del formulario
            equipo_img: req.file ? req.file.filename : null // Guarda nombre de imagen si se sube
        };

    const data = {
      ...req.body,
      img_equipo: req.file ? req.file.filename : null
    };


        const Equipo = await EquipoService.create(data); // Crea el registro en BD

        res.status(201).json({ message: "Equipo Creado", Equipo }); // Respuesta de creación exitosa

    } catch (error) {
        console.error("ERROR createEquipo:", error); // Log de error en servidor
        res.status(400).json({ message: error.message }); // Error de validación/datos
    }
};


// ================== ACTUALIZAR EQUIPO ==================
export const updateEquipo = async (req, res) => {
    try {

        const id = req.params.id; // 

        const data = {
            ...req.body
        };

        if (req.file) {
            data.equipo_img = req.file.filename;
        }

        await EquipoService.update(id, data);

        res.status(200).json({ message: "Equipo actualizado correctamente" });

    } catch (error) {
        console.error("ERROR updateEquipo:", error);
        res.status(400).json({ message: error.message });
    }
}
// ================== CAMBIAR ESTADO (ANTES ERA DELETE) ==================
export const deleteEquipo = async (req, res) => {
  try {
    const { id } = req.params; // Obtiene ID desde la URL

    const equipo = await EquipoModel.findByPk(id); // Busca equipo en BD
    if (!equipo) {
      return res.status(404).json({ message: "Equipo no encontrado" }); // Si no existe
    }

    // Cambia el estado: si está Activo pasa a Inactivo y viceversa
    equipo.estado = equipo.estado === "Activo" ? "Inactivo" : "Activo";

    await equipo.save(); // Guarda el cambio en la base de datos

    res.json({ message: "Estado del equipo actualizado", estado: equipo.estado }); // Respuesta exitosa

  } catch (error) {
    console.error("ERROR CAMBIANDO ESTADO:", error); // Log de error
    res.status(500).json({ message: "Error del servidor", error: error.message }); // Error 500
  }
};
