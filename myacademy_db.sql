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
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Último acceso
    is_verified BOOLEAN DEFAULT FALSE,                  -- Verificación de email
    verification_token VARCHAR(255),                    -- Token de verificación
    reset_token VARCHAR(255),                           -- Token para restablecer contraseña
    token_expiration DATETIME,                          -- Expiración del token
    status ENUM('activo', 'inactivo') DEFAULT 'activo', -- Estado del usuario
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Categorías de cursos
CREATE TABLE categorias_cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    description TEXT,
    status ENUM('activo', 'inactivo') DEFAULT 'activo',
    orden INT DEFAULT 1,  -- Orden de visualización
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP   
);

-- Tabla de Cursos (actualizada)
CREATE TABLE cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(255),                                -- Portada del curso
    description TEXT,                                  -- Descripción general
    requisitos TEXT,                                   -- Requisitos previos
    objetivos TEXT,                                    -- Objetivos del curso
    temario TEXT,                                      -- Breve temario o link a temas
    precio DECIMAL(10,2),                              -- Precio total
    modalidad ENUM('presencial', 'online', 'mixto') DEFAULT 'online',
    duracion VARCHAR(100),                             -- Ej: "3 meses", "40h"
    fecha_inicio DATE,                                 -- Fecha de inicio
    fecha_fin DATE,                                    -- Fecha de finalización
    status ENUM('activo', 'inactivo', 'finalizado') DEFAULT 'activo',
    progreso_max INT DEFAULT 100,                      -- Límite superior del progreso (%)
    certificado_disponible BOOLEAN DEFAULT FALSE,      -- Indica si genera certificado
    profesor_id INT,                                   -- FK al profesor responsable
    categoria_id INT,                                  -- FK a tabla de categorías (opcional)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (profesor_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (categoria_id) REFERENCES categorias_cursos(id) ON DELETE SET NULL
);


-- Tabla de Matrícula: usuarios_cursos
CREATE TABLE usuarios_cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    curso_id INT NOT NULL,
    progreso INT DEFAULT 0 CHECK (progreso BETWEEN 0 AND 100),
    estado ENUM('no iniciado', 'en progreso', 'finalizado') DEFAULT 'no iniciado',
    fecha_inscripcion DATE DEFAULT CURRENT_DATE,
    completado BOOLEAN DEFAULT FALSE,
    certificado_emitido BOOLEAN DEFAULT FALSE,
    fecha_completado DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (usuario_id, curso_id), -- un usuario solo puede matricularse una vez en el mismo curso
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE
);


-- Tabla de Categorías (categorías del curso)
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    description TEXT,
    curso_id INT NOT NULL,
    status ENUM('activo', 'inactivo') DEFAULT 'activo',
    orden INT DEFAULT 1,  -- Orden de visualización
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE
);



CREATE TABLE temas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,                         -- Título del tema
    image VARCHAR(255),                                 -- Imagen ilustrativa (opcional)
    description TEXT,                                   -- Descripción general
    pdf_url VARCHAR(255),                               -- PDF explicativo o guía
    material_adicional TEXT,                            -- Links adicionales o archivos
    duracion_estimada VARCHAR(50),                      -- Ej: "2 horas", "1 semana"
    orden INT NOT NULL,                                 -- Orden de visualización dentro del curso
    curso_id INT NOT NULL,                              -- Curso al que pertenece
    category_id INT,                                    -- Categoría temática (opcional)
    status ENUM('activo', 'inactivo') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categorias(id) ON DELETE SET NULL, -- preservar temas si se borra una categoría.
    FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE
);



CREATE TABLE videoclases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,                         -- Título de la videoclase
    image VARCHAR(255),                                 -- Miniatura opcional
    description TEXT,                                   -- Breve explicación
    video_url VARCHAR(255) NOT NULL,                    -- Enlace al video (YouTube, Vimeo, etc.)
    duration INT,                                       -- Duración en minutos
    orden INT DEFAULT 1,                                -- Orden dentro del tema
    tema_id INT NOT NULL,                               -- Tema relacionado
    status ENUM('activo', 'inactivo') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tema_id) REFERENCES temas(id) ON DELETE CASCADE
);



