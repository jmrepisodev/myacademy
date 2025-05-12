// middlewares/checkIntentosDisponibles.js
const db = require('../config/database');

const checkIntentosDisponibles = async (req, res, next) => {
  const userId = req.user.id; //obtiene el ID usuario del token jwt
  const testId = req.params.id; //obtiene el ID test de la url

  try {
    const [[{ intentos_realizados }]] = await db.query(
      `SELECT COUNT(*) AS intentos_realizados FROM resultados WHERE user_id = ? AND test_id = ?`,
      [userId, testId]
    );

    const [[{ intentos_max }]] = await db.query(
      `SELECT intentos_max FROM tests WHERE id = ?`,
      [testId]
    );

    if (intentos_realizados >= intentos_max) {
        console.log('Ha superado el número máximo de intentos para este test.')
      return res.status(403).json({ error: 'Ha superado el número máximo de intentos para este test.' });
    }

    // Guarda el intento número para usar después si es necesario
    req.intento_numero = intentos_realizados;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al validar intentos' });
  }
};

module.exports = checkIntentosDisponibles;
