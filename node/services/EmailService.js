import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config(); // Fallback to current working directory

// Configuración del transporter SMTP (puerto 587 STARTTLS para máxima compatibilidad con Hetzner y Gmail)
function getTransporter() {
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || '';
  const pass = (process.env.SMTP_PASS || '').replace(/\s+/g, '');

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: smtpPort,
    secure: smtpPort === 465, // false para puerto 587 (STARTTLS)
    auth: {
      user: user,
      pass: pass,
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000
  });
}

/**
 * Envía un correo de notificación de rechazo de reserva al solicitante.
 */
export async function enviarCorreoRechazo(correoDestino, nombreSolicitante, idReserva, fechaReserva, motivo) {
  const frontendUrl = process.env.FRONTEND_URL || 'https://biolabdigital.com';
  const linkNuevaReserva = `${frontendUrl}/Reserva`;

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
  </head>
  <body style="margin:0; padding:0; background-color:#f1f5f9; font-family: 'Segoe UI', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9; padding: 30px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
            <tr>
              <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 28px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:26px; font-weight:bold;">🔬 BIOLAB</h1>
                <p style="color:rgba(255,255,255,0.85); margin:6px 0 0; font-size:14px;">Sistema de Gestión de Laboratorios</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 32px;">
                <h2 style="color:#1e293b; margin:0 0 12px; font-size:20px;">Notificación de Reserva</h2>
                <p style="color:#475569; margin:0 0 20px; font-size:15px;">Hola <strong>${nombreSolicitante || 'Usuario'}</strong>,</p>
                
                <div style="background-color:#fef2f2; border-left:4px solid #ef4444; border-radius:6px; padding:16px; margin-bottom:20px;">
                  <p style="color:#991b1b; margin:0 0 4px; font-size:14px; font-weight:bold;">❌ Reserva #${idReserva} — Rechazada</p>
                  <p style="color:#7f1d1d; margin:0; font-size:13px;">Fecha solicitada: <strong>${fechaReserva}</strong></p>
                </div>

                <div style="background-color:#f8fafc; border-radius:6px; padding:16px; margin-bottom:24px; border:1px solid #e2e8f0;">
                  <p style="color:#64748b; margin:0 0 6px; font-size:12px; font-weight:bold; text-transform:uppercase;">Motivo del rechazo:</p>
                  <p style="color:#1e293b; margin:0; font-size:14px; line-height:1.5;">${motivo}</p>
                </div>

                <p style="color:#475569; margin:0 0 24px; font-size:14px;">Puede solicitar una nueva reserva a través del siguiente enlace:</p>

                <div style="text-align:center; margin-bottom:24px;">
                  <a href="${linkNuevaReserva}" style="display:inline-block; background-color:#2563eb; color:#ffffff; text-decoration:none; padding:12px 32px; border-radius:30px; font-size:15px; font-weight:bold;">📅 Solicitar Nueva Reserva</a>
                </div>
              </td>
            </tr>
            <tr>
              <td style="background-color:#f8fafc; padding: 20px; border-top:1px solid #e2e8f0; text-align:center;">
                <p style="color:#94a3b8; margin:0; font-size:12px;">BIOLAB — Centro de Formación SENA</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  const textContent = `BIOLAB — Notificación de Reserva

Hola ${nombreSolicitante || 'Usuario'},

Su reserva #${idReserva} para la fecha ${fechaReserva} ha sido rechazada.
Motivo: ${motivo}

Puede solicitar una nueva reserva en: ${linkNuevaReserva}

BIOLAB — Centro de Formación SENA`;

  const mailOptions = {
    from: `"BIOLAB - Laboratorio" <${process.env.SMTP_USER}>`,
    to: correoDestino,
    subject: `🔬 BIOLAB — Reserva #${idReserva} Rechazada`,
    text: textContent,
    html: htmlContent,
  };

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] Correo de rechazo enviado a ${correoDestino} — ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`[EMAIL] Error al enviar correo a ${correoDestino}:`, error.message);
    return false;
  }
}

/**
 * Envía un correo de notificación de aprobación de reserva al solicitante.
 */
