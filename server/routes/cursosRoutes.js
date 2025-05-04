
const express = require('express');
const router = express.Router();
const cursosController = require('../controllers/cursosController');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/authMiddleware');

// Validación de datos de Curso
const cursoValidation = [
  check('id').optional().notEmpty().withMessage('El ID es obligatorio').isInt().withMessage('El ID debe ser un número entero'),
  check('name').notEmpty().withMessage('El nombre es obligatorio').trim(),
  check('description').optional().escape().trim(),
  check('image')
    .optional({ checkFalsy: true })  // solo se validará si no está vacío o si no es un valor "falsy" (null, undefined, '', etc.).
    .isURL().withMessage('URL no válida')
    .matches(/\.(jpg|jpeg|png|gif|bmp|webp)$/i).withMessage('La URL debe contener una imagen válida (jpg, jpeg, png, gif, bmp, webp)')
    .trim()
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

// Rutas CRUD (/api/cursos/)
//router.get('/dashboard', auth, cursosController.getDashboard);

router.get('/', cursosController.getAllCursos); //all courses

router.post('/matricular', auth, cursosController.matricularAlumno); //matricular alumno en un curso
router.get('/:id/usuarios', auth, cursosController.getUsuariosPorCurso); //obtener lista de usuarios matriculados en un curso

router.post('/store', auth, cursoValidation, handleValidationErrors, cursosController.storeCurso); //store

router.get('/:id', auth, validateID, handleValidationErrors, cursosController.getCursoById); //show

router.put('/update/:id', auth, cursoValidation, handleValidationErrors, cursosController.updateCurso); //update

router.delete('/delete/:id', auth, validateID, handleValidationErrors, cursosController.deleteCurso);  //delete


module.exports = router;


