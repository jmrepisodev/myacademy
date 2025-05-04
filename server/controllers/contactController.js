// controllers/contactController.js
const emailService = require('../utils/emailService');

exports.sendContactForm = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await emailService.sendContactFormEmail(name, email, message);
    res.status(200).json({ message: 'Mensaje enviado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


 //Almacena la información de contacto
 exports.sendMessage = async (req, res) => {
  const { nombre, email, asunto, mensaje } = req.body;

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ error: 'Nombre, email y mensaje son obligatorios' });
  }

  try {

      await db.query('INSERT INTO contacto (nombre, email, asunto, mensaje) VALUES (?, ?, ?, ?)', [nombre, email, asunto || '', mensaje]);
  
      res.status(201).json({ message: 'Mensaje enviado correctamente' });
    } catch (error) {
      // Manejo de errores
      return res.status(500).json({ error: 'Error interno del servidor: error al enviar el mensaje' + error.message });
    }

};

