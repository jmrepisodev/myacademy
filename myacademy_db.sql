DROP DATABASE IF EXISTS myacademy_db;
CREATE DATABASE myacademy_db;
USE myacademy_db;

-- Tabla de Usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    image VARCHAR(255),
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('user', 'admin', 'teacher') DEFAULT 'user' NOT NULL,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    token_expiration DATETIME,
    status ENUM('activo', 'inactivo') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- Tabla de Cursos (Oposiciones)
CREATE TABLE cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    description TEXT,
    requisitos TEXT,
    precio DECIMAL(10,2),
    modalidad ENUM('presencial', 'online', 'mixto') DEFAULT 'online',
    status ENUM('activo', 'inactivo') DEFAULT 'activo',
    duracion VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    profesor_id INT,  -- ID del profesor
    FOREIGN KEY (profesor_id) REFERENCES usuarios(id) ON DELETE SET NULL; 
);


-- Tabla de Matrícula: usuarios_cursos
CREATE TABLE usuarios_cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    curso_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE
);


-- Tabla de Categorías
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    description TEXT,
    curso_id INT NOT NULL,
    status ENUM('activo', 'inactivo') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE
);


-- Tabla de Temas
CREATE TABLE temas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    indice_tema INT,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    description TEXT,
    pdf_url VARCHAR(255),
    category_id INT,
    curso_id INT NOT NULL,
    status ENUM('activo', 'inactivo') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categorias(id) ON DELETE CASCADE,
    FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE
);


-- Tabla de Videoclases
CREATE TABLE videoclases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    description TEXT,
    video_url VARCHAR(255),
    duration INT,
    tema_id INT NOT NULL,
    status ENUM('activo', 'inactivo') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tema_id) REFERENCES temas(id) ON DELETE CASCADE
);


-- Tabla de Tests
CREATE TABLE tests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    description TEXT,
    num_questions INT DEFAULT 0,
    tema_id INT NOT NULL,
    status ENUM('activo', 'inactivo') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tema_id) REFERENCES temas(id) ON DELETE CASCADE
);


-- Tabla de Preguntas
CREATE TABLE preguntas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    option1 TEXT NOT NULL,
    option2 TEXT NOT NULL,
    option3 TEXT,
    option4 TEXT,
    right_answer INT DEFAULT NULL, -- 1, 2, 3, 4
    answer_explained TEXT,
    difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    test_id INT NOT NULL,
    status ENUM('activo', 'inactivo') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE,
    CONSTRAINT unique_question UNIQUE (question, option1, option2, option3, option4)
);


-- Tabla de Resultados
CREATE TABLE resultados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aciertos INT NOT NULL DEFAULT 0,
    errores INT NOT NULL DEFAULT 0,
    en_blanco INT NOT NULL DEFAULT 0,
    score FLOAT NOT NULL DEFAULT 0,
    timeTaken FLOAT DEFAULT 0,
    test_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
);

-- Tabla de respuestas del usuario
CREATE TABLE respuestas_usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resultado_id INT NOT NULL,
    question_id INT NOT NULL,
    respuesta_usuario INT DEFAULT NULL,
    respuesta_correcta INT DEFAULT NULL,
    es_respondida BOOLEAN DEFAULT FALSE,
    es_correcta BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES preguntas(id) ON DELETE CASCADE,
    FOREIGN KEY (resultado_id) REFERENCES resultados(id) ON DELETE CASCADE
);

-- Tabla de Foros
CREATE TABLE foros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

-- Tabla de Hilos
CREATE TABLE hilos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT,
    foro_id INT,
    usuario_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (foro_id) REFERENCES foros(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de Mensajes
CREATE TABLE mensajes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contenido TEXT NOT NULL, 
    usuario_id INT,
    hilo_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (hilo_id) REFERENCES hilos(id) ON DELETE CASCADE
);

