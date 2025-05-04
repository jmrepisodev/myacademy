const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurar Multer para almacenar archivos temporalmente
//const storage = multer.memoryStorage();

// Configurar el almacenamiento de Multer (donde se guardarán los archivos subidos)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Directorio donde se almacenarán los archivos subidos
    const dir = './uploads/'; // La carpeta donde se guardarán los archivos
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Nombre único para el archivo, con marca de tiempo
  }
});


//Configura las extensiones de archivo válidas
const fileFilter = (req, file, cb) => {
  const filetypes = /.mp4|.webm|.avi|.mov|pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

  if (extname) {
      return cb(null, true);
  } else {
      req.fileValidationError = "El archivo proporcionado no es archivo válido";
      return cb(null, false, req.fileValidationError);
  }

};


// Inicializa el middleware upload y configura el tamaño máximo de archivo
const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // Límite de tamaño de archivo (50MB)
    fileFilter: fileFilter
});


/*
// Configurar multer para manejar los archivos
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /xml|pdf|jpg|jpeg|png|gif|bmp|webp|mp3/; // Permitir XML, PDF, imagen y MP3
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }

    req.fileValidationError = "El archivo no tiene un formato válido";
    return cb(null, false, req.fileValidationError);
    //cb(new Error('Tipo de archivo no permitido'));
  }
});
*/

module.exports = upload;