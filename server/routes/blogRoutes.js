const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/authMiddleware');

// Validación de datos de Post
const PostValidation = [
  check('id').optional().notEmpty().withMessage('El ID es obligatorio').isInt().withMessage('El ID debe ser un número entero'),
  check('titulo').notEmpty().withMessage('El nombre es obligatorio').trim(),
  check('contenido').notEmpty().withMessage('El contenido es obligatorio').trim(),
  check('image')
    .optional({ checkFalsy: true })  // solo se validará si no está vacío o si no es un valor "falsy" (null, undefined, '', etc.).
    //.isURL().withMessage('URL no válida')
    .matches(/\.(jpg|jpeg|png|gif|bmp|webp)$/i).withMessage('La URL debe contener una imagen válida (jpg, jpeg, png, gif, bmp, webp)')
    .trim(),
  check('autor').notEmpty().withMessage('El autor es obligatorio').trim(),
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

// Rutas CRUD (/api/Posts/)
//router.get('/dashboard', auth, blogController.getDashboard);

router.get('/', blogController.getAllPosts); //all courses

router.post('/store', auth, PostValidation, handleValidationErrors, blogController.storePost); //store

router.get('/:id', validateID, handleValidationErrors, blogController.getPostById); //show

router.put('/update/:id', auth, PostValidation, handleValidationErrors, blogController.updatePost); //update

router.delete('/delete/:id', auth, validateID, handleValidationErrors, blogController.deletePost);  //delete


module.exports = router;