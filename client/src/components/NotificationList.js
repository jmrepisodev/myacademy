import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { FaCheck, FaTrash } from 'react-icons/fa';

const NotificationList = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await API.get(`/notificaciones/${userId}`);
        setNotifications(response.data);
      } catch (error) {
         setError('Error al cargar las notificaciones.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  const markAsRead = async (notificationId) => {
    try {
      await API.put(`/notificaciones/${notificationId}/leer`);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, leido: true } : n
        )
      );
    } catch {
      setError('Error al marcar como leída.');
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await API.delete(`/notificaciones/${notificationId}`);
      setNotifications((prev) =>
        prev.filter((n) => n.id !== notificationId)
      );
    } catch {
      setError('Error al eliminar la notificación.');
    }
  };

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-secondary text-white">
        🔔 Notificaciones del sistema
      </div>
      <div className="card-body p-3">

        {loading && (
          <div className="alert alert-info text-center">Cargando notificaciones...</div>
        )}

        {error && (
          <div className="alert alert-danger text-center">{error}</div>
        )}

        {!loading && notifications.length === 0 && (
          <div className="alert alert-warning text-center mb-0">No tienes notificaciones nuevas.</div>
        )}

        {notifications.length > 0 && (
          <ul className="list-group list-group-flush">
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`list-group-item d-flex justify-content-between align-items-start ${n.leido ? 'bg-light' : 'bg-warning bg-opacity-25'}`}
              >
                <div className="me-3">
                  <p className="mb-1">{n.mensaje}</p>
                  <small className="text-muted">
                    {new Date(n.created_at).toLocaleString()}
                  </small>
                </div>
                <div className="d-flex flex-column align-items-end">
                  {!n.leido && (
                    <button
                      className="btn btn-sm btn-outline-primary mb-1"
                      onClick={() => markAsRead(n.id)}
                    >
                      <FaCheck className="m-1" />
                      Marcar como leída
                    </button>
                  )}
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => deleteNotification(n.id)}
                  >
                    <FaTrash className="m-1" />
                    
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

      </div>
    </div>
  );
};

export default NotificationList;
