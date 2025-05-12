const express = require('express');
const { check, param, validationResult } = require('express-validator');
const router = express.Router();
const foroController = require('../controllers/foroController');
const auth = require('../middleware/authMiddleware');

// Middleware para manejar errores de validación
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// --------- FOROS ---------

// Obtener todos los foros
router.get('/', foroController.getAllForos);

// Crear un foro
router.post(
  '/create',
  [
    check('name').trim().notEmpty().withMessage('El nombre es obligatorio'),
    check('description').trim().notEmpty().withMessage('La descripción es obligatoria'),
    validate
  ],
  foroController.createForo
);

// Eliminar un foro por ID
router.delete(
  '/:foroId/delete',
  [param('foroId').isInt().withMessage('ID de foro inválido'), validate],
  foroController.deleteForo
);

// Obtener foro por slug
router.get(
  '/:slug',
  [param('slug').isSlug().withMessage('Slug inválido'), validate],
  foroController.getForoBySlug
);

// --------- HILOS ---------

// Obtener hilos de un foro, en función de su slug
router.get(
  '/:slug/hilos',
  [param('slug').isSlug().withMessage('Slug inválido'), validate],
  foroController.getAllHilosByForoSlug
);

// Obtener hilos de un foro, en función de su ID
router.get(
  '/id/:foroId/hilos',
  [param('foroId').isInt().withMessage('ID inválido'), validate],
  foroController.getAllHilosByForoId
);

// Obtener hilo por ID
router.get(
  '/:slug/hilos/:hiloId',
  [
    param('slug').isSlug().withMessage('Slug inválido'),
    param('hiloId').isInt().withMessage('ID de hilo inválido'),
    validate
  ],
  foroController.getHiloById
);

// Crear un hilo
router.post(
  '/:slug/hilos/create',
  [
    param('slug').isSlug().withMessage('Slug inválido'),
    check('titulo').trim().notEmpty().withMessage('El título es obligatorio'),
    check('contenido').trim().notEmpty().withMessage('El contenido es obligatorio'),
    check('usuario_id').isInt().withMessage('ID de usuario inválido'),
    validate
  ],
  foroController.createHilo
);

// Actualizar un hilo
router.put(
  '/hilos/:hiloId/update',
  [
    param('hiloId').isInt().withMessage('ID de hilo inválido'),
    validate,
    auth
  ],
  foroController.updateHilo
);

// Eliminar un hilo
router.delete(
  '/:slug/hilos/:hiloId/delete',
  [
    param('slug').isSlug().withMessage('Slug inválido'),
    param('hiloId').isInt().withMessage('ID de hilo inválido'),
    validate
  ],
  foroController.deleteHilo
);

// --------- MENSAJES ---------

// Obtener mensajes de un hilo
router.get(
  '/:slug/hilos/:hiloId/mensajes',
  [
    auth,
    param('slug').isSlug().withMessage('Slug inválido'),
    param('hiloId').isInt().withMessage('ID de hilo inválido'),
    validate
  ],
  foroController.getMensajesByHilo
);

// Crear mensaje
router.post(
  '/:slug/hilos/:hiloId/mensajes',
  [
    auth,
    param('slug').isSlug().withMessage('Slug inválido'),
    param('hiloId').isInt().withMessage('ID de hilo inválido'),
    check('contenido').trim().notEmpty().withMessage('El contenido es obligatorio'),
    validate
  ],
  foroController.createMensaje
);

// Actualizar mensaje
router.put(
  '/:slug/hilos/:hiloId/mensajes/:mensajeId',
  [
    auth,
    param('slug').isSlug().withMessage('Slug inválido'),
    param('hiloId').isInt().withMessage('ID de hilo inválido'),
    param('mensajeId').isInt().withMessage('ID de mensaje inválido'),
    check('contenido').trim().notEmpty().withMessage('El contenido es obligatorio'),
    validate
  ],
  foroController.updateMensaje
);


// Eliminar mensaje
router.delete(
  '/:slug/hilos/:hiloId/mensajes/:mensajeId',
  [
    auth,
    param('slug').isSlug().withMessage('Slug inválido'),
    param('hiloId').isInt().withMessage('ID de hilo inválido'),
    param('mensajeId').isInt().withMessage('ID de mensaje inválido'),
    validate
  ],
  foroController.deleteMensaje
);

module.exports = router;


