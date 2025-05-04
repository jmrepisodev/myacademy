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
