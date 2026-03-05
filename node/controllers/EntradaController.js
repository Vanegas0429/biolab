import EntradaService from "../services/EntradaService.js";

//Obtener todos los Entrada 
export const getAllEntradas = async (req, res) => {
    try{
        const Entradas = await EntradaService.getAll()
        res.status(200).json(Entradas)  //200 OK

    }catch (error){
        res.status(500).json({message: error.message})  //500 Internal server error
    }
}

//Obtener un Entrada por ID
export const getEntrada = async (req, res) => {
    try{

        const Entrada = await EntradaService.getById(req.params.id)
        res.status(200).json(Entrada)  //200 OK
    }catch(error){

        res.statu(400).json({message: error.message})  //404 Not found
    }
}

//Crear un nuevo Entrada
export const CreateEntrada = async (req, res) =>{
    try{

        const Entrada = await EntradaService.create(req.body)
        res.status(201).json({message: "Entrada Creado", Entrada})  //201 Create
    }catch(error){

        res.status(400).json({message: error.message})  //400 Bad request

    }
}

//Actualizar un Entrada
export const updateEntrada = async (req, res) => {
    try{
        await EntradaService.update(req.params.id, req.body)
        res.status(200).json({message: "Entrada actualizado correctamente"})
    }catch(error){
        res.status(400).json({message: error.message})
    }
}

//Eliminar un Entrada
export const deleteEntrada = async(req, res) => {
    try{
        await EntradaService.delete(req.params.id)
        res.status(204).send()  //204 No content (borrado exitoso sin cuerpo)
    }catch(error){
        res.status(400).json({message: error.message})
    }
}