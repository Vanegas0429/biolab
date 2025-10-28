import CronogramaService from "../services/CronogramaService.js";

//Obtener todos los Cronograma 
export const getAllCronogramas = async (req, res) => {
    try{
        const Cronogramas = await CronogramaService.getAll()
        res.status(200).json(Cronogramas)  //200 OK

    }catch (error){
        res.status(500).json({message: error.message})  //500 Internal server error
    }
}

//Obtener un Cronograma por ID
export const getCronograma = async (req, res) => {
    try{

        const Cronograma = await CronogramaService.getById(req.params.id)
        res.status(200).json(Cronograma)  //200 OK
    }catch(error){

        res.statu(400).json({message: error.message})  //404 Not found
    }
}

//Crear un nuevo Cronograma
export const createCronograma = async (req, res) =>{
    try{

        const Cronograma = await CronogramaService.create(req.body)
        res.status(201).json({message: "Cronograma Creado", Cronograma})  //201 Create
    }catch(error){

        res.status(400).json({message: error.message})  //400 Bad request

    }
}

//Actualizar un Cronograma
export const updateCronograma = async (req, res) => {
    try{
        await CronogramaService.update(req.params.id, req.body)
        res.status(200).json({message: "Cronograma actualizado correctamente"})
    }catch(error){
        res.status(400).json({message: error.message})
    }
}

//Eliminar un Cronograma
export const deleteCronograma = async(req, res) => {
    try{
        await CronogramaService.delete(req.params.id)
        res.status(204).send()  //204 No content (borrado exitoso sin cuerpo)
    }catch(error){
        res.status(400).json({message: error.message})
    }
}