-- Tabla de Tests
CREATE TABLE tests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,                         -- Nombre del test
    image VARCHAR(255),                                 -- Imagen ilustrativa (opcional)
    description TEXT,                                   -- Descripción general
    num_questions INT DEFAULT 0,                        -- Número de preguntas
    tiempo_limite INT,                                  -- Tiempo límite en minutos (opcional)
    intentos_max INT DEFAULT 1,                         -- Número máximo de intentos
    puntuacion_aprobado DECIMAL(5,2) DEFAULT 50.00,     -- Nota mínima para aprobar
    tema_id INT NOT NULL,                               -- Tema relacionado
    status ENUM('activo', 'inactivo') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tema_id) REFERENCES temas(id) ON DELETE CASCADE
);



-- Tabla de Preguntas
CREATE TABLE preguntas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,   -- Enunciado de la pregunta
    option1 TEXT NOT NULL,
    option2 TEXT NOT NULL,
    option3 TEXT,
    option4 TEXT,
    image VARCHAR(255) DEFAULT NULL, -- imagen opcional
    right_answer INT DEFAULT NULL CHECK (right_answer BETWEEN 1 AND 4),
    answer_explained TEXT,  -- Explicación de la respuesta correcta
    difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    test_id INT NOT NULL,
    tipo_pregunta ENUM('single', 'multiple', 'truefalse') DEFAULT 'single', 
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
    score FLOAT NOT NULL DEFAULT 0.00,
    porcentaje DECIMAL(5,2) DEFAULT 0.00,   -- % de aciertos
    timeTaken FLOAT DEFAULT 0,              -- Tiempo en minutos
    intento_numero INT DEFAULT 1,           -- Número de intento del usuario sobre ese test
    test_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (test_id, user_id, intento_numero),     -- Para evitar múltiples entradas sin control para un mismo usuario en un test
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
);


-- Tabla de respuestas del usuario
CREATE TABLE respuestas_usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resultado_id INT NOT NULL,
    question_id INT NOT NULL,
    respuesta_usuario INT DEFAULT NULL CHECK (respuesta_usuario BETWEEN 1 AND 4),
    respuesta_correcta INT DEFAULT NULL CHECK (respuesta_correcta BETWEEN 1 AND 4),
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
    description TEXT,
    slug VARCHAR(255) UNIQUE, -- URL amigable
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Hilos
CREATE TABLE hilos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT,
    foro_id INT,
    usuario_id INT,
    vistas INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_cursos_categoria ON cursos(categoria_id);
CREATE INDEX idx_temas_curso ON temas(curso_id);
CREATE INDEX idx_test_tema_id ON tests(tema_id);
CREATE INDEX idx_pregunta_test_id ON preguntas(test_id);
CREATE INDEX idx_videoclase_tema_id ON videoclases(tema_id);
CREATE INDEX idx_resultado_user_test ON resultados(user_id, test_id);

CREATE INDEX idx_foro_id ON hilos(foro_id);
CREATE INDEX idx_usuario_id ON hilos(usuario_id);

CREATE INDEX idx_hilo_id ON mensajes(hilo_id);
CREATE INDEX idx_usuario_id ON mensajes(usuario_id);


-- Insertar usuarios de prueba
INSERT INTO usuarios (name, image, email, password, rol, is_verified)
VALUES 
  ('Juan Pérez', 'https://example.com/images/juan.jpg', 'admin@gmail.com', '$2b$10$FcQmrHZiO8J2Z2lKdSZJVOTO2U/hfjVoBvWC1j2X0WsObrUOnC.lO', 'admin', TRUE),
  ('Ana López', 'https://example.com/images/ana.jpg', 'ana@example.com', 'password456', 'user', TRUE),
  ('Carlos García', 'https://example.com/images/carlos.jpg', 'carlos@example.com', 'password789', 'teacher', TRUE),
  ('María Fernández', 'https://example.com/images/maria.jpg', 'maria@example.com', 'password101', 'user', FALSE),
  ('Pedro Sánchez', 'profile.png', 'pepe@gmail.com', '$2b$10$FcQmrHZiO8J2Z2lKdSZJVOTO2U/hfjVoBvWC1j2X0WsObrUOnC.lO', 'user', TRUE);


