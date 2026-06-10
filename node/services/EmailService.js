import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configuración del transporter SMTP (Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Envía un correo de notificación de rechazo de reserva al solicitante.
 * @param {string} correoDestino - Email del solicitante
 * @param {string} nombreSolicitante - Nombre del solicitante
 * @param {number} idReserva - ID de la reserva rechazada
 * @param {string} fechaReserva - Fecha de la reserva (YYYY-MM-DD)
 * @param {string} motivo - Motivo del rechazo
 */
export async function enviarCorreoRechazo(correoDestino, nombreSolicitante, idReserva, fechaReserva, motivo) {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const linkNuevaReserva = `${frontendUrl}/Reserva`;

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin:0; padding:0; background-color:#f1f5f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9; padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 32px 40px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:28px; font-weight:700; letter-spacing:2px;">🔬 BIOLAB</h1>
                <p style="color:rgba(255,255,255,0.8); margin:8px 0 0; font-size:14px;">Sistema de Gestión de Laboratorios</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 40px;">
                <h2 style="color:#1e293b; margin:0 0 8px; font-size:22px;">Notificación de Reserva</h2>
                <p style="color:#64748b; margin:0 0 24px; font-size:15px;">Hola <strong>${nombreSolicitante}</strong>,</p>
                
                <!-- Alert Box -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                  <tr>
                    <td style="background-color:#fef2f2; border-left:4px solid #ef4444; border-radius:8px; padding:20px;">
                      <p style="color:#991b1b; margin:0 0 4px; font-size:14px; font-weight:600;">
                        ❌ Reserva #${idReserva} — Rechazada
                      </p>
                      <p style="color:#7f1d1d; margin:0; font-size:13px;">
                        Fecha solicitada: <strong>${fechaReserva}</strong>
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- Motivo -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                  <tr>
                    <td style="background-color:#f8fafc; border-radius:8px; padding:20px; border:1px solid #e2e8f0;">
                      <p style="color:#475569; margin:0 0 6px; font-size:13px; font-weight:600; text-transform:uppercase; letter-spacing:1px;">Motivo del rechazo:</p>
                      <p style="color:#1e293b; margin:0; font-size:15px; line-height:1.6;">${motivo}</p>
                    </td>
                  </tr>
                </table>

                <p style="color:#64748b; margin:0 0 24px; font-size:14px; line-height:1.6;">
                  Puede solicitar una nueva reserva seleccionando otra fecha disponible a través del siguiente enlace:
                </p>

                <!-- CTA Button -->
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center">
                      <a href="${linkNuevaReserva}" 
                         style="display:inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color:#ffffff; text-decoration:none; padding:14px 40px; border-radius:50px; font-size:15px; font-weight:600; letter-spacing:0.5px; box-shadow: 0 4px 12px rgba(37,99,235,0.3);">
                        📅 Solicitar Nueva Reserva
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color:#f8fafc; padding: 24px 40px; border-top:1px solid #e2e8f0; text-align:center;">
                <p style="color:#94a3b8; margin:0; font-size:12px;">
                  Este es un correo automático del sistema BIOLAB.<br>
                  Por favor no responda a este mensaje.
                </p>
                <p style="color:#cbd5e1; margin:8px 0 0; font-size:11px;">
                  © ${new Date().getFullYear()} BIOLAB — Centro de Formación SENA
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  const mailOptions = {
    from: `"BIOLAB - Laboratorio" <${process.env.SMTP_USER}>`,
    to: correoDestino,
    subject: `🔬 BIOLAB — Reserva #${idReserva} Rechazada`,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] Correo de rechazo enviado a ${correoDestino} — ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`[EMAIL] Error al enviar correo a ${correoDestino}:`, error.message);
    // No lanzar error para no bloquear el flujo principal
    return false;
  }
}

/**
 * Envía un correo de notificación de aprobación de reserva al solicitante.
 * @param {string} correoDestino - Email del solicitante
 * @param {string} nombreSolicitante - Nombre del solicitante
 * @param {number} idReserva - ID de la reserva aprobada
 * @param {string} fechaReserva - Fecha de la reserva (YYYY-MM-DD)
 */
