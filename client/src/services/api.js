import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

const API = axios.create({
  baseURL: `${apiUrl}/api`,
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