-- Insertar cursos de prueba
INSERT INTO cursos (name, image, description, requisitos, objetivos, temario, precio, modalidad, duracion, fecha_inicio, fecha_fin, status, progreso_max, certificado_disponible, profesor_id)
VALUES 
-- Curso 1
('Preparación Oposición Guardia Civil', 
 'curso.png', 
 'Curso intensivo para la preparación de oposiciones a Guardia Civil.', 
 'Ser mayor de edad, nacionalidad española, ESO finalizado.', 
 'Superar con éxito todas las pruebas teóricas y físicas de la oposición.', 
 'Temario oficial BOE, psicotécnicos, pruebas físicas.', 
 650.00, 
 'presencial', 
 '6 meses', 
 '2025-06-01', 
 '2025-12-01', 
 'activo', 
 100, 
 TRUE,  
 2),

-- Curso 2
('Oposiciones Auxiliar Administrativo del Estado', 
 'curso.png', 
 'Curso online con tutorías para preparar las oposiciones de Auxiliar Administrativo.', 
 'Graduado escolar o equivalente.', 
 'Dominar los temas del bloque I y II y entrenar ejercicios prácticos.', 
 'Ofimática, Constitución, procedimiento administrativo.', 
 480.00, 
 'online', 
 '4 meses', 
 '2025-07-15', 
 '2025-11-15', 
 'activo', 
 100, 
 TRUE, 
 3),

-- Curso 3
('Curso Correos 2025 - Nivel Básico', 
 'curso.png', 
 'Curso introductorio para las pruebas de ingreso a Correos (perfil base).', 
 'Tener nacionalidad española o UE, ESO.', 
 'Comprender el temario básico y practicar exámenes tipo test.', 
 'Legislación postal, productos y servicios, atención al cliente.', 
 350.00, 
 'online', 
 '3 meses', 
 '2025-05-20', 
 '2025-08-20', 
 'activo', 
 100, 
 FALSE, 
 4),

-- Curso 4
('Curso de Oposición para Policía Nacional Escala Básica', 
 'curso.png', 
 'Preparación integral para las pruebas de acceso a la Escala Básica de la Policía Nacional.', 
 'Bachillerato completo, nacionalidad española, sin antecedentes penales.', 
 'Aprobar las pruebas físicas, teóricas y psicotécnicas.', 
 'Normativa, ortografía, pruebas físicas, entrevista personal.', 
 720.00, 
 'mixto', 
 '5 meses', 
 '2025-09-01', 
 '2026-02-01', 
 'activo', 
 100, 
 TRUE, 
 2),

-- Curso 5
('Oposición Técnico de Hacienda', 
 'curso.png', 
 'Curso avanzado orientado a superar las oposiciones al cuerpo técnico de Hacienda.', 
 'Título universitario, preferiblemente en economía, derecho o ADE.', 
 'Preparar adecuadamente los temas de contabilidad, fiscalidad y derecho.', 
 'Contabilidad, IRPF, IVA, derecho mercantil y tributario.', 
 980.00, 
 'online', 
 '8 meses', 
 '2025-06-10', 
 '2026-02-10', 
 'activo', 
 100, 
 TRUE, 
 5);



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
-- Curso 1: Preparación Oposición Guardia Civil (curso_id = 1)
INSERT INTO temas (name, image, description, pdf_url, material_adicional, duracion_estimada, orden, curso_id, category_id)
VALUES 
('Constitución Española', 'tema.jpg', 'Estudio detallado de la Constitución Española.', 'tema.pdf', NULL, '3 horas', 1, 1, NULL),
('Derechos Humanos', 'tema.jpg', 'Análisis de los derechos y libertades fundamentales.', 'tema.pdf', NULL, '2 horas', 2, 1, NULL),
('Pruebas Psicotécnicas', 'tema.jpg', 'Técnicas y prácticas para resolver psicotécnicos.', 'tema.pdf', NULL, '2 horas', 3, 1, NULL),
('Ortografía y Gramática', 'tema.jpg', 'Revisión de reglas ortográficas y gramaticales.', 'tema.pdf', NULL, '1.5 horas', 4, 1, NULL),
('Pruebas Físicas', 'tema.jpg', 'Requisitos físicos y técnicas de entrenamiento.', 'tema.pdf', NULL, '4 horas', 5, 1, NULL);


