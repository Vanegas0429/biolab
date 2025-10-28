import PlantaService from "../services/PlantaService.js";

//Obtener todos las plantas 
export const getAllPlantas = async (req, res) => {
    try{
        const Plantas = await PlantaService.getAll()
        res.status(200).json(Plantas)  //200 OK

    }catch (error){
        res.status(500).json({message: error.message})  //500 Internal server error
    }
}

//Obtener una planta potID
export const getPlanta = async (req, res) => {
    try{

        const Planta = await PlantaService.getById(req.params.id)
        res.status(200).json(Planta)  //200 OK
    }catch(error){

        res.statu(400).json({message: error.message})  //404 Not found
    }
}

//Crear una nueva planta
export const createPlanta = async (req, res) =>{
    try{

        const Planta = await PlantaService.create(req.body)
        res.status(201).json({message: "Planta Creada", Planta})  //201 Create
    }catch(error){

        res.status(400).json({message: error.message})  //400 Bad request

    }
}

//Actualizar una planta
export const updatePlanta = async (req, res) => {
    try{
        await PlantaService.update(req.params.id, req.body)
        res.status(200).json({message: "Planta actualizada correctamente"})
    }catch(error){
        res.status(400).json({message: error.message})
    }
}

//Eliminar una planta
export const deletePlanta = async(req, res) => {
    try{
        await PlantaService.delete(req.params.id)
        res.status(204).send()  //204 No content (borrado exitoso sin cuerpo)
    }catch(error){
        res.status(400).json({message: error.message})
    }
}