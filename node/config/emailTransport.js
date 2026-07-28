import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Crea y exporta la instancia del transportador SMTP de Nodemailer.
 * Utiliza variables de entorno para una configuración flexible y segura.
 */
export const createEmailTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true'; // false para puerto 587 con STARTTLS

  const config = {
    host,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };

  // Soporte explícito para servicio gmail si SMTP_HOST no es especificado
  if (!process.env.SMTP_HOST && process.env.SMTP_USER) {
    delete config.host;
    delete config.port;
    config.service = 'gmail';
  }

  const transporter = nodemailer.createTransport(config);

  return transporter;
};

const transporter = createEmailTransporter();

/**
 * Verifica la validez de las credenciales y la conexión con el servidor SMTP.
 */
export const verifyTransporterConnection = async () => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('[EMAIL WARNING] Credenciales SMTP no configuradas. El envío de correos estará inactivo.');
    return false;
  }
  try {
    await transporter.verify();
    console.log('[EMAIL SUCCESS] Conexión SMTP verificada exitosamente.');
    return true;
  } catch (error) {
    console.error('[EMAIL ERROR] Error al conectar con el servidor SMTP:', error.message);
    return false;
  }
};

export default transporter;