-- Insertar videoclases de prueba
INSERT INTO videoclases (name, image, description, video_url, duration, orden, tema_id, status)
VALUES 
('Introducción a la Constitución Española', 'video_constitucion.jpg', 'Explicación de los artículos más importantes de la Constitución.', 'video.mp4', 25, 1, 1, 'activo'),
('Historia de los Derechos Humanos', 'video_derechos.jpg', 'Origen y evolución de los derechos fundamentales.', 'video.mp4', 30, 1, 2, 'activo'),
('Ejercicios psicotécnicos básicos', 'video_psico.jpg', 'Resolución guiada de ejercicios comunes.', 'video.mp4', 35, 1, 3, 'activo'),
('Ortografía para opositores', 'video_ortografia.jpg', 'Errores frecuentes y cómo evitarlos.', 'video.mp4', 20, 1, 4, 'activo'),
('Entrenamiento para pruebas físicas', 'video_fisicas.jpg', 'Rutina recomendada para superar las pruebas físicas.', 'video.mp4', 40, 1, 5, 'activo');


-- Insertar tests de prueba
-- Tema 1: Constitución Española
INSERT INTO tests (name, image, description, num_questions, tiempo_limite, intentos_max, puntuacion_aprobado, tema_id, status)
VALUES 
('Test Constitución - Parte 1', 'test.jpg', 'Preguntas sobre los primeros 29 artículos.', 10, 20, 2, 60.00, 1, 'activo'),
('Test Constitución - Parte 2', 'test.jpg', 'Preguntas sobre organización territorial y poder legislativo.', 10, 25, 2, 60.00, 1, 'activo'),
('Simulacro Constitución Completo', 'test.jpg', 'Examen completo de la Constitución.', 20, 30, 1, 70.00, 1, 'activo');

-- Tema 2: Derechos Humanos
INSERT INTO tests (name, image, description, num_questions, tiempo_limite, intentos_max, puntuacion_aprobado, tema_id, status)
VALUES 
('Test Derechos Fundamentales', 'test.jpg', 'Conceptos básicos y artículos internacionales.', 10, 20, 2, 60.00, 2, 'activo'),
('Test Pactos Internacionales', 'test.jpg', 'Instrumentos legales de protección de DD.HH.', 12, 25, 1, 65.00, 2, 'activo'),
('Simulacro Derechos Humanos', 'test.jpg', 'Evaluación general del tema.', 15, 30, 2, 70.00, 2, 'activo');

-- Tema 3: Pruebas Psicotécnicas
INSERT INTO tests (name, image, description, num_questions, tiempo_limite, intentos_max, puntuacion_aprobado, tema_id, status)
VALUES 
('Test Series Numéricas', 'test.jpg', 'Secuencias numéricas para practicar lógica.', 10, 15, 3, 60.00, 3, 'activo'),
('Test Razonamiento Verbal', 'test.jpg', 'Comprensión y deducción textual.', 10, 20, 2, 60.00, 3, 'activo'),
('Simulacro Psicotécnico', 'test.jpg', 'Mixto: lógica, verbal y espacial.', 20, 35, 1, 70.00, 3, 'activo');

-- Tema 4: Ortografía y Gramática
INSERT INTO tests (name, image, description, num_questions, tiempo_limite, intentos_max, puntuacion_aprobado, tema_id, status)
VALUES 
('Test Ortografía Básica', 'test.jpg', 'Palabras con B y V, H y sin H.', 10, 10, 3, 60.00, 4, 'activo'),
('Test Gramática Española', 'test.jpg', 'Concordancia, tiempos verbales, uso de preposiciones.', 12, 20, 2, 65.00, 4, 'activo'),
('Simulacro Ortográfico', 'test.jpg', 'Ortografía nivel oposición.', 15, 25, 1, 70.00, 4, 'activo');

-- Tema 5: Pruebas Físicas
INSERT INTO tests (name, image, description, num_questions, tiempo_limite, intentos_max, puntuacion_aprobado, tema_id, status)
VALUES 
('Test Condición Física', 'test13.jpg', 'Evaluación teórica sobre requisitos y pruebas.', 10, 15, 2, 60.00, 5, 'activo'),
('Test Plan de Entrenamiento', 'test14.jpg', 'Técnicas y rutinas recomendadas.', 10, 20, 2, 65.00, 5, 'activo'),
('Simulacro Pruebas Físicas', 'test15.jpg', 'Test teórico-práctico de preparación física.', 15, 25, 1, 70.00, 5, 'activo');


