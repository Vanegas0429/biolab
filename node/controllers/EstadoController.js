import EstadoService from "../services/EstadoService.js";

// obtener todos los Estado
export const getAllEstado = async (req, res) => {
    try {
        const Estado = await EstadoService.getAll()
        res.status(200).json(Estado)

    }catch (error) {
        res.status(500).json({ message: error.message })
    }
}
// obtener un Estado por id
export const getEstado = async (req, res) => {

    console.log(req.params.id);
    try {
       const Estado = await EstadoService.getById(req.params.id)
       res.status(200).json(Estado)
    }catch (error) {
        res.status(404).json({ message: error.message })
    }
}
// crear un nuevo Estado
export const createEstado = async (req, res) => {
    try {
        const Estado = await EstadoService.create(req.body)
        res.status(201).json({ message:"Estado creado",Estado})
    }catch (error) {
        res.status(400).json({ message: error.message })
    }
}

//actualizar un Estado
export const updateEstado = async (req, res) => {
    try {
        await EstadoService.update(req.params.id, req.body)
        res.status(200).json({ message: "Estado actualizada correctamente" })
    }catch(error) {
        res.status(400).json({ message: error.message })
    }
}
// eliminar una Estado 
export const deleteEstado = async (req, res) => {
    try {
        await EstadoService.delete(req.params.id)
        res.status(204).send()//204 No content (borrado exitoso sin cuerpo))
    }catch (error) {
        res.status(400).json({ message: error.message })
    }
}