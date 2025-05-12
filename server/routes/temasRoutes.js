const express = require('express');
const router = express.Router();
const temaController = require('../controllers/temasController');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadHandler');

// Validación de datos de Tema
const temaValidation = [
  check('id').optional().notEmpty().withMessage('El ID es obligatorio').isInt().withMessage('El ID debe ser un número entero'),
  check('name').notEmpty().withMessage('El nombre es obligatorio').trim(),
  check('description').escape().trim(),
  check('image')
    .optional({ checkFalsy: true })
    .custom((value) => {
      const isRelative = value.startsWith('/');
      const isAbsolute = /^https?:\/\//.test(value);

      if (!isRelative && !isAbsolute) {
        throw new Error('La imagen debe ser una URL absoluta o relativa válida');
      }

      if (!/\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(value)) {
        throw new Error('La URL debe contener una imagen válida (jpg, jpeg, png, gif, bmp, webp)');
      }

      return true;
    })
    .trim(),
  check('pdf_url').optional().isURL().withMessage('URL pdf no válida'),
  check('curso_id').notEmpty().withMessage('El ID curso es obligatorio').isInt().withMessage('El ID curso debe ser un número entero')
];

// Validación de ID (asegura que el ID sea un número entero)
const validateID = [
  check('id')
    .notEmpty().withMessage('El ID es obligatorio')
    .bail() //detiene la validación si un paso falla
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
router.get('/', temaController.getAllTemas); //index JSON

router.get('/curso/:id', auth, temaController.getAllTemasByCurso); //temas en función del curso

router.post('/store', auth, upload.single('pdf'), temaValidation, handleValidationErrors, temaController.storeTema); //store

/* //subir varios archivos simultáneamente
router.post('/upload', auth, upload.fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]), temaController.storeTema);
*/
router.get('/:id', auth, validateID, handleValidationErrors, temaController.getTemaById); //show

router.put('/update/:id', auth, upload.single('pdf'), temaValidation, handleValidationErrors, temaController.updateTema); //update

router.delete('/delete/:id', auth, validateID, handleValidationErrors, temaController.deleteTema);  //delete

// marca el tema como completado
router.put('/:id/completar', auth, temaController.marcarComoCompletado);



module.exports = router;