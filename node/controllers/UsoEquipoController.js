import UsoEquipoService from "../services/UsoEquipoService.js";

//Obtener todos los Uso de equipo 
export const getAllUsoEquipos = async (req, res) => {
    try{
        const UsoEquipos = await UsoEquipoService.getAll()
        res.status(200).json(UsoEquipos)  //200 OK

    }catch (error){
        res.status(500).json({message: error.message})  //500 Internal server error
    }
}

//Obtener un Uso de equipo por ID
export const getUsoEquipo = async (req, res) => {
    try{

        const UsoEquipo = await UsoEquipoService.getById(req.params.id)
        res.status(200).json(UsoEquipo)  //200 OK
    }catch(error){

        res.statu(400).json({message: error.message})  //404 Not found
    }
}

//Crear un nuevo Uso de equipo
export const createUsoEquipo = async (req, res) =>{
    try{

        const UsoEquipo = await UsoEquipoService.create(req.body)
        res.status(201).json({message: "Uso de Equipo Creado", UsoEquipo})  //201 Create
    }catch(error){

        res.status(400).json({message: error.message})  //400 Bad request

    }
}

//Actualizar un Uso de equipo
export const updateUsoEquipo = async (req, res) => {
    try{
        await UsoEquipoService.update(req.params.id, req.body)
        res.status(200).json({message: "Uso de Equipo actualizado correctamente"})
    }catch(error){
        res.status(400).json({message: error.message})
    }
}

//Eliminar un Uso de equipo
export const deleteUsoEquipo = async(req, res) => {
    try{
        await UsoEquipoService.delete(req.params.id)
        res.status(204).send()  //204 No content (borrado exitoso sin cuerpo)
    }catch(error){
        res.status(400).json({message: error.message})
    }
}