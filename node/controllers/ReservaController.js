import ReservaService from "../services/ReservaService.js";

// obtener todas las reservas
export const getAllReserva = async (req, res) => {
    try {
        const Reserva = await ReservaService.getAll();
        res.status(200).json(Reserva);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// obtener una reserva por id
export const getReserva = async (req, res) => {
    try {
        const Reserva = await ReservaService.getById(req.params.id);
        res.status(200).json(Reserva);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// crear una nueva reserva
export const createReserva = async (req, res) => {
    try {
        const Reserva = await ReservaService.create(req.body);
        res.status(201).json({ message: "Reserva creada", Reserva });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// cambiar estado de una reserva
export const cambiarEstadoReserva = async (req, res) => {
    try {
        const { Id_Estado, Mot_RecCan } = req.body;
        await ReservaService.cambiarEstado(req.params.id, Id_Estado, Mot_RecCan);
        res.status(200).json({ message: "Estado actualizado correctamente" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// actualizar una reserva
export const updateReserva = async (req, res) => {
    try {
        await ReservaService.update(req.params.id, req.body);
        res.status(200).json({ message: "Reserva actualizada correctamente" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// eliminar una reserva
export const deleteReserva = async (req, res) => {
    try {
        await ReservaService.delete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};