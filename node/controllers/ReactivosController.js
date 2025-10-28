import ReactivosService from "../services/ReactivosServices.js";

//Obtener todos los Reactivos
export const getAllReactivos = async (req, res) => {
    try{
        const Reactivos = await ReactivosService.getAll()
        res.status(200).json(Reactivos) //Ok
    }catch (error){
        res.status(500).json({message: error.message})
    }
}

export const getReactivo = async (req, res) => {
    try{
        const Reactivo = await ReactivosService.getById(req.params.id)
        res.status(200).json(Reactivo)   
    }catch(error){
        res.status(404).json({message: error.message})
    }
}
export const createReactivo = async (req, res) => {
    try{
        const Reactivo = await ReactivosService.create(req.body)
        res.status(201).json({message: "Reactivo creado", Reactivo})
        
    }catch(error){
        res.status(400).json({message: error.message})
    }
}

export const updateReactivo = async (req, res) => {
    try{
        await ReactivosService.update(req.params.id, req.body)
        res.status(200).json({message: "Reactivo actualizado con éxito"})
    }catch(error){
        res.status(400).json({message: error.message})
    }
}
export const deleteReactivo = async(req, res) =>{
    try{
        await ReactivosService.delete(req.params.id)
        res.status(204).send()
    }catch(error){
        res.status(400).json({message:error.message})
    }
}