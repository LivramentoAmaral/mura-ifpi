import React, { useState } from 'react';
import axios from 'axios';
import style from './style.module.css';

const AdminPage = ({ onSave, fetchImages, images }) => {
  const [image, setImage] = useState({ file: null, alt: '', text: '' });
  const [editingImageId, setEditingImageId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!image.file || !image.alt || !image.text) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('image', image.file);
    formData.append('alt', image.alt);
    formData.append('text', image.text);

    try {
      await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Após o upload, atualizar as imagens
      fetchImages();
      setImage({ file: null, alt: '', text: '' });
      setLoading(false);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      setError('Erro ao fazer upload. Tente novamente.');
      setLoading(false);
    }
  };

  // Função para editar a imagem
  const handleEdit = async () => {
    if (!editingImageId) return;

    setLoading(true);

    const formData = new FormData();
    if (image.file) formData.append('image', image.file);
    formData.append('alt', image.alt);
    formData.append('text', image.text);

    try {
      await axios.put(`http://localhost:5000/images/${editingImageId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      fetchImages();
      setEditingImageId(null);
      setImage({ file: null, alt: '', text: '' });
      setLoading(false);
    } catch (error) {
      console.error('Erro ao editar imagem:', error);
      setError('Erro ao editar imagem. Tente novamente.');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/images/${id}`);
      fetchImages(); 
    } catch (error) {
      console.error('Erro ao excluirr imagem:', error);
      setError('Erro ao excluir imagem. Tente novamente.');
    }
  };

  return (
    <div className={style.adminpage}>
      <h2>Administração de Imagens</h2>
      
      {error && <div className={style.error}>{error}</div>}

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage({ ...image, file: e.target.files[0] })}
        disabled={loading}
        className={style.inputFile}
        aria-label="Selecione uma imagem"
      />

      <input
        type="text"
        placeholder="Texto alternativo"
        value={image.alt}
        onChange={(e) => setImage({ ...image, alt: e.target.value })}
        disabled={loading}
        className={style.inputText}
        aria-label="Texto alternativo da imagem"
      />

      <input
        type="text"
        placeholder="Descrição"
        value={image.text}
        onChange={(e) => setImage({ ...image, text: e.target.value })}
        disabled={loading}
        className={style.inputText}
        aria-label="Descrição da imagem"
      />

      {editingImageId ? (
        <button className={style.btnForm} onClick={handleEdit} disabled={loading}>
          {loading ? 'Carregando...' : 'Salvar Alterações'}
        </button>
      ) : (
        <button className={style.btnForm} onClick={handleUpload} disabled={loading}>
          {loading ? 'Carregando...' : 'Enviar Imagem'}
        </button>
      )}

      <div className={style.imagelist}>
        {images.map((img) => (
          <div key={img.id} className={style.imageitem}>
            <img className={style.image} src={`http://localhost:5000${img.src}`} alt={img.alt} width={100} />
            <p>{img.text}</p>

            <div className={style.buttonContainer}>
              <button
                onClick={() => {
                  setEditingImageId(img.id);
                  setImage({ file: null, alt: img.alt, text: img.text });
                }}
                className={style.btnForm}
              >
                Editar
              </button>

              <button onClick={() => handleDelete(img.id)} className={style.btnForm}>
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
