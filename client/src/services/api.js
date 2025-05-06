import axios from 'axios';

const API = axios.create({
  baseURL: 'https://myacademy.alwaysdata.net/api',
});

// Incluir token automáticamente en cada petición
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

export default API;