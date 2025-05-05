const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { validationResult } = require('express-validator');
const {sendVerificationEmail, sendResetEmail } = require('../utils/emailService');

//Registrar usuario
exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array())
      return res.status(400).json({ errors: errors.array() });  
    }

    try {
        const { name, email, password} = req.body;
    
        // Verificar si el correo ya existe
        const [existingUser] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (existingUser.length > 0) {
          return res.status(400).json({ error: 'Ya existe una cuenta con este email' });
        }
    
        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
    /*
        // Insertar el nuevo usuario en la base de datos, incluyendo device_id y device_model si existen
        const [results] = await db.query(
          'INSERT INTO usuarios (name, email, password) VALUES (?, ?, ?)', 
          [name, email, hashedPassword]
        );
*/
        const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Insertar el nuevo usuario en la base de datos, incluyendo device_id y device_model si existen
        const [results] = await db.query(
          'INSERT INTO usuarios (name, email, password, verification_token) VALUES (?, ?, ?, ?)', 
          [name, email, hashedPassword, verificationToken]
        );
    
       // await sendVerificationEmail(email, verificationToken);
    
        res.status(201).json({ message: 'Usuario registrado satisfactoriamente', id: results.insertId });
    
      } catch (error) {
          console.error('Error al registrar usuario:', error);
          res.status(500).json({ error: 'Error al registrar usuario' });
      }

};

//Iniciar sesión
exports.login = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }


  try {
    const { email, password } = req.body;
    // Verificar si el usuario existe
    const [results] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (results.length === 0) {
      console.log(`usuario no encontrado`)
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = results[0];

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`las contraseñas no coinciden`)
      return res.status(401).json({ error: 'Credenciales incorrectas: email o contraseña no válidos' });
    }
/*
    if(!user.is_verified){
      console.log('Usuario no verificado')
      return res.status(401).json({ error: 'Email no verificado' });
    }
*/
    const token = jwt.sign({ id: user.id, email: user.email, nombre: user.name, rol: user.rol }, process.env.JWT_SECRET, {expiresIn: '2h'});
    
     // Enviar ambos tokens en la respuesta para aplicaciones móviles
     res.status(201).json({ message: 'Se ha iniciado sesión satisfactoriamente', token:token });

  } catch (error) {
      console.error('Error al iniciar sesión:', error);
    return res.status(500).json({ error: 'Error al iniciar sesión' });
  }

};


//Solicitar restablecer contraseña
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const [user] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (user.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const resetToken = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const tokenExpiration = new Date(Date.now() + 3600000); // 1 hour from now

    await db.query('UPDATE usuarios SET reset_token = ?, token_expiration = ? WHERE email = ?', 
      [resetToken, tokenExpiration, email]);

    await sendResetEmail(email, resetToken);

    res.status(200).json({ message: 'Se ha enviado un correo de recuperación' });
  } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Error al procesar la petición', error });
  }
};

//Mostrar formulario para restablecer contraseña
exports.showFormResetPassword = (req, res) => {
  const token = req.query.token;
  
  // Verifica si el token está presente en la URL
  if (!token) {
      return res.status(400).json({ error: 'Token no proporcionado' });
  }

  // Enviar la página HTML con el formulario para la nueva contraseña
  res.send(`
      <!DOCTYPE html>
      <html lang="es">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Restablecer Contraseña</title>
              <!-- Bootstrap 5.3 CSS -->
              <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
          </head>
          <body>
              <div class="container">
                  <h2>Restablecer Contraseña</h2>
                  <form action="/auth/reset-password" method="POST">
                      <div class="mb-3">
                          <input type="hidden" name="token" value="${token}" />
                          <label for="newPassword" class="form-label">Password</label>
                          <input type="password" id="newPassword" name="newPassword" class="form-control" placeholder="Nueva Contraseña" required />
                      </div>
                      <button type="submit" class="btn btn-primary">Restablecer contraseña</button>
                  </form>
              </div> 
          </body>
      </html>
  `);
};

//Restablecer contraseña
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [user] = await db.query('SELECT * FROM usuarios WHERE id = ? AND reset_token = ?', 
      [decoded.id, token]);

    if (user.length === 0 || new Date() > new Date(user[0].token_expiration)) {
      return res.status(400).json({ error: 'Token no válido o expirado' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query('UPDATE usuarios SET password = ?, reset_token = NULL, token_expiration = NULL WHERE id = ?', 
      [hashedPassword, decoded.id]);

    res.status(200).json({ message: 'Contraseña restablecida satisfactoriamente' });
  } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Error al intentar restablecer la contraseña', error });
  }
};

//Verificar correo electrónico
// ✅ Verificar correo electrónico
exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [users] = await db.query(
      'SELECT * FROM usuarios WHERE email = ? AND verification_token = ?',
      [decoded.email, token]
    );

    if (users.length === 0) {
      return res.status(400).send(renderHTML('Token no válido o expirado', false));
    }

    await db.query(
      'UPDATE usuarios SET is_verified = TRUE, verification_token = NULL WHERE email = ?',
      [decoded.email]
    );

    res.status(200).send(renderHTML('¡Tu correo ha sido verificado con éxito! 🎉', true));
  } catch (error) {
    console.error('Error al verificar correo:', error);
    res.status(500).send(renderHTML('Ocurrió un error al verificar tu correo electrónico.', false));
  }
};

// ✅ Función que devuelve la página HTML con Bootstrap
function renderHTML(message, success) {
  const icon = success
    ? 'https://img.icons8.com/ios-filled/50/4caf50/checkmark.png'
    : 'https://img.icons8.com/ios-filled/50/fa314a/error.png';

  const title = success ? 'Verificación Exitosa' : 'Error en la Verificación';
  const textColor = success ? 'text-success' : 'text-danger';

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="bg-light d-flex align-items-center justify-content-center vh-100">
      <div class="text-center p-4 shadow rounded bg-white">
        <img src="${icon}" alt="icon" width="80" class="mb-4">
        <h1 class="${textColor} mb-3">${title}</h1>
        <p class="lead">${message}</p>
        <a href="/" class="btn btn-primary mt-3">Ir a la aplicación</a>
      </div>
    </body>
    </html>
  `;
}

// Función para reenviar el correo de verificación
exports.resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  // Verificar si el email existe en la base de datos
  const [results] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
  
  if (results.length === 0) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  const user = results[0];

  // Verificar si el usuario ya está verificado
  if (user.is_verified) {
    return res.status(400).json({ error: 'El correo ya está verificado' });
  }

  try {
      // Crear un token de verificación único (válido por 1 hora)
     const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
     //Reenviar el correo de verificación
     console.log('Reenviando correo a '+email)
     await sendVerificationEmail(email, verificationToken);

     res.status(200).json({ message: 'Correo de verificación enviado satisfactoriamente', id: results.insertId });
  } catch (error) {
      console.error('Error al enviar el correo de verificación:', error);
      return res.status(500).json({ error: 'Error al reenviar el correo de verificación' });
  }
};

