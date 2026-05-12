import EspecieService from "../services/EspeciesService.js";

//Obtener todos las Especie
export const getAllEspecies = async (req, res) => {
    try {
        const Especie = await EspecieService.getAll()
        res.status(200).json(Especie) //Ok
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getEspecie = async (req, res) => {
    try {
        const Especie = await EspecieService.getById(req.params.id)
        res.status(200).json(Especie)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}
export const createEspecie = async (req, res) => {
    try {
        let imagenes = [];
        if (req.files && req.files['img_especie']) {
            imagenes = req.files['img_especie'].map(f => f.filename);
        } else if (req.file) {
            imagenes = [req.file.filename];
        }

        const data = {
            ...req.body,
            img_especie: imagenes.length > 0 ? JSON.stringify(imagenes) : null
        };

        const Especie = await EspecieService.create(data);
        res.status(201).json({ message: "Especie creada", Especie });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const updateEspecie = async (req, res) => {
    try {
        const especieExistente = await EspecieService.getById(req.params.id);
        let imagenesExistentes = [];
        try {
            imagenesExistentes = JSON.parse(especieExistente.img_especie || '[]');
        } catch {
            if (especieExistente.img_especie) {
                imagenesExistentes = [especieExistente.img_especie];
            }
        }

        if (req.files && req.files['img_especie']) {
            const nuevasImagenes = req.files['img_especie'].map(f => f.filename);
            imagenesExistentes = [...imagenesExistentes, ...nuevasImagenes];
        } else if (req.file) {
            imagenesExistentes = [...imagenesExistentes, req.file.filename];
        }

        const data = {
            ...req.body,
            img_especie: imagenesExistentes.length > 0 ? JSON.stringify(imagenesExistentes) : especieExistente.img_especie
        };

        await EspecieService.update(req.params.id, data);
        res.status(200).json({ message: "Especie actualizada con éxito" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const deleteEspecieImage = async (req, res) => {
    try {
        await EspecieService.removeImage(req.params.id, req.params.filename);
        res.status(200).json({ message: "Imagen eliminada correctamente" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
export const deleteEspecie = async (req, res) => {
    try {
        await EspecieService.delete(req.params.id)
        res.status(204).send()
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}