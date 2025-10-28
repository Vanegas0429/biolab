import EquipoService from "../services/EquipoService.js";

//Obtener todos los equipo 
export const getAllEquipos = async (req, res) => {
    try{
        const Equipos = await EquipoService.getAll()
        res.status(200).json(Equipos)  //200 OK

    }catch (error){
        res.status(500).json({message: error.message})  //500 Internal server error
    }
}

//Obtener un equipo por ID
export const getEquipo = async (req, res) => {
    try{

        const Equipo = await EquipoService.getById(req.params.id)
        res.status(200).json(Equipo)  //200 OK
    }catch(error){

        res.statu(400).json({message: error.message})  //404 Not found
    }
}

//Crear un nuevo equipo
export const createEquipo = async (req, res) =>{
    try{

        const Equipo = await EquipoService.create(req.body)
        res.status(201).json({message: "Equipo Creado", Equipo})  //201 Create
    }catch(error){

        res.status(400).json({message: error.message})  //400 Bad request

    }
}

//Actualizar un equipo
export const updateEquipo = async (req, res) => {
    try{
        await EquipoService.update(req.params.id, req.body)
        res.status(200).json({message: "Equipo actualizado correctamente"})
    }catch(error){
        res.status(400).json({message: error.message})
    }
}

//Eliminar un equipo
export const deleteEquipo = async(req, res) => {
    try{
        await EquipoService.delete(req.params.id)
        res.status(204).send()  //204 No content (borrado exitoso sin cuerpo)
    }catch(error){
        res.status(400).json({message: error.message})
    }
}