// backend/server.js

// ─────────────────────────────
// 📦 Importaciones
// ─────────────────────────────
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');

// 🌐 Rutas
const mainRoutes = require('./routes/mainRoutes');
const homeRoutes = require('./routes/homeRoutes');
const authRoutes = require('./routes/authRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const cursosRoutes = require('./routes/cursosRoutes');
const temasRoutes = require('./routes/temasRoutes');
const testsRoutes = require('./routes/testsRoutes');
const preguntasRoutes = require('./routes/preguntasRoutes');
const videoclasesRoutes = require('./routes/videoclasesRoutes');
const contactoRoutes = require('./routes/contactoRoutes');
const blogRoutes = require('./routes/blogRoutes');

// 📁 Configuración de variables de entorno
dotenv.config();

// 🚀 Inicialización de la app
const app = express();

// ─────────────────────────────
// 🛡️ Seguridad y configuración global
// ─────────────────────────────

// Cabeceras de seguridad
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // permite cargar recursos desde React u otro dominio
}));

// Middleware CORS (seguro por origen)
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));

// Limitador de peticiones (rate limit)
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 500, // Máx 100 peticiones por IP
  message: 'Demasiadas solicitudes, intentalo de nuevo más tarde.',
}));

// Middleware de logging solo en desarrollo
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Middleware para parsear body JSON y formularios
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ─────────────────────────────
// 🗂️ Archivos estáticos (public y uploads)
// ─────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─────────────────────────────
// 🧭 Rutas del backend (API REST)
// ─────────────────────────────
app.use('/api', homeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/cursos', cursosRoutes);
app.use('/api/temas', temasRoutes);
app.use('/api/tests', testsRoutes);
app.use('/api/preguntas', preguntasRoutes);
app.use('/api/videoclases', videoclasesRoutes);
app.use('/api/contacto', contactoRoutes);
app.use('/api/blog', blogRoutes);

// Página principal o rutas públicas
app.use('/', mainRoutes);

// ─────────────────────────────
// ❌ Fallback 404
// ─────────────────────────────
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// 🧯 Middleware de manejo de errores
app.use(errorHandler);

// ─────────────────────────────
// 🚀 Puesta en marcha
// ─────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

