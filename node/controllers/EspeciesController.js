import EspecieService from "../services/EspeciesService.js";

//Obtener todos las Especie
export const getAllEspecies = async (req, res) => {
    try{
        const Especie = await EspecieService.getAll()
        res.status(200).json(Especie) //Ok
    }catch (error){
        res.status(500).json({message: error.message})
    }
}

export const getEspecie = async (req, res) => {
    try{
        const Especie = await EspecieService.getById(req.params.id)
        res.status(200).json(Especie)   
    }catch(error){
        res.status(404).json({message: error.message})
    }
}
export const createEspecie = async (req, res) => {
    try{
        const Especie = await EspecieService.create(req.body)
        res.status(201).json({message: "Especie creada", Especie})
        
    }catch(error){
        res.status(400).json({message: error.message})
    }
}

export const updateEspecie = async (req, res) => {
    try{
        await EspecieService.update(req.params.id, req.body)
        res.status(200).json({message: "Especie actualizada con éxito"})
    }catch(error){
        res.status(400).json({message: error.message})
    }
}
export const deleteEspecie = async(req, res) =>{
    try{
        await EspecieService.delete(req.params.id)
        res.status(204).send()
    }catch(error){
        res.status(400).json({message:error.message})
    }
}