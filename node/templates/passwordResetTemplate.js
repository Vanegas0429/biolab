/**
 * Genera la plantilla de correo en HTML y texto plano para la recuperación de contraseña en BIOLAB.
 * @param {Object} options
 * @param {string} options.nombre - Nombre del destinatario
 * @param {string} options.resetUrl - URL única de restablecimiento
 * @param {number} options.expiresInMinutes - Minutos de vigencia del enlace
 */
export function getPasswordResetTemplate({ nombre, resetUrl, expiresInMinutes = 15 }) {
  const year = new Date().getFullYear();
  const safeNombre = nombre || 'Usuario';

  const html = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperación de Contraseña - BIOLAB</title>
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
                <p style="color:rgba(255,255,255,0.85); margin:8px 0 0; font-size:14px;">Sistema de Gestión de Laboratorios</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 40px;">
                <h2 style="color:#1e293b; margin:0 0 8px; font-size:22px;">Recuperación de Contraseña</h2>
                <p style="color:#64748b; margin:0 0 24px; font-size:15px;">Hola <strong>${safeNombre}</strong>,</p>
                
                <p style="color:#475569; margin:0 0 20px; font-size:14px; line-height:1.6;">
                  Hemos recibido una solicitud para restablecer la contraseña de su cuenta en BIOLAB. Para asignar una nueva contraseña, haga clic en el botón a continuación:
                </p>

                <!-- CTA Button -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                  <tr>
                    <td align="center">
                      <a href="${resetUrl}" 
                         target="_blank"
                         style="display:inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color:#ffffff; text-decoration:none; padding:14px 36px; border-radius:50px; font-size:15px; font-weight:600; letter-spacing:0.5px; box-shadow: 0 4px 12px rgba(37,99,235,0.3);">
                        🔑 Restablecer Contraseña
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="color:#64748b; margin:0 0 10px; font-size:13px; line-height:1.6;">
                  O copie y pegue la siguiente URL en su navegador web:
                </p>
                <p style="background-color:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px; font-size:12px; color:#1e293b; word-break:break-all;">
                  <a href="${resetUrl}" style="color:#2563eb; text-decoration:underline;">${resetUrl}</a>
                </p>

                <!-- Warning Box -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px; margin-bottom:16px;">
                  <tr>
                    <td style="background-color:#fffbe6; border-left:4px solid #f59e0b; border-radius:8px; padding:16px;">
                      <p style="color:#b45309; margin:0 0 4px; font-size:13px; font-weight:600;">
                        ⏱ Este enlace expira en ${expiresInMinutes} minutos.
                      </p>
                      <p style="color:#78350f; margin:0; font-size:12px; line-height:1.5;">
                        Por razones de seguridad, solo se puede utilizar una vez. Si no realizó esta solicitud, puede ignorar este mensaje de forma segura; su contraseña actual no cambiará.
                      </p>
                    </td>
                  </tr>
                </table>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color:#f8fafc; padding: 24px 40px; border-top:1px solid #e2e8f0; text-align:center;">
                <p style="color:#94a3b8; margin:0; font-size:12px;">
                  Este es un mensaje automático del sistema BIOLAB. Por favor no responda a este correo.
                </p>
                <p style="color:#cbd5e1; margin:8px 0 0; font-size:11px;">
                  © ${year} BIOLAB — Centro de Formación SENA
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

  const text = `
BIOLAB - Recuperación de Contraseña

Hola ${safeNombre},

Hemos recibido una solicitud para restablecer la contraseña de su cuenta en BIOLAB.
Para asignar una nueva contraseña, visite la siguiente dirección web:

${resetUrl}

Este enlace es válido durante los próximos ${expiresInMinutes} minutos y sólo puede ser utilizado una vez.

Si no solicitó este cambio, ignore este mensaje.

Atentamente,
El equipo de BIOLAB
  `;

  return { html, text };
}