export async function enviarCorreoAprobacion(correoDestino, nombreSolicitante, idReserva, fechaReserva) {
  const frontendUrl = process.env.FRONTEND_URL || 'https://biolabdigital.com';

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
  </head>
  <body style="margin:0; padding:0; background-color:#f1f5f9; font-family: 'Segoe UI', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9; padding: 30px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
            <tr>
              <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 28px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:26px; font-weight:bold;">🔬 BIOLAB</h1>
                <p style="color:rgba(255,255,255,0.85); margin:6px 0 0; font-size:14px;">Sistema de Gestión de Laboratorios</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 32px;">
                <h2 style="color:#1e293b; margin:0 0 12px; font-size:20px;">¡Reserva Aprobada!</h2>
                <p style="color:#475569; margin:0 0 20px; font-size:15px;">Hola <strong>${nombreSolicitante || 'Usuario'}</strong>,</p>
                
                <div style="background-color:#ecfdf5; border-left:4px solid #10b981; border-radius:6px; padding:16px; margin-bottom:20px;">
                  <p style="color:#065f46; margin:0 0 4px; font-size:14px; font-weight:bold;">✅ Reserva #${idReserva} — Confirmada</p>
                  <p style="color:#064e3b; margin:0; font-size:13px;">Fecha programada: <strong>${fechaReserva}</strong></p>
                </div>

                <p style="color:#475569; margin:0; font-size:14px; line-height:1.6;">
                  Su solicitud de reserva ha sido aprobada por el administrador. Le esperamos en el laboratorio en la fecha y hora acordadas.
                </p>
              </td>
            </tr>
            <tr>
              <td style="background-color:#f8fafc; padding: 20px; border-top:1px solid #e2e8f0; text-align:center;">
                <p style="color:#94a3b8; margin:0; font-size:12px;">BIOLAB — Centro de Formación SENA</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  const textContent = `BIOLAB — Reserva Aprobada

Hola ${nombreSolicitante || 'Usuario'},

Su reserva #${idReserva} para la fecha ${fechaReserva} ha sido aprobada. Le esperamos en el laboratorio.

BIOLAB — Centro de Formación SENA`;

  const mailOptions = {
    from: `"BIOLAB - Laboratorio" <${process.env.SMTP_USER}>`,
    to: correoDestino,
    subject: `🔬 BIOLAB — Reserva #${idReserva} Aprobada`,
    text: textContent,
    html: htmlContent,
  };

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] Correo de aprobación enviado a ${correoDestino} — ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`[EMAIL] Error al enviar correo a ${correoDestino}:`, error.message);
    return false;
  }
}

/**
 * Envía un correo de recuperación de contraseña con enlace y botón interactivo.
 */
export async function enviarCorreoRecuperacion(correoDestino, nombreSolicitante, token) {
  const frontendUrl = process.env.FRONTEND_URL || 'https://biolabdigital.com';
  const linkRecuperacion = `${frontendUrl}/RestablecerPassword/${token}`;

  console.log(`[EMAIL] 🔑 Preparando envío de recuperación para ${correoDestino}`);
  console.log(`[EMAIL] 🔗 Enlace generado: ${linkRecuperacion}`);

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error(`[EMAIL] ❌ SMTP_USER o SMTP_PASS no configurados en .env`);
    return false;
  }

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
  </head>
  <body style="margin:0; padding:0; background-color:#f1f5f9; font-family: 'Segoe UI', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9; padding: 30px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #0f766e 0%, #0d9488 100%); padding: 32px 40px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:28px; font-weight:700; letter-spacing:1px;">🔬 BIOLAB</h1>
                <p style="color:rgba(255,255,255,0.9); margin:8px 0 0; font-size:14px;">Sistema de Gestión de Laboratorios</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 36px 40px;">
                <h2 style="color:#0f172a; margin:0 0 10px; font-size:22px; font-weight:700;">Recuperación de Contraseña</h2>
                <p style="color:#475569; margin:0 0 20px; font-size:15px;">Hola <strong>${nombreSolicitante || 'Usuario'}</strong>,</p>
                
                <p style="color:#334155; margin:0 0 28px; font-size:15px; line-height:1.6;">
                  Hemos recibido una solicitud para restablecer la contraseña de su cuenta en BIOLAB. Para continuar con el proceso, haga clic en el botón de abajo:
                </p>

                <!-- CTA Button -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
                  <tr>
                    <td align="center">
                      <a href="${linkRecuperacion}" 
                         target="_blank"
                         style="display:inline-block; background-color:#0d9488; color:#ffffff; text-decoration:none; padding:15px 38px; border-radius:50px; font-size:16px; font-weight:700; letter-spacing:0.5px; box-shadow: 0 4px 14px rgba(13,148,136,0.35);">
                        🔑 Restablecer mi Contraseña
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="color:#64748b; margin:0 0 8px; font-size:13px; line-height:1.5;">
                  Si el botón no funciona, copie y pegue el siguiente enlace directamente en su navegador web:
                </p>
                
                <div style="background-color:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:12px; margin-bottom:24px; word-break:break-all;">
                  <a href="${linkRecuperacion}" style="color:#0d9488; text-decoration:underline; font-size:13px;">
                    ${linkRecuperacion}
                  </a>
                </div>

                <div style="background-color:#fffbeb; border-left:4px solid #f59e0b; border-radius:6px; padding:12px 16px;">
                  <p style="color:#92400e; margin:0; font-size:13px; line-height:1.4;">
                    ⏱️ Este enlace es válido por <strong>15 minutos</strong>. Si usted no realizó esta solicitud, puede ignorar este mensaje de forma segura.
                  </p>
                </div>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color:#f8fafc; padding: 20px 40px; border-top:1px solid #e2e8f0; text-align:center;">
                <p style="color:#94a3b8; margin:0; font-size:12px;">
                  Este es un correo automático generado por el sistema BIOLAB.<br>
                  Por favor no responda a este mensaje.
                </p>
                <p style="color:#cbd5e1; margin:6px 0 0; font-size:11px;">
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

  const textContent = `BIOLAB — Recuperación de Contraseña

Hola ${nombreSolicitante || 'Usuario'},

Hemos recibido una solicitud para restablecer la contraseña de su cuenta en BIOLAB.

Para asignar una nueva contraseña, ingrese al siguiente enlace:
${linkRecuperacion}

Este enlace es válido por 15 minutos. Si usted no realizó esta solicitud, puede ignorar este correo.

BIOLAB — Centro de Formación SENA`;

  const mailOptions = {
    from: `"BIOLAB - Laboratorio" <${process.env.SMTP_USER}>`,
    to: correoDestino,
    subject: `🔬 BIOLAB — Enlace para Restablecer su Contraseña`,
    text: textContent,
    html: htmlContent,
  };

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] ✅ Correo de recuperación enviado con éxito a ${correoDestino} — ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`[EMAIL] ❌ Error al enviar correo de recuperación a ${correoDestino}:`, error.message);
    return false;
  }
}

