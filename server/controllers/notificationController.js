// controllers/notificacionController.js
const { validationResult } = require('express-validator');
const db = require('../config/database'); // Base de datos MySQL


// Obtener todas las notificaciones
exports.getAllNotifications = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        n.id, n.mensaje, n.tipo, n.leido, n.created_at,
        u.id AS usuario_id, u.name AS usuario_nombre
      FROM notificaciones n
      JOIN usuarios u ON n.usuario_id = u.id
      ORDER BY n.created_at DESC
    `);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener las notificaciones:', error);
    res.status(500).json({ message: 'Error al obtener las notificaciones', error });
  }
};


// Obtener notificaciones por usuario
exports.getNotificationsByUserId = async (req, res) => {
  const userId = req.params.userId;

  try {
    const [rows] = await db.query('SELECT * FROM notificaciones WHERE usuario_id = ?', [userId]);


    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener las notificaciones:', error);
    res.status(500).json({ message: 'Error al obtener las notificaciones', error });
  }
};

// Crear una notificación (individual o masiva)
exports.createNotification = async (req, res) => {
  const { userId, message, type, allUsers } = req.body;
  console.log('usuario: '+userId)

  // Validación básica
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array())
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    if (allUsers) {
      const [users] = await db.query('SELECT id FROM usuarios');
      const values = users.map(user => [user.id, message, type]);

      await db.query(
        'INSERT INTO notificaciones (usuario_id, mensaje, tipo) VALUES ?',
        [values]
      );

      return res.status(201).json({ message: 'Notificaciones enviadas a todos los usuarios' });
    } else {
      const [result] = await db.query(
        'INSERT INTO notificaciones (usuario_id, mensaje, tipo) VALUES (?, ?, ?)',
        [userId, message, type]
      );

      return res.status(201).json({
        message: 'Notificación creada exitosamente',
        notificationId: result.insertId,
      });
    }
  } catch (error) {
    console.error('Error al crear la notificación:', error);
    res.status(500).json({ message: 'Error al crear la notificación', error });
  }
};



// Marcar una notificación como leída
exports.markAsRead = async (req, res) => {
  const notificationId = req.params.id;

  try {
    const [result] = await db.query('UPDATE notificaciones SET leido = 1 WHERE id = ?', [notificationId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Notificación no encontrada' });
    }

    res.status(200).json({ message: 'Notificación marcada como leída' });
  } catch (error) {
    console.error('Error al marcar la notificación como leída:', error);
    res.status(500).json({ message: 'Error al marcar la notificación como leída', error });
  }
};

// Eliminar una notificación
exports.deleteNotification = async (req, res) => {
  const notificationId = req.params.id;

  try {
    const [result] = await db.query('DELETE FROM notificaciones WHERE id = ?', [notificationId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Notificación no encontrada' });
    }

    res.status(200).json({ message: 'Notificación eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar la notificación:', error);
    res.status(500).json({ message: 'Error al eliminar la notificación', error });
  }
};
