const express = require('express');
const router = express.Router();
const questionController = require('../controllers/preguntasController');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/authMiddleware');

// Validación de datos de question
const questionValidation = [
  check('id').optional().notEmpty().withMessage('El ID es obligatorio').isInt().withMessage('El ID debe ser un número entero'),
  check('test_id').optional().notEmpty().withMessage('El ID test es obligatorio').isInt().withMessage('El ID test debe ser un número entero'),
  check('question').notEmpty().withMessage ('Debe introducir un texto a la pregunta').trim(),
  check('option1').notEmpty().withMessage ('Debe introducir un texto a la opción 1').escape().trim(),
  check('option2').notEmpty().withMessage ('Debe introducir un texto a la opción 2').escape().trim(),
  check('option3').notEmpty().withMessage ('Debe introducir un texto a la opción 3').escape().trim(),
  check('option4').notEmpty().withMessage ('Debe introducir un texto a opción 4').escape().trim(),
  check('right_answer').notEmpty().isInt().withMessage ('La respuesta debe ser un número entero').escape().trim(),
  check('answer_explained').optional({ checkFalsy: true }).notEmpty().withMessage ('Debe introducir un texto a la explicación').isString().escape().trim(),
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



// Rutas CRUD (/api/preguntas/)
router.get('/', auth, questionController.getAllQuestions); //index JSON. Contiene parametros opcionales de categoria o subcategoría

router.post('/store', auth, questionValidation, handleValidationErrors, questionController.storeQuestion); //store

router.get('/:id', auth, validateID, handleValidationErrors, questionController.getQuestionById); //show

router.put('/update/:id', auth, questionValidation, handleValidationErrors, questionController.updateQuestion); //update

router.delete('/delete/:id', auth, validateID, handleValidationErrors, questionController.deleteQuestion);  //delete


module.exports = router;