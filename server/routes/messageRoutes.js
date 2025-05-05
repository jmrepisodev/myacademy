const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/authMiddleware');

// Validación de datos de Curso
const messageValidation = [
  check('id').optional().notEmpty().withMessage('El ID es obligatorio').isInt().withMessage('El ID debe ser un número entero'),
  check('text').notEmpty().withMessage('El texto es obligatorio').trim(),
  check('usuario_id').optional().notEmpty().withMessage('El ID usuario es obligatorio').isInt().withMessage('El ID usuario debe ser un número entero'),
  check('tema_id').optional().notEmpty().withMessage('El ID tema es obligatorio').isInt().withMessage('El ID tema debe ser un número entero')
];

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
    return res.status(400).json({ errors: errors.array() }); // Puedes personalizar esto para redirigir a la vista con errores
  }
  next();
};

// Rutas CRUD (/api/chat/)

//router.get('/', messageController.getAllCursos); //todos los registros
router.get('/tema/:id',  validateID, handleValidationErrors, messageController.getMessagesByTemaId); //mostrar registros en función del tema

router.post('/store', auth, messageValidation, handleValidationErrors, messageController.createMessage); //create

//router.get('/:id', validateID, handleValidationErrors, messageController.getCursoById); //show

//router.put('/update/:id', auth, messageValidation, handleValidationErrors, messageController.updateCurso); //update

//router.delete('/delete/:id', auth, validateID, handleValidationErrors, messageController.deleteCurso);  //delete


module.exports = router;