-- Insertar preguntas de prueba
-- Preguntas para el Test: Constitución Española - Parte 1
INSERT INTO preguntas (question, option1, option2, option3, option4, right_answer, answer_explained, difficulty, test_id, tipo_pregunta, status)
VALUES 
('¿Qué artículo de la Constitución Española establece el derecho a la educación?', 'Artículo 27', 'Artículo 25', 'Artículo 35', 'Artículo 45', 1, 'El artículo 27 de la Constitución garantiza el derecho a la educación.', 'easy', 1, 'single', 'activo'),
('¿Cuál es la forma de estado de España?', 'Monarquía parlamentaria', 'República presidencialista', 'Monarquía absoluta', 'República parlamentaria', 1, 'España es una monarquía parlamentaria según lo establece el artículo 1.', 'medium', 1, 'single', 'activo'),
('¿Cuántas lenguas oficiales hay en España?', 'Una', 'Dos', 'Cuatro', 'Cinco', 2, 'España tiene varias lenguas oficiales, dependiendo de la comunidad autónoma.', 'medium', 1, 'single', 'activo'),
('¿Quién elige al Presidente del Gobierno en España?', 'El Rey', 'El Congreso de los Diputados', 'El Senado', 'Los ciudadanos', 2, 'El Presidente del Gobierno es elegido por el Congreso de los Diputados, según el artículo 68.', 'easy', 1, 'single', 'activo'),
('¿Qué principio establece la Constitución Española sobre la inviolabilidad de la persona?', 'Derecho al honor', 'Derecho a la libertad', 'Derecho a la inviolabilidad', 'Derecho a la información', 3, 'El artículo 17 establece el derecho a la inviolabilidad del domicilio y la libertad personal.', 'hard', 1, 'single', 'activo'),
('¿Qué artículo establece la soberanía nacional en España?', 'Artículo 1', 'Artículo 2', 'Artículo 3', 'Artículo 4', 1, 'El artículo 1 establece que la soberanía nacional reside en el pueblo español, del que emanan los poderes del Estado.', 'medium', 1, 'single', 'activo');

-- Preguntas para el Test: Constitución Española - Parte 2
INSERT INTO preguntas (question, option1, option2, option3, option4, right_answer, answer_explained, difficulty, test_id, tipo_pregunta, status)
VALUES 
('¿En qué artículo de la Constitución Española se establece la organización territorial del Estado?', 'Artículo 137', 'Artículo 150', 'Artículo 153', 'Artículo 155', 1, 'El artículo 137 establece la organización territorial del Estado en provincias y comunidades autónomas.', 'medium', 2, 'single', 'activo'),
('¿Qué establece el artículo 14 de la Constitución Española?', 'El derecho a la propiedad', 'El derecho a la igualdad', 'El derecho a la educación', 'El derecho al trabajo', 2, 'El artículo 14 establece que todos los españoles son iguales ante la ley.', 'easy', 2, 'single', 'activo'),
('¿Qué principio está consagrado en el artículo 27 de la Constitución Española?', 'El derecho al trabajo', 'El derecho a la educación', 'El derecho a la propiedad', 'El derecho a la vivienda', 2, 'El artículo 27 establece el derecho de todos a la educación.', 'easy', 2, 'single', 'activo'),
('¿Qué órgano es el encargado de la defensa de los derechos y libertades fundamentales?', 'El Congreso', 'El Tribunal Constitucional', 'El Senado', 'El Poder Judicial', 2, 'El Tribunal Constitucional es el encargado de la defensa de los derechos y libertades fundamentales.', 'medium', 2, 'single', 'activo'),
('¿Quién tiene la facultad para reformar la Constitución Española?', 'El Rey', 'El Presidente del Gobierno', 'Las Cortes Generales', 'El Tribunal Constitucional', 3, 'Las Cortes Generales son las encargadas de aprobar la reforma de la Constitución.', 'medium', 2, 'single', 'activo'),
('¿Qué artículo establece la autonomía de las Comunidades Autónomas?', 'Artículo 148', 'Artículo 149', 'Artículo 152', 'Artículo 153', 1, 'El artículo 148 establece las competencias de las Comunidades Autónomas.', 'hard', 2, 'single', 'activo');



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

