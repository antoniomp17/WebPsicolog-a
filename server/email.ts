import { Resend } from 'resend';

// --- INICIO DE LA MODIFICACIÓN ---

// Lee las credenciales directamente de las variables de entorno
const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL;

// Obtiene la URL pública de la aplicación desde Render o usa la URL que has usado
const appUrl = process.env.RENDER_EXTERNAL_URL || 'https://patripsicologia.onrender.com';

// Crea una única instancia de Resend si las claves están presentes
let resend: Resend | null = null;
if (resendApiKey && resendFromEmail) {
  resend = new Resend(resendApiKey);
} else {
  // Advierte en los logs del servidor si faltan las claves
  console.warn(
    "ADVERTENCIA: Faltan las variables de entorno RESEND_API_KEY o RESEND_FROM_EMAIL. Los correos electrónicos no se enviarán."
  );
}

/**
 * Función helper genérica para enviar correos.
 * No lanza errores para no bloquear las rutas de la API (fire-and-forget).
 */
async function sendEmail(to: string, subject: string, html: string) {
  // No intentes enviar si el cliente no está configurado
  if (!resend || !resendFromEmail) {
    console.error(
      `Email no enviado a ${to} (Resend no configurado): ${subject}`
    );
    return;
  }

  try {
    const { error } = await resend.emails.send({
      from: resendFromEmail,
      to: to,
      subject: subject,
      html: html,
    });

    if (error) {
      console.error(`Error al enviar email a ${to}:`, error);
    } else {
      console.log(`Email enviado exitosamente a ${to}: ${subject}`);
    }
  } catch (error) {
    // Captura cualquier fallo crítico (ej. red)
    console.error('Fallo crítico al intentar enviar email:', error);
  }
}

// --- FIN DE LA MODIFICACIÓN ---


// Interfaces de datos (sin cambios)
export interface WelcomeEmailData {
  userName: string;
  userEmail: string;
}

export interface PaymentConfirmationEmailData {
  userName: string;
  userEmail: string;
  courseName: string;
  amount: number;
  paymentDate: string;
}

export interface AppointmentConfirmationEmailData {
  userName: string;
  userEmail: string;
  appointmentDate: string;
  appointmentTime: string;
}

// --- FUNCIONES DE EMAIL REFACTORIZADAS ---

/**
 * Envía el email de bienvenida.
 * Se ha modificado para usar el helper 'sendEmail' y la URL de producción.
 * Se ha quitado 'async' para que sea fire-and-forget y no bloquee la API.
 */
export function sendWelcomeEmail(data: WelcomeEmailData) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Inter, Arial, sans-serif; line-height: 1.6; color: #4E443A; background-color: #FDFBF5; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #C6A969; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: white; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background-color: #C6A969; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #8B7E74; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>PatriPsicología</h1>
          </div>
          <div class="content">
            <h2>¡Hola ${data.userName}!</h2>
            <p>Nos alegra darte la bienvenida a PatriPsicología, tu plataforma de psicología y bienestar.</p>
            <p>Aquí encontrarás:</p>
            <ul>
              <li>Cursos online especializados en gestión emocional</li>
              <li>Sesiones de terapia con profesionales certificados</li>
              <li>Recursos y artículos sobre salud mental</li>
            </ul>
            <p>Estamos aquí para acompañarte en tu camino hacia el bienestar emocional.</p>
            <a href="${appUrl}/cursos" class="button">Explorar Cursos</a>
          </div>
          <div class="footer">
            <p>PatriPsicología - Tu bienestar es nuestra prioridad</p>
          </div>
        </div>
      </body>
    </html>
  `;

  // No se usa 'await' para no bloquear la respuesta de la API
  sendEmail(data.userEmail, '¡Bienvenido a PatriPsicología!', html);
}

/**
 * Envía el email de confirmación de pago.
 * Modificado para usar 'sendEmail' y la URL de producción.
 */
export function sendPaymentConfirmationEmail(data: PaymentConfirmationEmailData) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Inter, Arial, sans-serif; line-height: 1.6; color: #4E443A; background-color: #FDFBF5; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #22C55E; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: white; padding: 30px; border-radius: 0 0 8px 8px; }
          .detail-box { background-color: #F0EDE7; padding: 20px; border-radius: 6px; margin: 20px 0; }
          .button { display: inline-block; background-color: #C6A969; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #8B7E74; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Pago Confirmado!</h1>
          </div>
          <div class="content">
            <h2>Hola ${data.userName},</h2>
            <p>Tu pago ha sido procesado exitosamente. Ya puedes acceder a tu curso.</p>
            <div class="detail-box">
              <p><strong>Curso:</strong> ${data.courseName}</p>
              <p><strong>Monto:</strong> €${(data.amount / 100).toFixed(2)}</p>
              <p><strong>Fecha:</strong> ${data.paymentDate}</p>
            </div>
            <p>Hemos enviado un recibo completo a tu correo electrónico.</p>
            <a href="${appUrl}/acceso-alumnos" class="button">Ir a Mis Cursos</a>
          </div>
          <div class="footer">
            <p>PatriPsicología - Tu bienestar es nuestra prioridad</p>
            <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  sendEmail(data.userEmail, '✓ Pago confirmado - PatriPsicología', html);
}

/**
 * Envía el email de confirmación de cita.
 * Modificado para usar 'sendEmail'.
 */
export function sendAppointmentConfirmationEmail(data: AppointmentConfirmationEmailData) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Inter, Arial, sans-serif; line-height: 1.6; color: #4E443A; background-color: #FDFBF5; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #C6A969; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: white; padding: 30px; border-radius: 0 0 8px 8px; }
          .appointment-box { background-color: #F0EDE7; padding: 20px; border-radius: 6px; margin: 20px 0; text-align: center; }
          .date-time { font-size: 24px; font-weight: bold; color: #C6A969; margin: 10px 0; }
          .footer { text-align: center; padding: 20px; color: #8B7E74; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Cita Confirmada</h1>
          </div>
          <div class="content">
            <h2>Hola ${data.userName},</h2>
            <p>Tu cita de terapia ha sido confirmada exitosamente.</p>
            <div class="appointment-box">
              <p><strong>Fecha de tu cita:</strong></p>
              <p class="date-time">${data.appointmentDate}</p>
              <p class="date-time">${data.appointmentTime}</p>
            </div>
            <p><strong>¿Qué necesitas saber?</strong></p>
            <ul>
              <li>Recibirás un recordatorio 24 horas antes de tu cita</li>
              <li>La sesión se realizará por videollamada</li>
              <li>Duración aproximada: 50 minutos</li>
              <li>Ten un espacio tranquilo y privado preparado</li>
            </ul>
            <p>Si necesitas reagendar o cancelar, por favor contáctanos con al menos 24 horas de anticipación.</p>
          </div>
          <div class="footer">
            <p>PatriPsicología - Tu bienestar es nuestra prioridad</p>
            <p>¿Preguntas? Estamos aquí para ayudarte.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  sendEmail(data.userEmail, '✓ Cita confirmada - PatriPsicología', html);
}