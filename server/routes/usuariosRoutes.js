const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/authMiddleware');
const checkAdmin = require('../middleware/checkAdmin');

// Validación de datos de user
const storeValidation = [
  check('name').notEmpty().withMessage('El nombre es obligatorio').trim(),
  check('email').isEmail().normalizeEmail().withMessage('Email no válido'),
  check('password').isLength({ min: 6 }).withMessage('Contraseña debe tener al menos 6 caracteres'),
  check('image')
    .optional({ checkFalsy: true })  // solo se validará si no está vacío o si no es un valor "falsy" (null, undefined, '', etc.).
    .isURL().withMessage('URL no válida')
    .matches(/\.(jpg|jpeg|png|gif|bmp|webp)$/i).withMessage('La URL debe contener una imagen válida (jpg, jpeg, png, gif, bmp, webp)')
    .trim(),
  check('rol').optional({ checkFalsy: true }).isIn(['user', 'admin']).withMessage('El rol solo puede tomar los valores user o admin')
 
];

const updateValidation = [
  // Validación del ID: obligatorio, entero
  check('id').notEmpty().withMessage('El ID es obligatorio').isInt().withMessage('El ID debe ser un número entero'),
  
  // Validación del nombre: opcional y recorta espacios en blanco
  check('name').optional({ checkFalsy: true }).trim(),
  
  // Validación del email: opcional, debe ser un email válido, normaliza y comprueba
  check('email').optional({ checkFalsy: true }).isEmail().normalizeEmail().withMessage('Email no válido'),
  
  // Validación de la contraseña: opcional, longitud mínima de 6 caracteres
  check('password').optional({ checkFalsy: true }).isLength({ min: 6 }).withMessage('Contraseña debe tener al menos 6 caracteres'),
  
  // Validación de la imagen: opcional, debe ser una URL válida con extensión de imagen
  check('image')
    .optional({ checkFalsy: true })
    .isURL().withMessage('URL no válida')
    .matches(/\.(jpg|jpeg|png|gif|bmp|webp)$/i).withMessage('La URL debe contener una imagen válida (jpg, jpeg, png, gif, bmp, webp)')
    .trim(),
  
  // Validación del rol: opcional, solo puede ser 'user' o 'admin'
  check('rol')
    .optional({ checkFalsy: true })
    .isIn(['user', 'admin']).withMessage('El rol solo puede tomar los valores user o admin'),

  check('is_verified')
  .optional({ checkFalsy: true })
  .isIn(['1', '0']).withMessage('el estado de verificación solo puede tomar los valores 1 o 0'),
  
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

// Rutas CRUD (/api/usuarios/)
router.get('/', auth, checkAdmin, userController.getAllUsers); //index JSON

router.get('/perfil', auth, userController.getUserById); //muestra el perfil de usuario
router.get('/cursos',auth, userController.getCursosByUser); //muestra todos los cursos en los que está inscrito el usuario
router.get('/resultados', auth, userController.getResultadosByUser); //muestra todos los resultados del usuario

router.get('/:id/cursos', auth, checkAdmin, validateID, handleValidationErrors, userController.getCursosPorUsuario); //cursos en función del usuario (administración)

router.get('/ranking', auth, userController.getRankingUsers); //ranking
router.get('/user-stats', auth, userController.getAllUsersStats);//estadísticas

router.put('/actualizarPerfil', auth, userController.updateProfile); //update

router.post('/store', auth, checkAdmin, storeValidation, handleValidationErrors, userController.storeUser); //store

router.get('/:id', auth, validateID, handleValidationErrors, userController.getUserById); //show

router.put('/update/:id', auth, checkAdmin, updateValidation, handleValidationErrors, userController.updateUser); //update

router.delete('/delete/:id', auth, checkAdmin, validateID, handleValidationErrors, userController.deleteUser);  //delete




module.exports = router;
