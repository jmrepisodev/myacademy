import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import Sidebar from '../components/Sidebar';

// 🔁 Función para parsear errores de API
const parseApiError = (error) => {
  if (error.response) {
    const data = error.response.data;
    if (data.errors) {
      return data.errors.map((e) => ({ msg: e.msg }));
    } else if (data.error) {
      return [{ msg: data.error }];
    }
  }
  return [{ msg: 'No se pudo conectar con el servidor.' }];
};

function Test() {
  const { testId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [startTime] = useState(Date.now());
  const [resultado, setResultado] = useState(null);
  const [respuestasUsuario, setRespuestasUsuario] = useState([]);
  const [errors, setErrors] = useState([]);

  // 📥 Cargar preguntas al iniciar
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await API.get(`/tests/${testId}/questions`);
        setQuestions(res.data);
        setErrors([]);
      } catch (err) {
        console.error('Error cargando preguntas:', err);
        setErrors(parseApiError(err));
      }
    };
    fetchQuestions();
  }, [testId]);

  const handleSelect = (qid, answer) => {
    setAnswers(prev => ({ ...prev, [qid]: answer }));
  };

  // 📤 Enviar test
  const handleSubmit = async () => {
    const timeTaken = (Date.now() - startTime) / 1000;
    let aciertos = 0, errores = 0, en_blanco = 0;

    if (!questions.length) return;

    // Validar respuestas
    questions.forEach(q => {
      const userAnswer = answers[q.id];
      if (!userAnswer) en_blanco++;
      else if (parseInt(userAnswer) === q.right_answer) aciertos++;
      else errores++;
    });

    const score = (aciertos / questions.length) * 100;

    try {
      const res = await API.post(`/tests/${testId}/result`, {
        aciertos,
        errores,
        en_blanco,
        score,
        timeTaken,
        respuestas: questions.map(q => ({
          question_id: q.id,
          respuesta_usuario: answers[q.id] || null,
          respuesta_correcta: q.right_answer,
          es_respondida: !!answers[q.id],
          es_correcta: parseInt(answers[q.id]) === q.right_answer
        }))
      });

      const resultadoId = res.data.resultado_id;
      setSubmitted(true);

      const resultadoRes = await API.get(`/tests/resultado/${resultadoId}`);
      setResultado(resultadoRes.data.resultado);
      setRespuestasUsuario(resultadoRes.data.respuestas);
      setErrors([]);
    } catch (err) {
      console.error('Error al guardar resultados:', err);
      setErrors(parseApiError(err));
    }
  };

  return (
    <div className="container-fluid p-0 min-vh-100 d-flex">
      <div className="col-md-2 col-lg-2 p-0 bg-dark">
        <Sidebar />
      </div>

      <div className="col p-3">
        <div className="container-fluid p-4">
          <h1 className="mb-4">Test</h1>

          {/* ⚠️ Errores */}
          {errors.length > 0 && (
            <div className="alert alert-danger">
              <ul className="mb-0">
                {errors.map((err, index) => (
                  <li key={index}>{err.msg}</li>
                ))}
              </ul>
            </div>
          )}

          {/* ❓ Preguntas */}
          {!submitted && questions.length > 0 && (
            <>
              {questions.map((q, index) => (
                <div className="card mb-4" key={q.id}>
                  <div className="card-body">
                    <h5 className="card-title">Pregunta {index + 1} de {questions.length}</h5>
                    <p className="card-text fw-bold fs-5 my-2">{q.question}</p>

                    {[1, 2, 3, 4].map(opt => {
                      const val = q[`option${opt}`];
                      return val && (
                        <div className="form-check mb-2" key={opt}>
                          <input
                            className="form-check-input"
                            type="radio"
                            name={`q${q.id}`}
                            id={`q${q.id}-opt${opt}`}
                            value={opt}
                            onChange={() => handleSelect(q.id, opt)}
                          />
                          <label className="form-check-label" htmlFor={`q${q.id}-opt${opt}`}>
                            {val}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              <button
                className="btn btn-primary fs-4 px-5 py-3 mb-4 d-block mx-auto"
                onClick={handleSubmit}
              >
                Enviar
              </button>
            </>
          )}

          {/* 📊 Resultado */}
          {submitted && resultado && (
            <div>
              <div className="alert alert-success text-center fs-5">
                <strong>¡Test completado exitosamente!</strong>
              </div>

              {/* Resumen */}
              <div className="card mb-4">
                <div className="card-body">
                  <h4 className="card-title">Resumen del resultado</h4>
                  <div className="row text-center mt-3">
                    <div className="col-md-3 alert alert-primary">
                      <strong>Preguntas:</strong><br />{questions.length}
                    </div>
                    <div className="col-md-3 alert alert-success">
                      <strong>Aciertos:</strong><br />{resultado.aciertos}
                    </div>
                    <div className="col-md-3 alert alert-danger">
                      <strong>Errores:</strong><br />{resultado.errores}
                    </div>
                    <div className="col-md-3 alert alert-warning">
                      <strong>En Blanco:</strong><br />{resultado.en_blanco}
                    </div>
                  </div>
                  <h5 className="mt-3">Puntuación: <span className="text-primary">{resultado.score.toFixed(2)}%</span></h5>
                  <p className="text-muted">Tiempo: {resultado.timeTaken.toFixed(2)} segundos</p>
                </div>
              </div>

              {/* Detalle de respuestas */}
              <h4 className="mb-3">Revisión de respuestas</h4>
              {respuestasUsuario.map((r, i) => (
                <div className="card mb-3" key={i}>
                  <div className="card-body">
                    <h5 className="card-title">Pregunta {i + 1}</h5>
                    <p>{r.question}</p>
                    {[1, 2, 3, 4].map(n => {
                      const val = r[`option${n}`];
                      if (!val) return null;

                      const isCorrect = n === r.respuesta_correcta;
                      const isSelected = n === r.respuesta_usuario;

                      let bgColor = '';
                      if (isCorrect) bgColor = 'bg-success text-white';
                      else if (isSelected) bgColor = 'bg-danger text-white';

                      return (
                        <div
                          key={n}
                          className={`p-2 mb-2 rounded ${bgColor}`}
                          style={{
                            border: isSelected ? '2px solid #343a40' : '1px solid #ccc'
                          }}
                        >
                          {val}
                          {isCorrect && ' ✅'}
                          {isSelected && !isCorrect && ' ❌'}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 💤 Sin preguntas */}
          {!submitted && questions.length === 0 && errors.length === 0 && (
            <p className="text-center">No hay preguntas disponibles temporalmente.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Test;
