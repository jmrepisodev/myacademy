// src/utils/auth.js
import { jwtDecode } from 'jwt-decode';

export const getUserRole = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
        return decoded.rol || null;
  } catch (err) {
        console.error('Token inválido o corrupto', err);
        return null;
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        return decoded.exp > now;
  } catch (err) {
        return false;
  }
};
