import ReservaService from "../services/ReservaService.js";

//Obtener todos los Reserva 
export const getAllReservas = async (req, res) => {
    try{
        const Reservas = await ReservaService.getAll()
        res.status(200).json(Reservas)  //200 OK

    }catch (error){
        res.status(500).json({message: error.message})  //500 Internal server error
    }
}

//Obtener un Reserva por ID
export const getReserva = async (req, res) => {
    try{

        const Reserva = await ReservaService.getById(req.params.id)
        res.status(200).json(Reserva)  //200 OK
    }catch(error){

        res.statu(400).json({message: error.message})  //404 Not found
    }
}

//Crear un nuevo Reserva
export const createReserva = async (req, res) =>{
    try{

        const Reserva = await ReservaService.create(req.body)
        res.status(201).json({message: "Reserva Creado", Reserva})  //201 Create
    }catch(error){

        res.status(400).json({message: error.message})  //400 Bad request

    }
}

//Actualizar un Reserva
export const updateReserva = async (req, res) => {
    try{
        await ReservaService.update(req.params.id, req.body)
        res.status(200).json({message: "Reserva actualizado correctamente"})
    }catch(error){
        res.status(400).json({message: error.message})
    }
}

//Eliminar un Reserva
export const deleteReserva = async(req, res) => {
    try{
        await ReservaService.delete(req.params.id)
        res.status(204).send()  //204 No content (borrado exitoso sin cuerpo)
    }catch(error){
        res.status(400).json({message: error.message})
    }
}