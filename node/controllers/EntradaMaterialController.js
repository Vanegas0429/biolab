import EntradaMaterialService from "../services/EntradaMaterialService.js";

export const getAllEntradasMaterial = async (req, res) => {
    try {
        const entradas = await EntradaMaterialService.getAll();
        res.status(200).json(entradas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getEntradaMaterial = async (req, res) => {
    try {
        const entrada = await EntradaMaterialService.getById(req.params.id);
        res.status(200).json(entrada);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const createEntradaMaterial = async (req, res) => {
    try {
        const entrada = await EntradaMaterialService.create(req.body);
        res.status(201).json({ message: "Entrada de material registrada con éxito", entrada });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateEntradaMaterial = async (req, res) => {
    try {
        await EntradaMaterialService.update(req.params.id, req.body);
        res.status(200).json({ message: "Entrada de material actualizada correctamente" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteEntradaMaterial = async (req, res) => {
    try {
        await EntradaMaterialService.delete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
