import EquipoService from "../services/EquipoService.js";

// Obtener todos los equipos 
export const getAllEquipos = async (req, res) => {
    try {
        const Equipos = await EquipoService.getAll();
        res.status(200).json(Equipos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un equipo por ID
export const getEquipo = async (req, res) => {
    try {
        const Equipo = await EquipoService.getById(req.params.id);
        res.status(200).json(Equipo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Crear un nuevo equipo
export const createEquipo = async (req, res) => {
    try {
        let fichaTecnica = null;
        if (req.files && req.files['ficha_tecnica']) {
            fichaTecnica = req.files['ficha_tecnica'][0].filename;
        }

        const data = {
            ...req.body,
            ficha_tecnica: fichaTecnica
        };

        const Equipo = await EquipoService.create(data);
        res.status(201).json({ message: "Equipo Creado", Equipo });
    } catch (error) {
        console.error("ERROR createEquipo:", error);
        res.status(400).json({ message: error.message });
    }
};

// Actualizar un equipo
export const updateEquipo = async (req, res) => {
    try {
        const data = { ...req.body };

        if (req.files && req.files['ficha_tecnica']) {
            data.ficha_tecnica = req.files['ficha_tecnica'][0].filename;
        } else if (req.body.ficha_tecnica !== undefined) {
            data.ficha_tecnica = req.body.ficha_tecnica;
        }

        await EquipoService.update(req.params.id, data);
        res.status(200).json({ message: "Equipo actualizado correctamente" });
    } catch (error) {
        console.error("ERROR updateEquipo:", error);
        res.status(400).json({ message: error.message });
    }
};

// Eliminar un equipo
export const deleteEquipo = async (req, res) => {
    try {
        await EquipoService.delete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
