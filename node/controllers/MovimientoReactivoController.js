import MovimientoReactivoModel from "../models/MovimientoReactivoModel.js";
import ReservaModel from "../models/ReservaModel.js";

export const getMovimientosByEntrada = async (req, res) => {
    try {
        const { id } = req.params;
        const movimientos = await MovimientoReactivoModel.findAll({
            where: { Id_Entrada: id },
            order: [['Fecha', 'DESC'], ['Id_Movimiento', 'DESC']],
            include: [
                {
                    model: ReservaModel,
                    as: 'Reserva',
                    attributes: ['Id_Reserva', 'Nom_Solicitante', 'Tip_Reserva']
                }
            ]
        });
        res.status(200).json(movimientos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
