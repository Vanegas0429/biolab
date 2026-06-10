import cron from 'node-cron';
import { Op } from 'sequelize';
import ReservaModel from './models/ReservaModel.js';
import ReservaService from './services/ReservaService.js';
import EstadoModel from './models/EstadoModel.js';
import { enviarCorreoRechazo } from './services/EmailService.js';

export const startCronJobs = () => {
    // Ejecutar todos los días a la medianoche (00:00)
    // Para probarlo, se podría usar '* * * * *' (cada minuto), pero lo dejaremos diario '0 0 * * *'
    cron.schedule('0 0 * * *', async () => {
        try {
            console.log("[CRON] Ejecutando tarea de rechazo de reservas vencidas...");
            
            // Obtener la fecha de hoy en formato YYYY-MM-DD local
            const tzoffset = (new Date()).getTimezoneOffset() * 60000; // offset in milliseconds
            const today = (new Date(Date.now() - tzoffset)).toISOString().split('T')[0];
            
            // Buscar reservas activas cuya fecha sea anterior a hoy
            const reservasVencidas = await ReservaModel.findAll({
                where: {
                    Fec_Reserva: { [Op.lt]: today },
                    Booleano: 'Activo'
                }
            });

            if(reservasVencidas.length > 0) {
                console.log(`[CRON] Se encontraron ${reservasVencidas.length} reservas vencidas.`);
                const estadoRechazado = await EstadoModel.findOne({ where: { Tip_Estado: 'Rechazado' }});
                
                const MOTIVO_VENCIMIENTO = "Reserva vencida automáticamente: no fue gestionada antes de la fecha solicitada. Por favor solicite una nueva reserva con otra fecha disponible.";

                if(estadoRechazado) {
                    for(const reserva of reservasVencidas) {
                        try {
                            // Usamos el servicio que ya maneja el cambio de estado y actualiza Booleano a Inactivo
                            await ReservaService.cambiarEstado(
                                reserva.Id_Reserva, 
                                estadoRechazado.Id_Estado, 
                                MOTIVO_VENCIMIENTO
                            );
                            console.log(`[CRON] Reserva ${reserva.Id_Reserva} rechazada automáticamente.`);

                            // Enviar correo de notificación al solicitante
                            try {
                                await enviarCorreoRechazo(
                                    reserva.Cor_Solicitante,
                                    reserva.Nom_Solicitante,
                                    reserva.Id_Reserva,
                                    reserva.Fec_Reserva,
                                    MOTIVO_VENCIMIENTO
                                );
                            } catch (emailError) {
                                console.error(`[CRON-EMAIL] Error enviando correo a ${reserva.Cor_Solicitante}:`, emailError.message);
                            }
                        } catch(e) {
                            console.error(`[CRON] Error al rechazar la reserva ${reserva.Id_Reserva}:`, e.message);
                        }
                    }
                } else {
                    console.error("[CRON] No se encontró el estado 'Rechazado' en la base de datos.");
                }
            } else {
                console.log("[CRON] No hay reservas vencidas.");
            }
        } catch (error) {
            console.error("[CRON] Error general en la tarea cron:", error);
        }
    });
};

