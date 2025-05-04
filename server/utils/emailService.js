
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

// 🔐 Variables de entorno necesarias
const {
  EMAIL_HOST,
  EMAIL_USER,
  EMAIL_PASS,
  API_URL,
} = process.env;

// 📦 Transporter seguro y eficiente (SMTP + SSL)
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: 465,
  secure: true, // SSL
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
  logger: process.env.NODE_ENV !== 'production', // Logs en desarrollo
});

// 📧 Enviar email de recuperación de contraseña
exports.sendResetEmail = async (email, resetToken) => {
  try {
    const resetUrl = `${API_URL}/api/auth/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: '"MyAcademy" <no-reply@myacademy.es>',
      to: email,
      subject: 'Recuperación de contraseña',
      text: `Hola,\n\nHaz click en el siguiente enlace para restablecer tu contraseña:\n${resetUrl}\n\nSi no solicitaste este cambio, ignora este mensaje.`,
      html: `
        <p>Hola,</p>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error al enviar email de recuperación:', error);
    throw new Error('No se pudo enviar el email de recuperación');
  }
};

// 📧 Enviar email de verificación de cuenta
exports.sendVerificationEmail = async (email, token) => {
  try {
    const verificationUrl = `${API_URL}/api/auth/verify-email?token=${token}`;

    const mailOptions = {
      from: '"MyAcademy" <no-reply@myacademy.es>',
      to: email,
      subject: 'Verificación de Email',
      text: `Hola,\n\nVerifica tu cuenta aquí: ${verificationUrl}\n\nSi no solicitaste este registro, ignora este mensaje.`,
      html: `
        <p>Hola,</p>
        <p>Haz clic en el siguiente enlace para verificar tu correo:</p>
        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
        <p>Si no solicitaste el registro, ignora este mensaje.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error al enviar email de verificación:', error);
    throw new Error('No se pudo enviar el email de verificación');
  }
};


// 📧 Enviar formulario de contacto
exports.sendContactFormEmail = async (name, email, message) => {
  try {
    if (!name || !email || !message) {
      throw new Error('Todos los campos del formulario son obligatorios');
    }

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: 'contacto@myacademy.es',
      subject: 'Nuevo mensaje de contacto',
     //text:'',
      html: `
        <h3>Nuevo mensaje desde el formulario de contacto</h3>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong><br/>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error al enviar formulario de contacto:', error);
    throw new Error('No se pudo enviar el mensaje de contacto');
  }
};
