import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';
import API from '../services/api';
import Sidebar from '../components/SidebarAdmin';

const apiUrl = process.env.REACT_APP_API_URL;

function NoticiasAdmin() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState({
    titulo: '',
    contenido: '',
    image: '',
    autor: '',
    publicado: true
  });
  const [deletePostId, setDeletePostId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState('');
 

  const fetchPosts = async () => {
    try {
      const res = await API.get('/blog');
      setPosts(res.data);
      setFilteredPosts(res.data);

      setErrors([]);
    } catch (err) {
        console.error('Error al obtener posts', err);
        setErrors([{ msg: 'Error al obtener la lista de posts.' }]);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    setFilteredPosts(
      posts.filter(p =>
        p.titulo.toLowerCase().includes(q) || p.id.toString().includes(q)
      )
    );
  }, [searchQuery, posts]);

  const handleSave = async () => {
    try {
      if (!currentPost.titulo || !currentPost.contenido) {
        alert('Título y contenido son obligatorios.');
        return;
      }

      if (isEditing) {
        await API.put(`/blog/update/${currentPost.id}`, currentPost);
      } else {
        await API.post('/blog/store', currentPost);
      }

      setShowModal(false);
      fetchPosts();

      setSuccess('Post guardadado con éxito')
     
    } catch (err) {
        console.error('Error al guardar el post', err);
        setSuccess('');
        if (err.response) {
          const data = err.response.data;
          if (data.errors) {
            setErrors(data.errors.map((err) => ({ msg: err.msg })));
          } else if (data.error) {
            setErrors([{ msg: data.error }]);
          } else {
            setErrors([{ msg: 'Error desconocido del servidor.' }]);
          }
        } else {
          setErrors([{ msg: 'No se pudo conectar con el servidor.' }]);
        }
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/blog/delete/${deletePostId}`);
      setShowDeleteConfirm(false);
      fetchPosts();

      setSuccess('Post eliminado satisfactoriamente')
     
    } catch (err) {
        console.error('Error al eliminar el post', err);
        setSuccess('');
        if (err.response) {
          const data = err.response.data;
          if (data.errors) {
            setErrors(data.errors.map((err) => ({ msg: err.msg })));
          } else if (data.error) {
            setErrors([{ msg: data.error }]);
          } else {
            setErrors([{ msg: 'Error desconocido del servidor.' }]);
          }
        } else {
          setErrors([{ msg: 'No se pudo conectar con el servidor.' }]);
        }
    }
  };

  return (
    <div className="container-fluid p-0 min-vh-100 d-flex">
      <div className="col-md-2 col-lg-2 p-0 bg-dark">
        <Sidebar />
      </div>

      <div className="col p-4">
        <h2 className="mb-4">Gestión de Noticias</h2>

        <div className="d-flex justify-content-between mb-3">
          <Button onClick={() => {
            setIsEditing(false);
            setCurrentPost({
              titulo: '', contenido: '', image: '', autor: '', publicado: true
            });
            setShowModal(true);
          }}>
            Nueva Noticia
          </Button>

          <InputGroup style={{ width: '300px' }}>
            <FormControl
              placeholder="Buscar por título o ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </div>

        
        {success && <div className="alert alert-success">{success}</div>}
        {errors.length > 0 && (
          <div className="alert alert-danger">
            <ul className="mb-0">
              {errors.map((err, index) => (
                <li key={index}>{err.msg}</li>
              ))}
            </ul>
          </div>
        )}

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Autor</th>
              <th>Contenido</th>
              <th>Imagen</th>
              <th>Publicado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map(post => (
              <tr key={post.id}>
                <td>{post.id}</td>
                <td>{post.titulo}</td>
                <td>{post.autor ? post.autor : 'Anónimo'}</td>
                <td>{post.contenido}</td>
                <td>{post.image && <img 
                      src={`${apiUrl}/uploads/${post.image}`} 
                      className='img-thumbnail mx-auto d-block'
                      alt={post.name} 
                      width="50px"
                      onError={(e) => {
                      e.target.onerror = null; // evita bucle si la imagen por defecto también falla
                      e.target.src = "/image_not_found.png"; // ruta de imagen por defecto (public/)
                      }}
                  />}</td>
                <td>{post.publicado ? 'Sí' : 'No'}</td>
                <td>{new Date(post.created_at).toLocaleDateString()}</td>
                <td>
                  <Button variant="warning" size="sm" className="me-2"
                    onClick={() => {
                      setIsEditing(true);
                      setCurrentPost(post);
                      setShowModal(true);
                    }}>
                    Editar
                  </Button>
                  <Button variant="danger" size="sm"
                    onClick={() => {
                      setDeletePostId(post.id);
                      setShowDeleteConfirm(true);
                    }}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Modal para agregar/editar post */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{isEditing ? 'Editar Noticia' : 'Nueva Noticia'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Título</Form.Label>
                <Form.Control
                  type="text"
                  value={currentPost.titulo}
                  onChange={(e) => setCurrentPost({ ...currentPost, titulo: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Contenido</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={currentPost.contenido}
                  onChange={(e) => setCurrentPost({ ...currentPost, contenido: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Imagen (URL)</Form.Label>
                <Form.Control
                  type="text"
                  value={currentPost.image}
                  onChange={(e) => setCurrentPost({ ...currentPost, image: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Autor</Form.Label>
                <Form.Control
                  type="text"
                  value={currentPost.autor}
                  onChange={(e) => setCurrentPost({ ...currentPost, autor: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Publicado"
                  checked={currentPost.publicado}
                  onChange={(e) => setCurrentPost({ ...currentPost, publicado: e.target.checked })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleSave}>
              {isEditing ? 'Actualizar' : 'Guardar'}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Confirmación de eliminación */}
        <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Eliminar Noticia</Modal.Title>
          </Modal.Header>
          <Modal.Body>¿Estás seguro de que deseas eliminar esta noticia?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Cancelar</Button>
            <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default NoticiasAdmin;
