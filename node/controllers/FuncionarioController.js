import FuncionarioService from "../services/FuncionarioService.js";

// obtener todos los Funcionario
export const getAllFuncionario = async (req, res) => {
    try {
        const Funcionario = await FuncionarioService.getAll()
        res.status(200).json(Funcionario)

    }catch (error) {
        res.status(500).json({ message: error.message })
    }
}
// obtener un funcionario por id
export const getFuncionario = async (req, res) => {

    console.log(req.params.id);
    try {
       const Funcionario = await FuncionarioService.getById(req.params.id)
       res.status(200).json(Funcionario)
    }catch (error) {
        res.status(404).json({ message: error.message })
    }
}
// crear un nuevo funcionario
export const createFuncionario = async (req, res) => {
    try {
        const Funcionario = await FuncionarioService.create(req.body)
        res.status(201).json({ message:"funcionario creado",Funcionario})
    }catch (error) {
        res.status(400).json({ message: error.message })
    }
}

//actualizar un funcionario
export const updateFuncionario = async (req, res) => {
    try {
        await FuncionarioService.update(req.params.id, req.body)
        res.status(200).json({ message: "funcionario actualizada correctamente" })
    }catch(error) {
        res.status(400).json({ message: error.message })
    }
}
// eliminar una funcionario 
export const deleteFuncionario = async (req, res) => {
    try {
        await FuncionarioService.delete(req.params.id)
        res.status(204).send()//204 No content (borrado exitoso sin cuerpo))
    }catch (error) {
        res.status(400).json({ message: error.message })
    }
}