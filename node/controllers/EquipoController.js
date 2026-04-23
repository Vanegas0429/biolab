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
    console.log("FILES:", req.files);

    // Procesar múltiples imágenes
    let imagenes = [];
    if (req.files && req.files['img_equipo']) {
      imagenes = req.files['img_equipo'].map(f => f.filename);
    }

    // Procesar ficha técnica PDF
    let fichaTecnica = null;
    if (req.files && req.files['ficha_tecnica']) {
      fichaTecnica = req.files['ficha_tecnica'][0].filename;
    }

    const data = {
      ...req.body,
      img_equipo: imagenes.length > 0 ? JSON.stringify(imagenes) : null,
      ficha_tecnica: fichaTecnica
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
        // Obtener imágenes existentes del equipo
        const equipoExistente = await EquipoService.getById(req.params.id);
        let imagenesExistentes = [];
        try {
            imagenesExistentes = JSON.parse(equipoExistente.img_equipo || '[]');
        } catch {
            // Si es un string simple (imagen antigua), convertirlo a array
            if (equipoExistente.img_equipo) {
                imagenesExistentes = [equipoExistente.img_equipo];
            }
        }

        // Agregar nuevas imágenes al array existente
        if (req.files && req.files['img_equipo']) {
            const nuevasImagenes = req.files['img_equipo'].map(f => f.filename);
            imagenesExistentes = [...imagenesExistentes, ...nuevasImagenes];
        }

        // Preparar datos
        const data = {
            ...req.body,
            img_equipo: imagenesExistentes.length > 0 ? JSON.stringify(imagenesExistentes) : equipoExistente.img_equipo
        };

        // Procesar ficha técnica si se envió una nueva
        if (req.files && req.files['ficha_tecnica']) {
            data.ficha_tecnica = req.files['ficha_tecnica'][0].filename;
        } else if (req.body.ficha_tecnica !== undefined) {
            data.ficha_tecnica = req.body.ficha_tecnica;
        }

        await EquipoService.update(req.params.id, data)

        res.status(200).json({ message: "Equipo actualizado correctamente" })

    } catch (error) {
        console.error("ERROR updateEquipo:", error);
        res.status(400).json({ message: error.message })
    }
}

// Eliminar una imagen específica de un equipo
export const deleteEquipoImage = async (req, res) => {
    try {
        await EquipoService.removeImage(req.params.id, req.params.filename);
        res.status(200).json({ message: "Imagen eliminada correctamente" });
    } catch (error) {
        console.error("ERROR deleteEquipoImage:", error);
        res.status(400).json({ message: error.message });
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