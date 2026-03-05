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
    try {
        const Equipo = await EquipoService.getById(req.params.id)
        res.status(200).json(Equipo)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

//Crear un nuevo equipo
export const createEquipo = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const data = {
      ...req.body,
      img_equipo: req.file ? req.file.filename : null
    };

    const Equipo = await EquipoService.create(data);

    res.status(201).json({ message: "Equipo Creado", Equipo });

  } catch (error) {
    console.error("ERROR createEquipo:", error);
    res.status(400).json({ message: error.message });
  }
};


//Actualizar un equipo
export const updateEquipo = async (req, res) => {
    try {

        const data = {
            ...req.body,
            img_equipo: req.file ? req.file.filename : req.body.img_equipo
        };

        await EquipoService.update(req.params.id, data)

        res.status(200).json({ message: "Equipo actualizado correctamente" })

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
export const deleteEquipo = async (req, res) => {
    try {
        await EquipoService.delete(req.params.id)
        res.status(204).send()
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}