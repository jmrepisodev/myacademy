const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) return res.status(403).json({ error: 'Acceso denegado: Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verificar y decodificar el token
    req.user = decoded;
    next(); // Continuamos con la siguiente función (el controlador)
  } catch {
    res.status(403).json({ error: 'Token inválido' });
  }
};
