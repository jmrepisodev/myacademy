const express = require('express');
const router = express.Router();
const testController = require('../controllers/testsController');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/authMiddleware');

// Validación de datos de Test
const TestValidation = [
  check('id').optional().notEmpty().withMessage('El ID es obligatorio').isInt().withMessage('El ID debe ser un número entero'),
  check('name').notEmpty().withMessage('El nombre es obligatorio').trim(),
  check('description').escape().trim(),
  check('image')
    .optional({ checkFalsy: true })  // solo se validará si no está vacío o si no es un valor "falsy" (null, undefined, '', etc.).
    .isURL().withMessage('URL no válida')
    .matches(/\.(jpg|jpeg|png|gif|bmp|webp)$/i).withMessage('La URL debe contener una imagen válida (jpg, jpeg, png, gif, bmp, webp)')
    .trim(),

  check('num_questions').optional().isInt().withMessage('El número de preguntas debe ser un número entero'),
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

// Rutas CRUD (/api/tests/)
router.get('/',  testController.getAllTests); //index JSON

router.get('/resultado/:id', auth, validateID, handleValidationErrors, testController.getAllResultsByTest);
router.get('/tema/:id',  validateID, handleValidationErrors, testController.getAllTestByTema); //tests en función del tema

router.post('/store', auth, TestValidation, handleValidationErrors, testController.storeTest); //store

router.get('/:id', auth, validateID, handleValidationErrors, testController.getTestById); //show
router.get('/:id/questions', auth, validateID, handleValidationErrors, testController.getAllQuestionsByTest); //mostrar las preguntas del test
router.post('/:id/result', auth,  validateID, handleValidationErrors, testController.saveResultTest);  //guardar los resultados del test
router.get('/resultado/:id', auth,  validateID, handleValidationErrors, testController.getAllResultsByTest); //mostrar todos los resultados de un test

router.put('/update/:id', auth, TestValidation, handleValidationErrors, testController.updateTest); //update

router.delete('/delete/:id', auth, validateID, handleValidationErrors, testController.deleteTest);  //delete


module.exports = router;