-- Insertar datos de prueba en el foro
INSERT INTO foros (name, slug, description) VALUES
('Programación Web', 'programacion-web', 'Discusión sobre desarrollo web, tecnologías frontend y backend.'),
('Matemáticas Avanzadas', 'matematicas-avanzadas', 'Preguntas y respuestas sobre álgebra, cálculo y más.'),
('Ciencias Naturales', 'ciencias-naturales', 'Temas relacionados con física, química y biología.'),
('Lenguas y Literatura', 'lenguas-y-literatura', 'Foro para analizar textos, gramática y estilos literarios.'),
('Noticias Académicas', 'noticias-academicas', 'Comparte noticias relevantes del ámbito educativo.');


INSERT INTO hilos (titulo, contenido, foro_id, usuario_id) VALUES
('¿Cuál es la mejor forma de aprender React?', 'He comenzado con React y me gustaría recomendaciones.', 1, 1),
('Problema con derivadas implícitas', 'No entiendo cómo derivar estas funciones. ¿Alguna guía?', 2, 2),
('Diferencias entre protones y neutrones', '¿En qué se diferencian fundamentalmente?', 3, 3),
('Recomendaciones de novelas clásicas', 'Busco lecturas interesantes del siglo XIX.', 4, 1),
('¿Es cierto que eliminarán exámenes estatales?', 'Leí algo en el periódico pero no encontré fuentes confiables.', 5, 2);

INSERT INTO mensajes (contenido, usuario_id, hilo_id) VALUES
('Yo empecé con la documentación oficial y luego pasé a cursos prácticos.', 2, 1),
('Te recomiendo usar el libro de Stewart para entender derivadas.', 3, 2),
('Los protones tienen carga positiva y los neutrones son neutros.', 1, 3),
('Te recomiendo “Los Miserables” o “Crimen y Castigo”.', 2, 4),
('No he visto nada oficial, pero podría ser una reforma futura.', 3, 5),
('También puedes practicar con ejercicios interactivos como Khan Academy.', 1, 2),
('He visto que React.dev tiene muchos ejemplos actualizados.', 3, 1);

INSERT INTO notificaciones (usuario_id, mensaje, tipo, leido) VALUES
(1, 'Tienes una nueva lección disponible en tu curso de React. ¡No te la pierdas!', 'curso', FALSE),
(2, 'El foro de discusión sobre JavaScript ha sido actualizado. Revisa los nuevos mensajes.', 'foro', TRUE),
(3, 'Se ha asignado una nueva tarea en el curso de Node.js. La fecha límite es el 30 de este mes.', 'curso', FALSE),
(5, 'Notificación del sistema: El mantenimiento de la plataforma se realizará el 15 de mayo de 2025 entre las 02:00 AM y las 04:00 AM.', 'sistema', FALSE),
(5, 'Nuevo mensaje en el foro de Python: ¿Alguien ha probado la nueva librería FastAPI?', 'foro', TRUE);



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


-- Progreso para usuario 1
INSERT INTO progreso_usuario (usuario_id, tema_id, completado, tiempo_dedicado)
VALUES 
(5, 1, TRUE, 120),
(5, 2, FALSE, 45),
(5, 3, FALSE, 0),
(5, 4, TRUE, 90);

-- Progreso para usuario 2
INSERT INTO progreso_usuario (usuario_id, tema_id, completado, tiempo_dedicado)
VALUES 
(2, 1, TRUE, 100),
(2, 2, TRUE, 80),
(2, 3, TRUE, 95);

-- Progreso para usuario 1 en videoclases
INSERT INTO progreso_usuario (usuario_id, videoclase_id, completado, tiempo_dedicado)
VALUES 
(1, 1, TRUE, 30),
(1, 2, FALSE, 10);


/* OTRAS MEJORAS: 

    -añadir campos como created_by INT, updated_by INT a todas las tablas, 
    para auditoria y trazabilidad (ID del usuario que ha creado o modificado una tabla) */

   