-- Tabla de mensajes chat
CREATE TABLE chat_mensajes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tema_id INT NOT NULL,
  usuario_id INT NOT NULL,
  texto TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tema_id) REFERENCES temas(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla para blog/novedades.
CREATE TABLE blog (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    image VARCHAR(255),
    autor VARCHAR(100),
    publicado BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla para almacenar consultas enviadas desde la interfaz de contacto
CREATE TABLE contacto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    asunto VARCHAR(255),
    mensaje TEXT NOT NULL,
    respondido BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para testimonios o reseñas
CREATE TABLE testimonios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    curso_id INT,
    contenido TEXT NOT NULL,
    aprobado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE
);

-- Tabla para preguntas frecuentes
CREATE TABLE faqs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pregunta VARCHAR(255) NOT NULL,
    respuesta TEXT NOT NULL,
    orden INT DEFAULT 0,
    publicada BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--  Tabla para actividad de los usuarios
CREATE TABLE actividad (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    tipo ENUM('inscripcion', 'videoclase', 'test', 'comentario', 'otro') NOT NULL,
    descripcion TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

------------------------------------------------------------------

-- Tabla para seguimiento de progreso por tema o videoclase
CREATE TABLE progreso_usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    tema_id INT,
    videoclase_id INT,
    completado BOOLEAN DEFAULT FALSE,
    tiempo_dedicado INT DEFAULT 0, -- en minutos
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (tema_id) REFERENCES temas(id),
    FOREIGN KEY (videoclase_id) REFERENCES videoclases(id)
);

-- Tabla para valoraciones y comentarios (feedback)
CREATE TABLE valoraciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    tipo ENUM('curso', 'tema', 'videoclase', 'test'),
    referencia_id INT NOT NULL,
    puntuacion INT CHECK(puntuacion BETWEEN 1 AND 5),
    comentario TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabla para notificaciones
CREATE TABLE notificaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    mensaje TEXT NOT NULL,
    leido BOOLEAN DEFAULT FALSE,
    tipo ENUM('sistema', 'curso', 'foro', 'otro'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);


-- Indices para datos que se buscan frecuentemente
CREATE INDEX idx_usuario_email ON usuarios(email);
CREATE INDEX idx_test_tema_id ON tests(tema_id);
CREATE INDEX idx_pregunta_test_id ON preguntas(test_id);
CREATE INDEX idx_videoclase_tema_id ON videoclases(tema_id);
CREATE INDEX idx_resultado_user_test ON resultados(user_id, test_id);


-- Insertar usuarios de prueba
INSERT INTO usuarios (name, image, email, password, rol, is_verified)
VALUES 
  ('Juan Pérez', 'https://example.com/images/juan.jpg', 'admin@gmail.com', '$2b$10$FcQmrHZiO8J2Z2lKdSZJVOTO2U/hfjVoBvWC1j2X0WsObrUOnC.lO', 'admin', TRUE),
  ('Ana López', 'https://example.com/images/ana.jpg', 'ana@example.com', 'password456', 'user', TRUE),
  ('Carlos García', 'https://example.com/images/carlos.jpg', 'carlos@example.com', 'password789', 'teacher', TRUE),
  ('María Fernández', 'https://example.com/images/maria.jpg', 'maria@example.com', 'password101', 'user', FALSE),
  ('Pedro Sánchez', 'https://example.com/images/pedro.jpg', 'pepe@gmail.com', '$2b$10$FcQmrHZiO8J2Z2lKdSZJVOTO2U/hfjVoBvWC1j2X0WsObrUOnC.lO', 'user', TRUE);


-- Insertar cursos de prueba
INSERT INTO cursos (name, image, description)
VALUES 
  ('Curso de Matemáticas', 'curso.png', 'Curso completo de matemáticas con ejercicios y teorías.'),
  ('Curso de Historia', 'curso.png', 'Curso de historia con enfoque en las civilizaciones antiguas.'),
  ('Curso de Ciencias', 'curso.png', 'Curso de ciencias, cubriendo biología, química y física.'),
  ('Curso de Lengua Española', 'curso.png', 'Curso de lengua española para mejorar gramática y vocabulario.'),
  ('Curso de Filosofía', 'curso.png', 'Curso introductorio a la filosofía con temas de ética, lógica, y metafísica.');


-- Insertar registros de matrícula (usuarios matriculados en cursos)
INSERT INTO usuarios_cursos (usuario_id, curso_id)
VALUES 
  (1, 1), -- Juan Pérez en Curso de Matemáticas
  (2, 2), -- Ana López en Curso de Historia
  (3, 3), -- Carlos García en Curso de Ciencias
  (4, 4), -- María Fernández en Curso de Lengua Española
  (5, 5); -- Pedro Sánchez en Curso de Filosofía

-- Insertar categorías de prueba (pertenecen a los cursos)
INSERT INTO categorias (name, image, description, curso_id)
VALUES 
  ('Álgebra', 'https://example.com/images/algebra.jpg', 'Categoría dedicada al estudio del álgebra.', 1),
  ('Civilizaciones Antiguas', 'https://example.com/images/civilizations.jpg', 'Categoría sobre civilizaciones antiguas de la historia.', 2),
  ('Biología', 'https://example.com/images/biology.jpg', 'Categoría de biología, abarcando genética, anatomía y más.', 3),
  ('Gramática Española', 'https://example.com/images/grammar.jpg', 'Categoría que abarca la gramática y sintaxis del español.', 4),
  ('Ética y Filosofía', 'https://example.com/images/ethics.jpg', 'Categoría que trata sobre ética y filosofías de vida.', 5);


-- Insertar temas de prueba
INSERT INTO temas (indice_tema, name, image, description, pdf_url, category_id, curso_id)
VALUES 
  (1, 'Ecuaciones Lineales', 'tema.jpg', 'Tema sobre ecuaciones lineales en álgebra.', 'tema.pdf', 1, 1),
  (2, 'Imperios Antiguos', 'tema.jpg', 'Tema sobre los grandes imperios de la antigüedad.', 'tema.pdf', 2, 2),
  (3, 'Células y Tejidos', 'tema.jpg', 'Tema sobre la estructura de células y tejidos biológicos.', 'tema.pdf', 3, 3),
  (4, 'Verbos y Adverbios', 'tema.jpg', 'Tema sobre los verbos y su uso en español.', 'tema.pdf', 4, 4),
  (5, 'Filosofía Moral', 'tema.jpg', 'Tema sobre la filosofía moral y ética.', 'tema.pdf', 5, 5);

-- Insertar videoclases de prueba
INSERT INTO videoclases (name, image, description, video_url, duration, tema_id)
VALUES 
  ('Resolución de Ecuaciones', 'video.jpg', 'Videoclase sobre la resolución de ecuaciones lineales.', 'video.mp4', 60, 1),
  ('La Historia de Roma', 'video.jpg', 'Videoclase sobre la historia de Roma y sus emperadores.', 'video.mp4', 45, 2),
  ('La Célula Animal', 'video.jpg', 'Videoclase sobre la estructura de las células animales.', 'video.mp4', 50, 3),
  ('El Uso del Subjuntivo', 'video.jpg', 'Videoclase sobre el uso del subjuntivo en español.', 'video.mp4', 40, 4),
  ('Ética y Decisiones Morales', 'video.jpg', 'Videoclase sobre la ética y las decisiones morales.', 'video.mp4', 55, 5);

-- Insertar tests de prueba
INSERT INTO tests (name, image, description, num_questions, tema_id)
VALUES 
  ('Test de Ecuaciones Lineales', 'test.jpg', 'Test de matemáticas sobre ecuaciones lineales.', 10, 1),
  ('Test de Historia de Roma', 'test.jpg', 'Test sobre la historia de Roma.', 8, 2),
  ('Test de Biología Celular', 'test.jpg', 'Test sobre biología y las células animales.', 12, 3),
  ('Test de Gramática Española', 'test.jpg', 'Test de gramática y conjugación de verbos en español.', 15, 4),
  ('Test de Filosofía Moral', 'test.jpg', 'Test sobre ética y filosofía moral.', 10, 5);

-- Insertar preguntas de prueba
INSERT INTO preguntas (question, option1, option2, option3, option4, right_answer, answer_explained, difficulty, test_id)
VALUES 
  ('¿Qué es una ecuación lineal?', 'Una expresión algebraica', 'Una ecuación de primer grado', 'Una función cuadrática', 'Una raíz cuadrada', 2, 'Una ecuación lineal es de primer grado.', 'medium', 1),
  ('¿Quién fue el primer emperador romano?', 'César Augusto', 'Nerón', 'Trajano', 'Marco Aurelio', 1, 'César Augusto fue el primer emperador de Roma.', 'medium', 2),
  ('¿Qué es una célula?', 'La unidad básica de los organismos', 'Un órgano del cuerpo', 'Una molécula', 'Un tipo de tejido', 1, 'La célula es la unidad básica de los organismos vivos.', 'easy', 3),
  ('¿Qué es un verbo en español?', 'Una palabra que indica acción', 'Una palabra que describe a un sustantivo', 'Una palabra que conecta oraciones', 'Una palabra que modifica un sustantivo', 1, 'Un verbo indica acción o estado.', 'easy', 4),
  ('¿Qué es la ética?', 'El estudio de la moral', 'El estudio de la política', 'El estudio de la lógica', 'El estudio de las emociones', 1, 'La ética estudia la moral y los principios de lo correcto y lo incorrecto.', 'hard', 5);

-- Insertar resultados de prueba
INSERT INTO resultados (aciertos, errores, en_blanco, score, timeTaken, test_id, user_id)
VALUES 
  (8, 2, 0, 80, 45, 1, 1),
  (7, 3, 0, 70, 40, 2, 2),
  (10, 0, 0, 100, 50, 3, 3),
  (12, 3, 0, 90, 55, 4, 4),
  (9, 1, 1, 85, 60, 5, 5);

-- Insertar respuestas de prueba
INSERT INTO respuestas_usuario (resultado_id, question_id, respuesta_usuario, respuesta_correcta, es_respondida, es_correcta)
VALUES 
  (1, 1, 2, 2, TRUE, TRUE),
  (1, 2, 1, 1, TRUE, TRUE),
  (1, 3, 1, 1, TRUE, TRUE),
  (2, 1, 1, 1, TRUE, FALSE),
  (2, 3, 2, 2, TRUE, TRUE);

-- Insertar noticias o entradas blog
INSERT INTO blog (titulo, contenido, image, autor) VALUES
('¡Abrimos nuevas convocatorias!', 'Nos complace anunciar que abrimos nuevas plazas para nuestros cursos de preparación.', 'post.jpg', 'Pedro Ramirez'),
('Consejos para estudiar online', 'Aquí tienes los mejores tips para aprovechar tu estudio desde casa.', 'post.jpg', 1),
('Entrevista con un opositor aprobado', 'Conoce la experiencia de éxito de Ana tras pasar su oposición con nosotros.', 'post.jpg', 'Juan lobo'),
('Nueva plataforma lanzada', 'Nuestra nueva plataforma mejora tu experiencia de usuario.', 'post.jpg', 'Raquel peña'),
('Actualización de temarios 2025', 'Ya disponibles los nuevos temarios adaptados al BOE 2025.', 'post.jpg', 'Pedro Ramirez');

-- Insertar testimonios
INSERT INTO testimonios (usuario_id, curso_id, contenido, aprobado) VALUES
(2, 1, 'Gracias a MyAcademy conseguí mi plaza. El material y los tests fueron clave.', TRUE),
(3, 2, 'Los profesores son excelentes. Me sentí acompañada todo el tiempo.', TRUE),
(4, 1, 'Agradezco el seguimiento y la flexibilidad del curso online.', TRUE),
(5, 3, 'Superé la oposición en menos de un año. Recomendado.', TRUE),
(1, 2, 'El simulador de exámenes es lo mejor de la plataforma.', TRUE);

-- Insertar preguntas frecuentes
INSERT INTO faqs (pregunta, respuesta, orden) VALUES
('¿Cuándo comienzan los cursos?', 'Los cursos tienen convocatorias todos los meses. Puedes inscribirte en cualquier momento.', 1),
('¿Los cursos son online o presenciales?', 'Nuestros cursos son 100% online, accesibles desde cualquier dispositivo.', 2),
('¿Qué métodos de pago aceptan?', 'Puedes pagar con tarjeta, PayPal o transferencia bancaria.', 3),
('¿Hay tutores disponibles?', 'Sí, cada curso cuenta con un tutor especializado que te acompañará.', 4),
('¿Puedo probar antes de pagar?', 'Sí, ofrecemos clases de prueba y acceso limitado gratuito para nuevos usuarios.', 5);

INSERT INTO actividad (usuario_id, tipo, descripcion) VALUES
(1, 'inscripcion', 'Juan Pérez se inscribió en el curso "Psicotécnicos"'),
(2, 'videoclase', 'María Gómez subió una videoclase al curso "Constitución Española"'),
(3, 'test', 'Carlos García completó el test "Tema 2: Administración Pública"'),
(4, 'comentario', 'Ana López dejó un comentario en "Videoclase 5"'),
(2, 'otro', 'Nueva actualización de perfil');




/* OTRAS MEJORAS: 

    -añadir campos como created_by INT, updated_by INT a todas las tablas, 
    para auditoria y trazabilidad (ID del usuario que ha creado o modificado una tabla) */