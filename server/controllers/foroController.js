const db = require('../config/database');
const slugify = require('slugify'); //genera rutas url amigables


//FOROS

// Obtener todos los foros (con número de hilos)
exports.getAllForos = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT f.*, COUNT(h.id) AS total_hilos
      FROM foros f
      LEFT JOIN hilos h ON h.foro_id = f.id
      GROUP BY f.id
    `);
    
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener foros:', error);
    res.status(500).json({ message: 'Error al obtener los foros' });
  }
};

// Crear foro con validación de slug único
exports.createForo = async (req, res) => {
  const { name, description } = req.body;
  const slug = slugify(name, { lower: true, strict: true });

  if (!name || !description) {
    return res.status(400).json({ message: 'Nombre y descripción requeridos' });
  }

  try {
    const [exists] = await db.query('SELECT id FROM foros WHERE slug = ?', [slug]);
    if (exists.length > 0) {
      return res.status(409).json({ message: 'Ya existe un foro con ese nombre' });
    }

    const [result] = await db.query(
      'INSERT INTO foros (name, description, slug) VALUES (?, ?, ?)',
      [name, description, slug]
    );

    res.status(201).json({ id: result.insertId, name, description, slug });
  } catch (error) {
    console.error('Error al crear el foro:', error);
    res.status(500).json({ message: 'Error al crear el foro' });
  }
};

// Actualizar foro
exports.updateForo = async (req, res) => {
  const { foroId } = req.params;
  const { name, description } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE foros SET name = ?, description = ? WHERE id = ?',
      [name, description, foroId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Foro no encontrado' });
    }

    res.json({ message: 'Foro actualizado' });
  } catch (error) {
    console.error('Error al actualizar foro:', error);
    res.status(500).json({ message: 'Error al actualizar foro' });
  }
};


// Eliminar un foro
exports.deleteForo = async (req, res) => {
  const { foroId } = req.params;

  try {
    const [result] = await db.query(
      'DELETE FROM foros WHERE id = ?',
      [foroId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Foro no encontrado' });
    }

    res.status(200).json({ message: 'Foro eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el foro:', error);
    res.status(500).json({ message: 'Error al eliminar el foro' });
  }
};

// Obtener un foro por su slug
exports.getForoBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const [rows] = await db.query('SELECT * FROM foros WHERE slug = ?', [slug]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Foro no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener el foro:', error);
    res.status(500).json({ message: 'Error al obtener el foro' });
  }
};


//HILOS

// Obtener hilos por slug, con paginación y contador de mensajes
exports.getAllHilosByForoSlug = async (req, res) => {
  const { slug } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const [hilos] = await db.query(`
      SELECT 
        h.id, 
        h.titulo, 
        h.created_at, 
        h.usuario_id, 
        H.vistas,
        u.name AS autor,
        COUNT(m.id) AS total_mensajes
      FROM hilos h
      JOIN usuarios u ON u.id = h.usuario_id
      LEFT JOIN mensajes m ON m.hilo_id = h.id
      JOIN foros f ON f.id = h.foro_id
      WHERE f.slug = ?
      GROUP BY h.id, h.titulo, h.created_at, h.vistas, h.usuario_id, u.name
      ORDER BY h.created_at DESC
      LIMIT ? OFFSET ?
    `, [slug, limit, offset]);

    res.json(hilos);
  } catch (error) {
    console.error('Error al obtener hilos:', error);
    res.status(500).json({ message: 'Error al obtener hilos' });
  }
};

// Obtener hilos por Id, con paginación y contador de mensajes
exports.getAllHilosByForoId = async (req, res) => {
  const { foroId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const [hilos] = await db.query(`
      SELECT 
        h.id, 
        h.titulo, 
        h.created_at, 
        h.usuario_id, 
        H.vistas,
        u.name AS autor,
        COUNT(m.id) AS total_mensajes
      FROM hilos h
      JOIN usuarios u ON u.id = h.usuario_id
      LEFT JOIN mensajes m ON m.hilo_id = h.id
      JOIN foros f ON f.id = h.foro_id
      WHERE f.id = ?
      GROUP BY h.id, h.titulo, h.created_at, h.vistas, h.usuario_id, u.name
      ORDER BY h.created_at DESC
      LIMIT ? OFFSET ?
    `, [foroId, limit, offset]);

    
    res.json(hilos);
  } catch (error) {
    console.error('Error al obtener hilos:', error);
    res.status(500).json({ message: 'Error al obtener hilos' });
  }
};

// Obtener hilo por ID
exports.getHiloById = async (req, res) => {
  const { slug, hiloId } = req.params;

  try {
   
    const [rows] = await db.query(`
      SELECT h.*, u.name AS autor FROM hilos h
      JOIN usuarios u ON h.usuario_id = u.id
      JOIN foros f ON f.id = h.foro_id
      WHERE f.slug = ? AND h.id = ?
    `, [slug, hiloId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Hilo no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener hilo:', error);
    res.status(500).json({ message: 'Error al obtener hilo' });
  }
};



// Crear un nuevo hilo en un foro
exports.createHilo = async (req, res) => {
  const { slug } = req.params;
  const { titulo, contenido, usuario_id } = req.body;

  try {
    // Obtener el foro por el slug
    const [foroRows] = await db.query('SELECT * FROM foros WHERE slug = ?', [slug]);

    if (foroRows.length === 0) {
      return res.status(404).json({ message: 'Foro no encontrado' });
    }

    const foroId = foroRows[0].id;

    // Crear el hilo en la base de datos
    const [result] = await db.query(
      'INSERT INTO hilos (titulo, contenido, foro_id, usuario_id) VALUES (?, ?, ?, ?)',
      [titulo, contenido, foroId, usuario_id]
    );

    // Responder con el hilo creado
    res.status(201).json({
      id: result.insertId,
      titulo,
      contenido,
      foro_id: foroId,
      usuario_id,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error al crear el hilo:', error);
    res.status(500).json({ message: 'Error al crear el hilo' });
  }
};

// Actualizar hilo por su ID (solo si pertenece al usuario)
exports.updateHilo = async (req, res) => {
  const { hiloId } = req.params;
  const { titulo, contenido } = req.body;
  const usuarioId = req.user.id;

  try {
    // Verificar que el hilo existe y pertenece al usuario
    const [hiloRows] = await db.query('SELECT * FROM hilos WHERE id = ?', [hiloId]);

    if (hiloRows.length === 0) {
      return res.status(404).json({ message: 'Hilo no encontrado' });
    }

    const hilo = hiloRows[0];

    if (hilo.usuario_id !== usuarioId) {
      return res.status(403).json({ message: 'No autorizado para editar este hilo' });
    }

    await db.query(
      'UPDATE hilos SET titulo = ?, contenido = ? WHERE id = ?',
      [titulo, contenido, hiloId]
    );

    res.status(200).json({ message: 'Hilo actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el hilo:', error);
    res.status(500).json({ message: 'Error al actualizar el hilo' });
  }
};


// Eliminar un hilo
exports.deleteHilo = async (req, res) => {
  const { slug, hiloId } = req.params;

  try {
    // Verificar que el foro existe
    const [foroRows] = await db.query('SELECT * FROM foros WHERE slug = ?', [slug]);

    if (foroRows.length === 0) {
      return res.status(404).json({ message: 'Foro no encontrado' });
    }

    // Eliminar el hilo
    const [result] = await db.query('DELETE FROM hilos WHERE id = ?', [hiloId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Hilo no encontrado' });
    }

    res.status(200).json({ message: 'Hilo eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el hilo:', error);
    res.status(500).json({ message: 'Error al eliminar el hilo' });
  }
};



//MENSAJES

// Obtener mensajes de un hilo, con paginación. Incrementa el contador de vistas del hilo
exports.getMensajesByHilo = async (req, res) => {
  const { hiloId } = req.params;

  // Parámetros de paginación
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  try {
   
    const [rows] = await db.query(`
      SELECT m.*, u.id AS usuario_id, u.name AS usuario_nombre, u.image AS usuario_image
      FROM mensajes m
      JOIN usuarios u ON m.usuario_id = u.id
      WHERE m.hilo_id = ?
      ORDER BY m.created_at ASC
      LIMIT ? OFFSET ?
    `, [hiloId, limit, offset]);

     await db.query('UPDATE hilos SET vistas = vistas + 1 WHERE id = ?', [hiloId]);

    res.json(rows);
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({ message: 'Error al obtener mensajes' });
  }
};

// Actualizar mensaje
exports.updateMensaje = async (req, res) => {
  const { mensajeId } = req.params;
  const { contenido } = req.body;
  const usuarioId = req.user.id;

  try {
    const [check] = await db.query('SELECT usuario_id FROM mensajes WHERE id = ?', [mensajeId]);
    if (check.length === 0 || check[0].usuario_id !== usuarioId) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    await db.query('UPDATE mensajes SET contenido = ? WHERE id = ?', [contenido, mensajeId]);
    res.json({ message: 'Mensaje actualizado' });
  } catch (error) {
    console.error('Error al actualizar mensaje:', error);
    res.status(500).json({ message: 'Error al actualizar mensaje' });
  }
};

// Crear un nuevo mensaje en un hilo
exports.createMensaje = async (req, res) => {
  const { contenido } = req.body;
  const { slug, hiloId } = req.params;
  const usuarioId = req.user.id; // ID desde el token

  try {
    // Insertar mensaje
    const [result] = await db.query(
      'INSERT INTO mensajes (contenido, usuario_id, hilo_id) VALUES (?, ?, ?)',
      [contenido, usuarioId, hiloId]
    );

    const mensajeId = result.insertId;

    // Consultar el mensaje completo con datos del usuario
    const [mensajes] = await db.query(
      `SELECT m.id, m.contenido, m.created_at, m.usuario_id, 
              u.name AS usuario_nombre, u.image AS usuario_image
       FROM mensajes m
       JOIN usuarios u ON m.usuario_id = u.id
       WHERE m.id = ?`,
      [mensajeId]
    );

    if (mensajes.length === 0) {
      return res.status(404).json({ message: 'Error al recuperar el mensaje creado' });
    }

    res.status(201).json(mensajes[0]); // Responder con el mensaje enriquecido
  } catch (error) {
    console.error('Error al crear el mensaje:', error);
    res.status(500).json({ message: 'Error al crear el mensaje' });
  }
};


// Eliminar un mensaje
exports.deleteMensaje = async (req, res) => {
  const { slug, hiloId, mensajeId } = req.params;

  try {
    // Eliminar el mensaje de la base de datos
    const [result] = await db.query(
      'DELETE FROM mensajes WHERE id = ? AND hilo_id = ?',
      [mensajeId, hiloId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Mensaje no encontrado' });
    }

    res.status(200).json({ message: 'Mensaje eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el mensaje:', error);
    res.status(500).json({ message: 'Error al eliminar el mensaje' });
  }
};