export async function enviarCorreoAprobacion(correoDestino, nombreSolicitante, idReserva, fechaReserva) {
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin:0; padding:0; background-color:#f1f5f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9; padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 32px 40px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:28px; font-weight:700; letter-spacing:2px;">🔬 BIOLAB</h1>
                <p style="color:rgba(255,255,255,0.8); margin:8px 0 0; font-size:14px;">Sistema de Gestión de Laboratorios</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 40px;">
                <h2 style="color:#1e293b; margin:0 0 8px; font-size:22px;">Notificación de Reserva</h2>
                <p style="color:#64748b; margin:0 0 24px; font-size:15px;">Hola <strong>${nombreSolicitante}</strong>,</p>
                
                <!-- Alert Box -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                  <tr>
                    <td style="background-color:#ecfdf5; border-left:4px solid #10b981; border-radius:8px; padding:20px;">
                      <p style="color:#065f46; margin:0 0 4px; font-size:14px; font-weight:600;">
                        ✅ Reserva #${idReserva} — Aprobada
                      </p>
                      <p style="color:#064e3b; margin:0; font-size:13px;">
                        Fecha confirmada: <strong>${fechaReserva}</strong>
                      </p>
                    </td>
                  </tr>
                </table>

                <p style="color:#64748b; margin:0 0 24px; font-size:14px; line-height:1.6;">
                  Su solicitud de reserva ha sido revisada y aprobada por el administrador. Le esperamos en el laboratorio en la fecha y hora acordadas.
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color:#f8fafc; padding: 24px 40px; border-top:1px solid #e2e8f0; text-align:center;">
                <p style="color:#94a3b8; margin:0; font-size:12px;">
                  Este es un correo automático del sistema BIOLAB.<br>
                  Por favor no responda a este mensaje.
                </p>
                <p style="color:#cbd5e1; margin:8px 0 0; font-size:11px;">
                  © ${new Date().getFullYear()} BIOLAB — Centro de Formación SENA
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  const mailOptions = {
    from: `"BIOLAB - Laboratorio" <${process.env.SMTP_USER}>`,
    to: correoDestino,
    subject: `🔬 BIOLAB — Reserva #${idReserva} Aprobada`,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] Correo de aprobación enviado a ${correoDestino} — ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`[EMAIL] Error al enviar correo a ${correoDestino}:`, error.message);
    return false;
  }
}

/**
 * Envía un correo de notificación con enlace para restablecer la contraseña.
 * @param {string} correoDestino - Email del solicitante
 * @param {string} nombreSolicitante - Nombre del solicitante
 * @param {string} token - Token único de recuperación
 */
export async function enviarCorreoRecuperacion(correoDestino, nombreSolicitante, token) {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const linkRecuperacion = `${frontendUrl}/RestablecerPassword/${token}`;

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin:0; padding:0; background-color:#f1f5f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9; padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 32px 40px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:28px; font-weight:700; letter-spacing:2px;">🔬 BIOLAB</h1>
                <p style="color:rgba(255,255,255,0.8); margin:8px 0 0; font-size:14px;">Sistema de Gestión de Laboratorios</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 40px;">
                <h2 style="color:#1e293b; margin:0 0 8px; font-size:22px;">Recuperación de Contraseña</h2>
                <p style="color:#64748b; margin:0 0 24px; font-size:15px;">Hola <strong>${nombreSolicitante}</strong>,</p>
                
                <p style="color:#64748b; margin:0 0 24px; font-size:14px; line-height:1.6;">
                  Hemos recibido una solicitud para restablecer la contraseña de su cuenta en BIOLAB. Haga clic en el botón de abajo para asignar una nueva contraseña.
                </p>

                <!-- CTA Button -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                  <tr>
                    <td align="center">
                      <a href="${linkRecuperacion}" 
                         style="display:inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color:#ffffff; text-decoration:none; padding:14px 40px; border-radius:50px; font-size:15px; font-weight:600; letter-spacing:0.5px; box-shadow: 0 4px 12px rgba(37,99,235,0.3);">
                        🔑 Restablecer Contraseña
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="color:#64748b; margin:0 0 10px; font-size:14px; line-height:1.6;">
                  O copie y pegue el siguiente enlace en su navegador:
                </p>
                <p style="background-color:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px; font-size:12px; color:#1e293b; word-break:break-all;">
                  ${linkRecuperacion}
                </p>

                <p style="color:#94a3b8; margin:24px 0 0; font-size:13px; line-height:1.6;">
                  Si usted no solicitó este cambio, por favor ignore este correo.
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color:#f8fafc; padding: 24px 40px; border-top:1px solid #e2e8f0; text-align:center;">
                <p style="color:#94a3b8; margin:0; font-size:12px;">
                  Este es un correo automático del sistema BIOLAB.<br>
                  Por favor no responda a este mensaje.
                </p>
                <p style="color:#cbd5e1; margin:8px 0 0; font-size:11px;">
                  © ${new Date().getFullYear()} BIOLAB — Centro de Formación SENA
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  const mailOptions = {
    from: `"BIOLAB - Laboratorio" <${process.env.SMTP_USER}>`,
    to: correoDestino,
    subject: `🔬 BIOLAB — Recuperación de Contraseña`,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] Correo de recuperación enviado a ${correoDestino} — ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`[EMAIL] Error al enviar correo de recuperación a ${correoDestino}:`, error.message);
    return false;
  }
}

export default {
  enviarCorreoRechazo,
  enviarCorreoAprobacion,
  enviarCorreoRecuperacion,
};
