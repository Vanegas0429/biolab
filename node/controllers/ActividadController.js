import ActividadService from "../services/ActividadService.js";

// obtener todas las Actividades
export const getAllActividad = async (req, res) => {
    try {
        const Actividad = await ActividadService.getAll();
        res.status(200).json(Actividad);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// obtener una Actividad por id
export const getActividad = async (req, res) => {
    try {
        const Actividad = await ActividadService.getById(req.params.id);
        res.status(200).json(Actividad);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// obtener recursos por actividades seleccionadas
export const getRecursosActividad = async (req, res) => {
    try {
        const { actividades } = req.body;
        const data = await ActividadService.getRecursosByActividades(actividades);
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// crear una nueva Actividad
export const createActividad = async (req, res) => {
    try {
        const Actividad = await ActividadService.create(req.body);
        res.status(201).json({ message: "Actividad creada", Actividad });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// actualizar una Actividad
export const updateActividad = async (req, res) => {
    try {
        await ActividadService.update(req.params.id, req.body);
        res.status(200).json({ message: "Actividad actualizada correctamente" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// eliminar una Actividad
export const deleteActividad = async (req, res) => {
    try {
        await ActividadService.delete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};