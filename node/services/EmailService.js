import transporter from '../config/emailTransport.js';
import { getPasswordResetTemplate } from '../templates/passwordResetTemplate.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Servicio Centralizado y Modular de Envíos de Correo para BIOLAB.
 */
class EmailService {
  constructor() {
    this.transporter = transporter;
  }

  /**
   * Obtiene la dirección de remitente configurada.
   */
  getFromAddress() {
    const fromName = process.env.SMTP_FROM_NAME || 'BIOLAB - Laboratorio';
    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || 'no-reply@biolab.com';
    return `"${fromName}" <${fromEmail}>`;
  }

  /**
   * Envía un correo electrónico para restablecimiento de contraseña.
   * @param {Object} params
   * @param {string} params.to - Correo del usuario
   * @param {string} params.nombre - Nombre del usuario
   * @param {string} params.resetUrl - URL única con el token original (sin hash)
   * @param {number} params.expiresInMinutes - Tiempo de vigencia en minutos
   */
  async sendPasswordResetEmail({ to, nombre, resetUrl, expiresInMinutes = 15 }) {
    const { html, text } = getPasswordResetTemplate({ nombre, resetUrl, expiresInMinutes });

    const mailOptions = {
      from: this.getFromAddress(),
      to,
      subject: 'Recuperación de contraseña - BIOLAB',
      html,
      text,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`[EMAIL SUCCESS] Correo de recuperación enviado a: ${to} (ID: ${info.messageId})`);
      return true;
    } catch (error) {
      console.error(`[EMAIL ERROR] Error al enviar correo de recuperación a ${to}:`, error.message);
      return false;
    }
  }

  /**
   * Envía notificación de rechazo de reserva.
   */
  async enviarCorreoRechazo(correoDestino, nombreSolicitante, idReserva, fechaReserva, motivo) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://77.42.120.211';
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
              <tr>
                <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 32px 40px; text-align:center;">
                  <h1 style="color:#ffffff; margin:0; font-size:28px; font-weight:700; letter-spacing:2px;">🔬 BIOLAB</h1>
                  <p style="color:rgba(255,255,255,0.8); margin:8px 0 0; font-size:14px;">Sistema de Gestión de Laboratorios</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px;">
                  <h2 style="color:#1e293b; margin:0 0 8px; font-size:22px;">Notificación de Reserva</h2>
                  <p style="color:#64748b; margin:0 0 24px; font-size:15px;">Hola <strong>${nombreSolicitante}</strong>,</p>
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
      from: this.getFromAddress(),
      to: correoDestino,
      subject: `🔬 BIOLAB — Reserva #${idReserva} Rechazada`,
      html: htmlContent,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`[EMAIL] Correo de rechazo enviado a ${correoDestino} — ID: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error(`[EMAIL] Error al enviar correo a ${correoDestino}:`, error.message);
      return false;
    }
  }

  /**
   * Envía notificación de aprobación de reserva.
   */
  async enviarCorreoAprobacion(correoDestino, nombreSolicitante, idReserva, fechaReserva) {
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
              <tr>
                <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 32px 40px; text-align:center;">
                  <h1 style="color:#ffffff; margin:0; font-size:28px; font-weight:700; letter-spacing:2px;">🔬 BIOLAB</h1>
                  <p style="color:rgba(255,255,255,0.8); margin:8px 0 0; font-size:14px;">Sistema de Gestión de Laboratorios</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px;">
                  <h2 style="color:#1e293b; margin:0 0 8px; font-size:22px;">Notificación de Reserva</h2>
                  <p style="color:#64748b; margin:0 0 24px; font-size:15px;">Hola <strong>${nombreSolicitante}</strong>,</p>
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
      from: this.getFromAddress(),
      to: correoDestino,
      subject: `🔬 BIOLAB — Reserva #${idReserva} Aprobada`,
      html: htmlContent,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`[EMAIL] Correo de aprobación enviado a ${correoDestino} — ID: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error(`[EMAIL] Error al enviar correo a ${correoDestino}:`, error.message);
      return false;
    }
  }

  /**
   * Envía correo de registro.
   */
  async enviarCorreoRegistro(correoDestino, nombreUsuario) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://77.42.120.211';
    const linkLogin = `${frontendUrl}/login`;

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
              <tr>
                <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 32px 40px; text-align:center;">
                  <h1 style="color:#ffffff; margin:0; font-size:28px; font-weight:700; letter-spacing:2px;">🔬 BIOLAB</h1>
                  <p style="color:rgba(255,255,255,0.8); margin:8px 0 0; font-size:14px;">Bienvenido a nuestro Sistema de Gestión</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px;">
                  <h2 style="color:#1e293b; margin:0 0 8px; font-size:22px;">¡Registro Exitoso!</h2>
                  <p style="color:#64748b; margin:0 0 24px; font-size:15px;">Hola <strong>${nombreUsuario}</strong>,</p>
                  <p style="color:#64748b; margin:0 0 24px; font-size:14px; line-height:1.6;">
                    Tu cuenta ha sido creada exitosamente en el sistema BIOLAB. Ya puedes iniciar sesión para solicitar reservas de laboratorio, insumos y equipos.
                  </p>
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                    <tr>
                      <td align="center">
                        <a href="${linkLogin}" 
                           style="display:inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color:#ffffff; text-decoration:none; padding:14px 40px; border-radius:50px; font-size:15px; font-weight:600; letter-spacing:0.5px; box-shadow: 0 4px 12px rgba(37,99,235,0.3);">
                          🔑 Iniciar Sesión
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
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
      from: this.getFromAddress(),
      to: correoDestino,
      subject: `🔬 BIOLAB — Registro de Usuario Exitoso`,
      html: htmlContent,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`[EMAIL] Correo de registro enviado a ${correoDestino} — ID: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error(`[EMAIL] Error al enviar correo de registro a ${correoDestino}:`, error.message);
      return false;
    }
  }

  // ===============================================
  // MÉTODOS EXTENSIBLES (ARQUITECTURA PARA EL FUTURO)
  // ===============================================

  async sendWelcomeEmail(to, nombre) {
    return this.enviarCorreoRegistro(to, nombre);
  }

  async sendEmailVerification(to, nombre, verificationUrl) {
    console.log(`[EMAIL ARCHITECTURE] sendEmailVerification preparado para ${to}`);
    return true;
  }

  async sendPasswordChangedNotification(to, nombre) {
    console.log(`[EMAIL ARCHITECTURE] sendPasswordChangedNotification preparado para ${to}`);
    return true;
  }

  async sendAdminAlert(subject, message) {
    console.log(`[EMAIL ARCHITECTURE] sendAdminAlert preparado: ${subject}`);
    return true;
  }

  async sendAccountLockedNotification(to, nombre) {
    console.log(`[EMAIL ARCHITECTURE] sendAccountLockedNotification preparado para ${to}`);
    return true;
  }
}

const emailServiceInstance = new EmailService();

export const enviarCorreoRechazo = (c, n, i, f, m) => emailServiceInstance.enviarCorreoRechazo(c, n, i, f, m);
export const enviarCorreoAprobacion = (c, n, i, f) => emailServiceInstance.enviarCorreoAprobacion(c, n, i, f);
export const enviarCorreoRegistro = (c, n) => emailServiceInstance.enviarCorreoRegistro(c, n);

export default emailServiceInstance;
