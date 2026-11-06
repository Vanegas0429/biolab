import { Op } from 'sequelize';
import ReservaModel from './models/ReservaModel.js';
import ReservaService from './services/ReservaService.js';
import EstadoModel from './models/EstadoModel.js';
import EntradaModel from './models/EntradaModel.js';
import EntradaMaterialModel from './models/EntradaMaterialModel.js';
import { enviarCorreoRechazo } from './services/EmailService.js';

export const verificarEntradasVencidasYAgotadas = async () => {
    try {
        const tzoffset = (new Date()).getTimezoneOffset() * 60000;
        const todayStr = (new Date(Date.now() - tzoffset)).toISOString().split('T')[0];

        // 1. Inactivar entradas de reactivos vencidas o con stock existente <= 0
        const [numReactivos] = await EntradaModel.update(
            { Estado: 'Inactivo' },
            {
                where: {
                    Estado: 'Activo',
                    [Op.or]: [
                        { Can_Existente: { [Op.lte]: 0 } },
                        { Fec_Vencimiento: { [Op.lt]: todayStr } }
                    ]
                }
            }
        );
        if (numReactivos > 0) {
            console.log(`[AUTO-INACTIVAR] ${numReactivos} entradas de reactivos inactivadas (vencidas o agotadas).`);
        }

        // 2. Inactivar entradas de materiales con stock existente <= 0
        const [numMateriales] = await EntradaMaterialModel.update(
            { Estado: 'Inactivo' },
            {
                where: {
                    Estado: 'Activo',
                    Can_Existente: { [Op.lte]: 0 }
                }
            }
        );
        if (numMateriales > 0) {
            console.log(`[AUTO-INACTIVAR] ${numMateriales} entradas de materiales inactivadas (agotadas).`);
        }
    } catch (error) {
        console.error("[AUTO-INACTIVAR] Error verificando entradas:", error.message || error);
    }
};

export const verificarReservasVencidas = async () => {
    try {
        const tzoffset = (new Date()).getTimezoneOffset() * 60000;
        const nowLocal = new Date(Date.now() - tzoffset);
        const todayStr = nowLocal.toISOString().split('T')[0];
        const currentHours = String(nowLocal.getUTCHours()).padStart(2, '0');
        const currentMinutes = String(nowLocal.getUTCMinutes()).padStart(2, '0');
        const currentTimeStr = `${currentHours}:${currentMinutes}:00`;

        // Buscar reservas activas cuya fecha ya haya pasado o cuya hora haya pasado hoy
        const reservasVencidas = await ReservaModel.findAll({
            where: {
                Booleano: 'Activo',
                [Op.or]: [
                    { Fec_Reserva: { [Op.lt]: todayStr } },
                    {
                        Fec_Reserva: todayStr,
                        Hor_Reserva: { [Op.lt]: currentTimeStr }
                    }
                ]
            }
        });

        if (reservasVencidas.length > 0) {
            console.log(`[AUTO-RECHAZO] Se encontraron ${reservasVencidas.length} reservas vencidas.`);
            const estadoRechazado = await EstadoModel.findOne({ where: { Tip_Estado: 'Rechazado' } });
            const MOTIVO_VENCIMIENTO = "Reserva vencida automáticamente: no fue gestionada antes de la fecha y hora solicitada.";

            if (estadoRechazado) {
                for (const reserva of reservasVencidas) {
                    try {
                        await ReservaService.cambiarEstado(
                            reserva.Id_Reserva,
                            estadoRechazado.Id_Estado,
                            MOTIVO_VENCIMIENTO
                        );
                        console.log(`[AUTO-RECHAZO] Reserva #${reserva.Id_Reserva} rechazada automáticamente.`);

                        try {
                            if (reserva.Cor_Solicitante) {
                                await enviarCorreoRechazo(
                                    reserva.Cor_Solicitante,
                                    reserva.Nom_Solicitante,
                                    reserva.Id_Reserva,
                                    reserva.Fec_Reserva,
                                    MOTIVO_VENCIMIENTO
                                );
                            }
                        } catch (emailErr) {
                            console.warn(`[AUTO-RECHAZO-EMAIL] Advertencia al enviar correo para reserva #${reserva.Id_Reserva}:`, emailErr.message);
                        }
                    } catch (e) {
                        console.warn(`[AUTO-RECHAZO] No se pudo cambiar estado de reserva #${reserva.Id_Reserva}:`, e.message);
                    }
                }
            }
        }
    } catch (error) {
        console.error("[AUTO-RECHAZO] Error verificando reservas vencidas:", error.message);
    }
};

export const startCronJobs = () => {
    // Ejecutar inmediatamente al inicio
    verificarReservasVencidas();
    verificarEntradasVencidasYAgotadas();

    // Ejecutar cada 10 minutos de forma recurrente
    setInterval(async () => {
        await verificarReservasVencidas();
        await verificarEntradasVencidasYAgotadas();
    }, 10 * 60 * 1000);
};

export default { startCronJobs, verificarReservasVencidas, verificarEntradasVencidasYAgotadas };
