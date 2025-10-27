import InsumosService from "../services/InsumosServices.js";

//Obtener todos los insumos
export const getAllInsumos = async (req, res) => {
    try{
        const insumos = await InsumosService.getAll()
        res.status(200).json(insumos) //Ok
    }catch (error){
        res.status(500).json({message: error.message})
    }
}

export const getInsumo = async (req, res) => {
    try{
        const insumo = await InsumosService.getById(req.params.id)
        res.status(200).json(insumo)   
    }catch(error){
        res.status(404).json({message: error.message})
    }
}
export const createInsumo = async (req, res) => {
    try{
        const insumo = await InsumosService.create(req.body)
        res.status(201).json({message: "Insumo creado", insumo})
        
    }catch(error){
        res.status(400).json({message: error.message})
    }
}

export const updateInsumo = async (req, res) => {
    try{
        await InsumosService.update(req.params.id, req.body)
        res.status(200).json({message: "Insumo actualizado con éxito"})
    }catch(error){
        res.status(400).json({message: error.message})
    }
}
export const deleteInsumo = async(req, res) =>{
    try{
        await InsumosService.delete(req.params.id)
        res.status(204).send()
    }catch(error){
        res.status(400).json({message:error.message})
    }
}