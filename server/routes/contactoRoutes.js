
// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { body, validationResult } = require('express-validator');

router.post('/', [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio.'),
  body('email').isEmail().withMessage('Debe ser un email válido.'),
  body('mensaje').trim().notEmpty().withMessage('El mensaje no puede estar vacío.')
], contactController.sendContactForm);

module.exports = router;


