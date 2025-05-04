const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator');

// Validación para el registro y login
const registerValidation = [
    check('name').notEmpty().withMessage('Nombre es obligatorio'),
    check('email').isEmail().normalizeEmail().withMessage('Email no válido'),
    check('password').isLength({ min: 6 }).withMessage('Contraseña debe tener al menos 6 caracteres')
  ];
  
  const loginValidation = [
    check('email').isEmail().normalizeEmail().withMessage('Email no válido'),
    check('password').notEmpty().withMessage('Contraseña es requerida')
  ];

router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);

// Rutas para procesar la validación de email
router.get('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerificationEmail);
router.post('/request-password-reset', [check('email').notEmpty().isEmail().normalizeEmail().withMessage('Email no válido')], authController.requestPasswordReset);

// Ruta POST para procesar el restablecimiento de la contraseña
router.post('/reset-password', authController.resetPassword);
// Ruta GET para mostrar el formulario
router.get('/reset-password', authController.showFormResetPassword);

module.exports = router;
