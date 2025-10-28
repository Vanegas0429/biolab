import sup_plantaService from "../services/sup_plantaService.js";

// obtener todos los sup_planta
export const getAllSup_plantas = async (req, res) => {
    try {
        const sup_plantas = await sup_plantaService.getAll()
        res.status(200).json(sup_plantas)

    }catch (error) {
        res.status(500).json({ message: error.message })
    }
}
// obtener un sup_planta por id
export const getSup_planta = async (req, res) => {

    console.log(req.params.id);
    try {
       const sup_planta = await sup_plantaService.getById(req.params.id)
       res.status(200).json(sup_planta)
    }catch (error) {
        res.status(404).json({ message: error.message })
    }
}
// crear un nuevo sup_planta
export const createSup_planta = async (req, res) => {
    try {
        const sup_planta = await sup_plantaService.create(req.body)
        res.status(201).json({ message:"sup_planta creado",sup_planta})
    }catch (error) {
        res.status(400).json({ message: error.message })
    }
}

//actualizar un sup_planta
export const updateSup_planta = async (req, res) => {
    try {
        await sup_plantaService.update(req.params.id, req.body)
        res.status(200).json({ message: "sup_planta actualizada correctamente" })
    }catch(error) {
        res.status(400).json({ message: error.message })
    }
}
// eliminar una sup_planta 
export const deleteSup_planta = async (req, res) => {
    try {
        await sup_plantaService.delete(req.params.id)
        res.status(204).send()//204 No content (borrado exitoso sin cuerpo))
    }catch (error) {
        res.status(400).json({ message: error.message })
    }
}