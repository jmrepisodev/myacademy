
const express = require('express');
const router = express.Router();
const cursosController = require('../controllers/cursosController');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/authMiddleware');
const checkAdmin = require('../middleware/checkAdmin');

// Validación de datos de Curso
const cursoValidation = [
  check('id').optional().notEmpty().withMessage('El ID es obligatorio').isInt().withMessage('El ID debe ser un número entero'),
  check('name').notEmpty().withMessage('El nombre es obligatorio').trim(),
  check('description').optional().escape().trim(),
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
  check('status').optional().isIn(['activo', 'inactivo']).withMessage('El estado solo puede tomar los valores activo o inactivo')
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

router.post('/store', auth, checkAdmin, cursoValidation, handleValidationErrors, cursosController.storeCurso); //store

router.get('/:id', validateID, handleValidationErrors, cursosController.getCursoById); //show

router.put('/update/:id', auth, checkAdmin, cursoValidation, handleValidationErrors, cursosController.updateCurso); //update

router.delete('/delete/:id', auth, checkAdmin, validateID, handleValidationErrors, cursosController.deleteCurso);  //delete

router.delete('/:cursoId/usuarios/:usuarioId', auth, checkAdmin, [
  check('cursoId')
    .notEmpty().withMessage('El ID curso es obligatorio')
    .isInt().withMessage('El ID curso debe ser un número entero'),
  check('usuarioId')
    .notEmpty().withMessage('El ID alumno es obligatorio')
    .isInt().withMessage('El ID alumno debe ser un número entero')
], cursosController.anularMatriculaCurso);  //delete


module.exports = router;


