const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración dinámica de destino
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir;

    switch (file.fieldname) {
      case 'video':
        dir = './uploads/videos/';
        break;
      case 'image':
        dir = './uploads/imagenes/';
        break;
      case 'pdf':
        dir = './uploads/archivos/';
        break;
      default:
        dir = './uploads/otros/';
    }

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Validación por campo y tipo MIME
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (file.fieldname === 'pdf' && ext === '.pdf') {
    cb(null, true);
  } else if (file.fieldname === 'image' && ['.jpg', '.jpeg', '.png'].includes(ext)) {
    cb(null, true);
  } else if (file.fieldname === 'video' && ['.mp4', '.avi', '.mov', '.webm'].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Archivo no válido para el campo: ${file.fieldname}`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 } // 100 MB
});

module.exports = upload;