const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const homeController = require('../controllers/homeController');

// Validación de ID (asegura que el ID sea un número entero)
const validateID = [
  check('id')
    .notEmpty().withMessage('El ID es obligatorio')
    .isInt().withMessage('El ID debe ser un número entero')
];

// Middleware para manejar los errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Errores de validación:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get('/faq', homeController.getAllFaqs);

router.get('/testimonios', homeController.getApprovedTestimonials);
router.get('/testimonios/curso/:id', homeController.getTestimonialsByCurso);


module.exports = router;