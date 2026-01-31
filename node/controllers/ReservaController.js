import ReservaService from "../services/ReservaService.js";

// obtener todos los Reserva
export const getAllReserva = async (req, res) => {
    try {
        const Reserva = await ReservaService.getAll()
        res.status(200).json(Reserva)

    }catch (error) {
        res.status(500).json({ message: error.message })
    }
}
// obtener un Reserva por id
export const getReserva = async (req, res) => {

    console.log(req.params.id);
    try {
       const Reserva = await ReservaService.getById(req.params.id)
       res.status(200).json(Reserva)
    }catch (error) {
        res.status(404).json({ message: error.message })
    }
}
// crear un nuevo Reserva
export const createReserva = async (req, res) => {
    try {
        const Reserva = await ReservaService.create(req.body)
        res.status(201).json({ message:"Reserva creado",Reserva})
    }catch (error) {
        res.status(400).json({ message: error.message })
    }
}

//actualizar un Reserva
export const updateReserva = async (req, res) => {
    try {
        await ReservaService.update(req.params.id, req.body)
        res.status(200).json({ message: "Reserva actualizada correctamente" })
    }catch(error) {
        res.status(400).json({ message: error.message })
    }
}
// eliminar una Reserva 
export const deleteReserva = async (req, res) => {
    try {
        await ReservaService.delete(req.params.id)
        res.status(204).send()//204 No content (borrado exitoso sin cuerpo))
    }catch (error) {
        res.status(400).json({ message: error.message })
    }
}