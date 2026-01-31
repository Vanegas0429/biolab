import ProduccionService from "../services/ProduccionService.js";

//Obtener todos los Produccion
export const getAllProducciones = async (req, res) => {
    try{
        const Produccion = await ProduccionService.getAll()
        res.status(200).json(Produccion) //Ok
    }catch (error){
        res.status(500).json({message: error.message})
    }
}

export const getProduccion = async (req, res) => {
    try{
        const Produccion = await ProduccionService.getById(req.params.id)
        res.status(200).json(Produccion)   
    }catch(error){
        res.status(404).json({message: error.message})
    }
}
export const createProduccion = async (req, res) => {
    try{
        const Produccion = await ProduccionService.create(req.body)
        res.status(201).json({message: "Produccion creada", Produccion})
        
    }catch(error){
        res.status(400).json({message: error.message})
    }
}

export const updateProduccion = async (req, res) => {
    try{
        await ProduccionService.update(req.params.id, req.body)
        res.status(200).json({message: "Produccion actualizada con éxito"})
    }catch(error){
        res.status(400).json({message: error.message})
    }
}
export const deleteProduccion = async(req, res) =>{
    try{
        await ProduccionService.delete(req.params.id)
        res.status(204).send()
    }catch(error){
        res.status(400).json({message:error.message})
    }
}