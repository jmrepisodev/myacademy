import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // <- Incluye Popper.js y el JS necesario
import './styles/styles.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoleProtectedRoute from './components/RoleProtectedRoute';

//Importación de las rutas de la web
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

import Temas from './pages/Temas';
import TestsList from './pages/TestsList';
import Test from './pages/Test';
import Videoclase from './pages/Videoclase';

import NotFound from './pages/NotFound';

import UserProfile from './pages/DashboardUser';
import AdminDashboard from './pages/DashboardAdmin';

import Unauthorized from './pages/Unauthorized';

import VideoclasesAdmin from './pages/VideoclasesAdmin';
import UsuariosAdmin from './pages/UsuariosAdmin';
import CursosAdmin from './pages/CursosAdmin';
import TemasAdmin from './pages/TemasAdmin';
import TestsAdmin from './pages/TestAdmin';
import PreguntasAdmin from './pages/PreguntasAdmin';
import EstadisticasAdmin from './pages/EstadisticasAdmin';
import BlogAdmin from './pages/BlogAdmin';
import ForosAdmin from './pages/ForosAdmin';
import NotificacionesAdmin from './pages/NotificationsAdmin';

import Navbar from './components/Navbar';

import ForgotPassword from './pages/ForgotPassword';

import ForoList from './components/ForoList';
import HiloList from './components/HiloList';
import MensajeList from './components/MensajeList';


function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
         {/* Rutas públicas */}
        <Route path="/" element={<Home />} />

        <Route path="/cursos" element={<Courses />} />
        <Route path="/curso/:id" element={<CourseDetail />} />

        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />

        <Route path="/nosotros" element={<About />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        {/* Protegidas por rol: ADMIN */}
        <Route element={<RoleProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/videoclases" element={<VideoclasesAdmin />} />
          <Route path="/admin/usuarios" element={<UsuariosAdmin />} />
          <Route path="/admin/cursos" element={<CursosAdmin />} />
          <Route path="/admin/temas" element={<TemasAdmin />} />
          <Route path="/admin/tests" element={<TestsAdmin />} />
          <Route path="/admin/preguntas" element={<PreguntasAdmin />} />
          <Route path="/admin/estadisticas" element={<EstadisticasAdmin />} />
          <Route path="/admin/noticias" element={<BlogAdmin />} />
          <Route path="/admin/foros" element={<ForosAdmin />} />
          <Route path="/admin/notificaciones" element={<NotificacionesAdmin />} />
        </Route>
        
        {/* Protegidas por rol: USER */}
        <Route element={<RoleProtectedRoute allowedRoles={['user']} />}>
          <Route path="/usuario/perfil" element={<UserProfile />} />

          <Route path="/cursos/:cursoId/temas" element={<Temas />} />
          {/* Agregar rutas para PDF, Videoclases y Test */}
          <Route path="/temas/:temaId/tests" element={<TestsList />} />
          <Route path="/tests/:testId/questions" element={<Test />} />
          <Route path="/temas/:temaId/videoclase" element={<Videoclase />} />
        </Route>

        {/* Foro de discusión */}
        <Route path="/foros" element={<ForoList />} />
        <Route path="/foro/:slug" element={<HiloList />} />
        <Route path="/foro/:slug/hilo/:hiloId" element={<MensajeList />} />

        {/* Ruta para recuperar contraseña */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Página para acceso denegado */}
        <Route path="/unauthorized" element={<Unauthorized />} />

         {/* Página para ruta no encontrada - SIEMPRE AL FINAL */}
         <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}

export default App;
