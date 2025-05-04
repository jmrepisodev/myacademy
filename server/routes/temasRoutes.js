const express = require('express');
const router = express.Router();
const temaController = require('../controllers/temasController');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Validación de datos de Tema
const temaValidation = [
  check('id').optional().notEmpty().withMessage('El ID es obligatorio').isInt().withMessage('El ID debe ser un número entero'),
  check('name').notEmpty().withMessage('El nombre es obligatorio').trim(),
  check('description').escape().trim(),
  check('image')
    .optional({ checkFalsy: true })  // solo se validará si no está vacío o si no es un valor "falsy" (null, undefined, '', etc.).
    .isURL().withMessage('URL no válida')
    .matches(/\.(jpg|jpeg|png|gif|bmp|webp)$/i).withMessage('La URL debe contener una imagen válida (jpg, jpeg, png, gif, bmp, webp)')
    .trim(),

  check('pdf_url').optional().isURL().withMessage('URL pdf no válida'),
  check('curso_id').notEmpty().withMessage('El ID curso es obligatorio').isInt().withMessage('El ID curso debe ser un número entero')
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
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Rutas CRUD (/api/temas/)
router.get('/', auth, temaController.getAllTemas); //index JSON

router.get('/curso/:id', auth,  temaController.getAllTemasByCurso); //preguntas en función de la categoría

router.post('/store', auth, upload.single('pdf'), temaValidation, handleValidationErrors, temaController.storeTema); //store

router.get('/:id', auth, validateID, handleValidationErrors, temaController.getTemaById); //show

router.put('/update/:id', auth, upload.single('pdf'), temaValidation, handleValidationErrors, temaController.updateTema); //update

router.delete('/delete/:id', auth, validateID, handleValidationErrors, temaController.deleteTema);  //delete


module.exports = router;