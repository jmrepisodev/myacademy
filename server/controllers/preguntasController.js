const db = require('../config/database');


// Obtener preguntas con paginación y filtros opcionales
exports.getAllQuestions = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;
        const testId = req.query.testId ? parseInt(req.query.testId, 10) : null;

        const queryParams = [];
        let baseQuery = `FROM preguntas`;
        let whereClause = '';

        if (testId) {
            whereClause = ' WHERE test_id = ?';
            queryParams.push(testId);
        }

        // 1. Obtener total de preguntas
        const [countResult] = await db.query(`SELECT COUNT(*) as total ${baseQuery}${whereClause}`, queryParams);
        const total = countResult[0].total;

        // 2. Obtener preguntas paginadas
        const [results] = await db.query(
            `SELECT * ${baseQuery}${whereClause} LIMIT ? OFFSET ?`,
            [...queryParams, limit, offset]
        );

        console.log(results)
        res.json({
            questions: results,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('Error interno del servidor: ', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


// Muestra un registro en función de su ID
exports.getQuestionById = async (req, res) => {
    const questionId = req.params.id;

    try {
        const [results] = await db.query('SELECT * FROM preguntas WHERE id = ?', [questionId]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Pregunta no encontrada' });
        }

        res.json(results[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};




/*
// Crea un nuevo registro
exports.storeQuestion = async (req, res) => {
    const pregunta = req.body;

    try {
        const [results] = await db.query('INSERT IGNORE INTO preguntas SET ?', [pregunta]);
        res.status(201).json({ message: 'Pregunta creada satisfactoriamente', id: results.insertId });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
*/


// Crea un nuevo registro de pregunta
exports.storeQuestion = async (req, res) => {
    const pregunta = req.body;
    
    // Desestructuramos los datos del cuerpo de la solicitud
    const { 
        question, 
        option1, 
        option2, 
        option3, 
        option4, 
        right_answer,  
        answer_explained, 
        test_id
    } = pregunta;


    // Inicia la transacción
    const connection = await db.getConnection();
    await connection.beginTransaction();


    try {
        let respuesta = parseInt(right_answer, 10);
        if (respuesta < 1 || respuesta > 4) {
            throw new Error('La respuesta debe ser un número entre 1 y 4');
        }

        const datosPregunta = {
            question,
            option1: option1 || null,
            option2: option2 || null,
            option3: option3 || null,
            option4: option4 || null,
            right_answer: respuesta || null,
            answer_explained: answer_explained || null,
            test_id: test_id || null,
        };

        console.log(datosPregunta);

        // Realizamos la inserción en la base de datos. Evita preguntas duplicadas
        const [results] = await db.query('INSERT IGNORE INTO preguntas SET ?', [datosPregunta]);

       // Verificamos si la inserción fue exitosa
       if (results.affectedRows > 0) {
            // Aquí actualizamos el número de preguntas
            // Verificamos que el test no sean nulo
            if (test_id) {
                // Incrementar directamente el número de preguntas en categorias
                await connection.query('UPDATE tests SET num_questions = num_questions + ? WHERE id = ?', [1, test_id]);
            }

             // Hacemos commit de la transacción
             await connection.commit();

            // Si affectedRows es mayor que 0, la inserción fue exitosa
            res.status(201).json({ message: 'Pregunta creada satisfactoriamente', id: results.insertId });
        } else {
             // Si affectedRows es 0, no se insertó la pregunta, posiblemente por duplicados
            await connection.rollback();
            res.status(400).json({ error: 'Error al intentar insertar la pregunta' });
        }

    } catch (error) {
        // Si hay cualquier error, hacemos rollback de la transacción
        await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }finally {
        // Liberamos la conexión
        connection.release();
    }
};




/*
// Actualiza un registro
exports.updateQuestion = async (req, res) => {
    const questionId = req.body.id;
    const pregunta = req.body;

    try {
        const [results] = await db.query('UPDATE preguntas SET ? WHERE id = ?', [pregunta, questionId]);

        if (results.affectedRows === 0) {
            return res.status(404).send('Pregunta no encontrada');
        }

        res.json({ message: 'Pregunta actualizada satisfactoriamente' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
*/

// Edita o actualiza una pregunta existente
exports.updateQuestion = async (req, res) => {
    const id = req.params.id;
    const pregunta = req.body;

    // Desestructuramos los datos del cuerpo de la solicitud
    const { 
        question, 
        option1, 
        option2, 
        option3, 
        option4, 
        right_answer,  
        answer_explained, 
        test_id,
        difficulty
    } = pregunta;

    

    try {
        let respuesta = parseInt(right_answer, 10);
        if (respuesta < 1 || respuesta > 4) {
            throw new Error('La respuesta debe ser un número entre 1 y 4');
        }

        const datosPregunta = {
            question,
            option1: option1 || null,
            option2: option2 || null,
            option3: option3 || null,
            option4: option4 || null,
            right_answer: respuesta || null,
            answer_explained: answer_explained || null,
            test_id: test_id || null,
            difficulty: difficulty|| null
        };

        console.log(datosPregunta);

        // Realizamos la actualización en la base de datos
        const [results] = await db.query('UPDATE preguntas SET ? WHERE id = ?', [datosPregunta, id]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Error al intentar actualizar la pregunta: pregunta no encontrada' });

        }

        res.status(200).json({ message: 'Pregunta actualizada satisfactoriamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    } 
};

/*
// Elimina un registro
exports.deleteQuestion = async (req, res) => {
    const questionId = req.params.id;

    try {
        const [results] = await db.query('DELETE FROM preguntas WHERE id = ?', [questionId]);

        if (results.affectedRows === 0) {
            return res.status(404).send('Pregunta no encontrada');
        }

        res.json({ message: 'Pregunta eliminada satisfactoriamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
*/

// Elimina un registro
exports.deleteQuestion = async (req, res) => {
    const questionId = req.params.id;

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        // Código para eliminar y actualizar contadores
         // 1. Obtener la pregunta para determinar a qué categoría, subcategoría y test pertenece
         const [questionData] = await db.query('SELECT * FROM preguntas WHERE id = ?', [questionId]);

         if (questionData.length === 0) {
             return res.status(404).send('Pregunta no encontrada');
         }
 
         const question = questionData[0];
         const { test_id } = question;
 
         // 2. Eliminar la pregunta de la tabla 'preguntas'
         const [deleteResult] = await db.query('DELETE FROM preguntas WHERE id = ?', [questionId]);
 
         if (deleteResult.affectedRows === 0) {
             return res.status(404).send('No se pudo eliminar la pregunta');
         }
 
         // 3. Actualizar los contadores de preguntas en test
         if (test_id) {
             await db.query('UPDATE tests SET num_questions = num_questions - 1 WHERE id = ?', [test_id]);
         }
        
        // Confirmamos la transacción
        await connection.commit();

         // 4. Enviar respuesta exitosa
         res.json({ message: 'Pregunta eliminada satisfactoriamente y contadores actualizados' });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }finally {
        // Liberamos la conexión
        connection.release();
    } 

};


