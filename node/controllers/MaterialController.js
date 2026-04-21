import MaterialService from "../services/MaterialService.js";

//Obtener todos las Material
export const getAllMaterial = async (req, res) => {
    try{
        const Material = await MaterialService.getAll()
        res.status(200).json(Material) //Ok
    }catch (error){
        res.status(500).json({message: error.message})
    }
}

export const getMaterial = async (req, res) => {
    try{
        const Material = await MaterialService.getById(req.params.id)
        res.status(200).json(Material)   
    }catch(error){
        res.status(404).json({message: error.message})
    }
}
export const createMaterial = async (req, res) => {
    try{
        const Material = await MaterialService.create(req.body)
        res.status(201).json({message: "Material creada", Material})
        
    }catch(error){
        res.status(400).json({message: error.message})
    }
}

export const updateMaterial = async (req, res) => {
    try{
        await MaterialService.update(req.params.id, req.body)
        res.status(200).json({message: "Material actualizada con éxito"})
    }catch(error){
        res.status(400).json({message: error.message})
    }
}
export const deleteMaterial = async(req, res) =>{
    try{
        await MaterialService.delete(req.params.id)
        res.status(204).send()
    }catch(error){
        res.status(400).json({message:error.message})
    }
}