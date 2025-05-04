const mysql = require('mysql2');
require('dotenv').config();

//Usamos mysql2.createPool() para crear una conexión que permite múltiples conexiones simultáneas.
//La función .promise() de mysql2 convierte las consultas en promesas, lo que te permite usar async/await.

// Crea una conexión a la base de datos
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,   // Número de conexiones permitidas
  queueLimit: 0           // No limitar la cola de conexiones
});

// Crear un 'pool' de conexiones que soporte Promesas
const promisePool = pool.promise(); // .promise() convierte los métodos de consulta en promesas

// Verificar la conexión a la base de datos
promisePool.getConnection()
  .then(() => {
    console.log('Conectado correctamente a la base de datos');
  })
  .catch((err) => {
    console.error('Error de conexión a la base de datos:', err.message);
  });

// Exportar el pool para usar en otras partes de la aplicación
module.exports = promisePool;
