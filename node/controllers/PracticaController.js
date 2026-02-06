import PracticaService from "../services/PracticaService.js";

//Obtener todos los Practica 
export const getAllPracticas = async (req, res) => {
    try{
        const Practicas = await PracticaService.getAll()
        res.status(200).json(Practicas)  //200 OK

    }catch (error){
        res.status(500).json({message: error.message})  //500 Internal server error
    }
}

//Obtener un Practica por ID
export const getPractica = async (req, res) => {
    try{

        const Practica = await PracticaService.getById(req.params.id)
        res.status(200).json(Practica)  //200 OK
    }catch(error){

        res.statu(400).json({message: error.message})  //404 Not found
    }
}

//Crear un nuevo Practica
export const createPractica = async (req, res) =>{
    try{

        const Practica = await PracticaService.create(req.body)
        res.status(201).json({message: "Practica Creado", Practica})  //201 Create
    }catch(error){

        res.status(400).json({message: error.message})  //400 Bad request

    }
}

//Actualizar un Practica
export const updatePractica = async (req, res) => {
    try{
        await PracticaService.update(req.params.id, req.body)
        res.status(200).json({message: "Practica actualizado correctamente"})
    }catch(error){
        res.status(400).json({message: error.message})
    }
}

//Eliminar un Practica
export const deletePractica = async(req, res) => {
    try{
        await PracticaService.delete(req.params.id)
        res.status(204).send()  //204 No content (borrado exitoso sin cuerpo)
    }catch(error){
        res.status(400).json({message: error.message})
    }
}