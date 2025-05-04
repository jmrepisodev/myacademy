const express = require('express');
const router = express.Router();
const videoclaseController = require('../controllers//videoclaseController');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Validación de datos de Videoclase
const VideoclaseValidation = [
  check('id').optional().notEmpty().withMessage('El ID es obligatorio').isInt().withMessage('El ID debe ser un número entero'),
  check('name').notEmpty().withMessage('El nombre es obligatorio').trim(),
  check('description').escape().trim(),
  check('duration').optional().isNumeric(),
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

// Rutas CRUD (/api/Videoclases/)
router.get('/',  videoclaseController.getAllVideoclases); //index JSON

router.get('/tema/:id', auth, validateID, handleValidationErrors, videoclaseController.getAllVideoclaseByTema); //videoclases en función del tema

router.post('/store', auth, upload.single('video'), VideoclaseValidation, handleValidationErrors, videoclaseController.storeVideoclase); //store

router.get('/:id', auth, validateID, handleValidationErrors, videoclaseController.getVideoclaseById); //show

router.put('/update/:id', auth, upload.single('video'), VideoclaseValidation, handleValidationErrors, videoclaseController.updateVideoclase); //update

router.delete('/delete/:id', auth, validateID, handleValidationErrors, videoclaseController.deleteVideoclase);  //delete


module.exports = router;