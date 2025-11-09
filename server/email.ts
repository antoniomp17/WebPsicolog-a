import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return {apiKey: connectionSettings.settings.api_key, fromEmail: connectionSettings.settings.from_email};
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
async function getUncachableResendClient() {
  const credentials = await getCredentials();
  return {
    client: new Resend(credentials.apiKey),
    fromEmail: connectionSettings.settings.from_email
  };
}

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

export async function sendWelcomeEmail(data: WelcomeEmailData) {
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    
    const { error } = await client.emails.send({
      from: fromEmail,
      to: data.userEmail,
      subject: '¡Bienvenido a PsicoBienestar!',
      html: `
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
                <h1>PsicoBienestar</h1>
              </div>
              <div class="content">
                <h2>¡Hola ${data.userName}!</h2>
                <p>Nos alegra darte la bienvenida a PsicoBienestar, tu plataforma de psicología y bienestar.</p>
                <p>Aquí encontrarás:</p>
                <ul>
                  <li>Cursos online especializados en gestión emocional</li>
                  <li>Sesiones de terapia con profesionales certificados</li>
                  <li>Recursos y artículos sobre salud mental</li>
                </ul>
                <p>Estamos aquí para acompañarte en tu camino hacia el bienestar emocional.</p>
                <a href="${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/cursos" class="button">Explorar Cursos</a>
              </div>
              <div class="footer">
                <p>PsicoBienestar - Tu bienestar es nuestra prioridad</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    throw error;
  }
}

export async function sendPaymentConfirmationEmail(data: PaymentConfirmationEmailData) {
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    
    const { error } = await client.emails.send({
      from: fromEmail,
      to: data.userEmail,
      subject: '✓ Pago confirmado - PsicoBienestar',
      html: `
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
                <a href="${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/acceso-alumnos" class="button">Ir a Mis Cursos</a>
              </div>
              <div class="footer">
                <p>PsicoBienestar - Tu bienestar es nuestra prioridad</p>
                <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending payment confirmation email:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to send payment confirmation email:', error);
    throw error;
  }
}

export async function sendAppointmentConfirmationEmail(data: AppointmentConfirmationEmailData) {
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    
    const { error } = await client.emails.send({
      from: fromEmail,
      to: data.userEmail,
      subject: '✓ Cita confirmada - PsicoBienestar',
      html: `
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
                <p>PsicoBienestar - Tu bienestar es nuestra prioridad</p>
                <p>¿Preguntas? Estamos aquí para ayudarte.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending appointment confirmation email:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to send appointment confirmation email:', error);
    throw error;
  }
}
