import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import API from '../services/api';
import { jwtDecode } from 'jwt-decode';

const apiUrl = process.env.REACT_APP_API_URL;
const socket = io(apiUrl, { autoConnect: false }); // Conecta al servidor Socket. Evitamos reconexiones innecesarias

function Videoclase() {
  const { temaId } = useParams();
  const [videoclase, setVideoclase] = useState(null);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchVideoclase = async () => {
      try {
        const res = await API.get(`/videoclases/tema/${temaId}`);
        setVideoclase(res.data);
        setError(null);
      } catch (err) {
        console.error('Error cargando videoclase:', err);
        setError('Error al cargar la videoclase.');
      }
    };

    fetchVideoclase();
  }, [temaId]);

  useEffect(() => {
    if (!temaId) return;

    const fetchMessages = async () => {
      try {
        const res = await API.get(`/chat/tema/${temaId}`);
        console.log(res.data)
        setMessages(res.data);
      } catch (err) {
        console.error('Error cargando mensajes:', err);
      }
    };
  
    fetchMessages();

    socket.connect(); // conectar solo cuando se monta

    socket.emit('joinRoom', temaId);

    const handleMessage = (message) => {
      console.log(message)
      setMessages(prev => [...prev, message]);
    };

    socket.on('chatMessage', handleMessage);

    return () => {
      socket.emit('leaveRoom', temaId);
      socket.off('chatMessage', handleMessage);
      socket.disconnect(); // importante para limpiar la conexión
    };
  }, [temaId]);

  const token = localStorage.getItem('token');
  const user = jwtDecode(token);
    
  const sendMessage = () => {
    if(!user || !token) return;

    if (newMessage.trim() !== '') {
      const messageData = {
        temaId,
        userId: user.id,
        user: user.nombre,
        texto: newMessage,
        timestamp: new Date()
      };
      socket.emit('chatMessage', messageData);
      setNewMessage(''); // limpiamos solo el input, NO el estado de mensajes
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!videoclase) return <div className="text-center my-5">Cargando videoclase...</div>;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-8">
          <h1 className="mb-3">{videoclase.name}</h1>
          <p className="text-muted">{videoclase.description}</p>

          <div className="card shadow-sm my-4">
            <div className="ratio ratio-16x9">
              <video controls width="100%" preload="metadata" crossOrigin="anonymous">
                <source src={`${apiUrl}/uploads/${videoclase.video_url}`} type="video/mp4" />
                Tu navegador no soporta la reproducción de video.
              </video>
            </div>
          </div>

          {videoclase.material_url && (
            <div className="alert alert-info d-flex align-items-center" role="alert">
              <div>
                <strong>Material complementario disponible: </strong>
                <a href={videoclase.material_url} target="_blank" rel="noopener noreferrer">
                  Descargar PDF
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="col-4">
          <div className="card my-5">
            <div className="card-header">Chat en vivo</div>
            <div className="card-body" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {messages.map((msg, idx) => ( 
                <div key={idx}>
                  <strong>{msg.user}</strong>: {msg.texto}
                </div>
              ))}
              <div ref={chatEndRef}></div>
            </div>
            <div className="card-footer d-flex">
              <input
                type="text"
                className="form-control me-2"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Escribe un mensaje..."
              />
              <button className="btn btn-primary" onClick={sendMessage}>Enviar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Videoclase;
