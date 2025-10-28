import LotesService from "../services/LotesServices.js";

//Obtener todos los lotes
export const getAllLotes = async (req, res) => {
    try{
        const Lotes = await LotesService.getAll()
        res.status(200).json(Lotes) //Ok
    }catch (error){
        res.status(500).json({message: error.message})
    }
}

export const getLote = async (req, res) => {
    try{
        const Lote = await LotesService.getById(req.params.id)
        res.status(200).json(Lote)   
    }catch(error){
        res.status(404).json({message: error.message})
    }
}
export const createLote = async (req, res) => {
    try{
        const Lote = await LotesService.create(req.body)
        res.status(201).json({message: "Lotes creado", Lote})
        
    }catch(error){
        res.status(400).json({message: error.message})
    }
}

export const updateLote = async (req, res) => {
    try{
        await LotesService.update(req.params.id, req.body)
        res.status(200).json({message: "Lote actualizado con éxito"})
    }catch(error){
        res.status(400).json({message: error.message})
    }
}
export const deleteLote = async(req, res) =>{
    try{
        await LotesService.delete(req.params.id)
        res.status(204).send()
    }catch(error){
        res.status(400).json({message:error.message})
    }
}