/**
 * Envía un correo de bienvenida al registrar un nuevo usuario.
 */
export async function enviarCorreoRegistro(correoDestino, nombreUsuario) {
  const frontendUrl = process.env.FRONTEND_URL || 'https://biolabdigital.com';
  const linkLogin = `${frontendUrl}/Login`;

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
  </head>
  <body style="margin:0; padding:0; background-color:#f1f5f9; font-family: 'Segoe UI', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9; padding: 30px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #0f766e 0%, #0d9488 100%); padding: 32px 40px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:28px; font-weight:700;">🔬 BIOLAB</h1>
                <p style="color:rgba(255,255,255,0.9); margin:8px 0 0; font-size:14px;">Bienvenido a nuestro Sistema de Gestión</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 36px 40px;">
                <h2 style="color:#0f172a; margin:0 0 10px; font-size:22px;">¡Registro Exitoso!</h2>
                <p style="color:#475569; margin:0 0 20px; font-size:15px;">Hola <strong>${nombreUsuario || 'Usuario'}</strong>,</p>
                
                <p style="color:#334155; margin:0 0 28px; font-size:15px; line-height:1.6;">
                  Tu cuenta ha sido creada exitosamente en el sistema BIOLAB. Ya puedes iniciar sesión para gestionar tus solicitudes de laboratorio, insumos y equipos.
                </p>

                <!-- CTA Button -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                  <tr>
                    <td align="center">
                      <a href="${linkLogin}" 
                         target="_blank"
                         style="display:inline-block; background-color:#0d9488; color:#ffffff; text-decoration:none; padding:15px 38px; border-radius:50px; font-size:16px; font-weight:700; box-shadow: 0 4px 14px rgba(13,148,136,0.35);">
                        🔑 Iniciar Sesión en BIOLAB
                      </a>
                    </td>
                  </tr>
                </table>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color:#f8fafc; padding: 20px 40px; border-top:1px solid #e2e8f0; text-align:center;">
                <p style="color:#94a3b8; margin:0; font-size:12px;">
                  BIOLAB — Centro de Formación SENA
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

  const textContent = `BIOLAB — Bienvenido

Hola ${nombreUsuario || 'Usuario'},

Su cuenta ha sido creada exitosamente en BIOLAB.
Inicie sesión aquí: ${linkLogin}

BIOLAB — Centro de Formación SENA`;

  const mailOptions = {
    from: `"BIOLAB - Laboratorio" <${process.env.SMTP_USER}>`,
    to: correoDestino,
    subject: `🔬 BIOLAB — Registro de Usuario Exitoso`,
    text: textContent,
    html: htmlContent,
  };

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] Correo de registro enviado a ${correoDestino} — ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`[EMAIL] Error al enviar correo de registro a ${correoDestino}:`, error.message);
    return false;
  }
}

export default {
  enviarCorreoRechazo,
  enviarCorreoAprobacion,
  enviarCorreoRecuperacion,
  enviarCorreoRegistro,
};


