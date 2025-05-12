// routes/notificaciones.js
const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const notificacionController = require('../controllers/notificationController');

// Obtener todas las notificaciones
router.get('/', notificacionController.getAllNotifications);


// Obtener notificaciones de un usuario
router.get(
  '/:userId',
  [
    param('userId').isInt().withMessage('El ID del usuario debe ser un número entero'), // Validamos el ID del usuario
  ],
  notificacionController.getNotificationsByUserId
);

// Crear una nueva notificación
router.post(
  '/',
  [
    body('message').notEmpty().withMessage('El mensaje es obligatorio'),
    body('type').isIn(['sistema', 'curso', 'foro', 'otro']).withMessage('Tipo de notificación inválido'),
    body('allUsers').optional().isBoolean(),
    body('userId').custom((value, { req }) => {
      if (!req.body.allUsers && (value === undefined || isNaN(parseInt(value)))) {
        throw new Error('ID de usuario inválido');
      }
      return true;
    })
  ],
  notificacionController.createNotification
);

// Marcar una notificación como leída
router.put(
  '/:id/leer',
  [
    param('id').isInt().withMessage('El ID de la notificación debe ser un número entero'), // Validamos el ID de la notificación
  ],
  notificacionController.markAsRead
);


// Eliminar una notificación
router.delete(
  '/:id',
  [
    param('id').isInt().withMessage('El ID de la notificación debe ser un número entero'), // Validamos el ID de la notificación
  ],
  notificacionController.deleteNotification
);

module.exports = router;

