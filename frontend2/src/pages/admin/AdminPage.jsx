import React, { useState, useEffect } from 'react';
import axios from 'axios';
import style from './style.module.css'; // Use a single styles import
import { Link } from 'react-router-dom';

const AdminPage = ({ onSave }) => {
  const [image, setImage] = useState({ file: null, alt: '', text: '', date: '', preview: '' });
  const [, setEditingImageId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState([]); // Lista de imagens

  // Buscar imagens ao montar o componente
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/images');
        setImages(response.data); // Atualiza o estado com as imagens recebidas
      } catch (error) {
        console.error('Erro ao buscar imagens:', error);
        setError('Erro ao buscar imagens.');
      }
    };

    fetchImages();
  }, []); // O array vazio [] significa que isso rodará apenas uma vez, quando o componente for montado

  // Handle file input change
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage({
          ...image,
          file: selectedFile,
          preview: reader.result, // URL para visualização da imagem
        });
      };
      reader.readAsDataURL(selectedFile); // Lê o arquivo da imagem como URL para pré-visualização
    }
  };

  // Handle image upload
  const handleUpload = async () => {
    if (!image.file || !image.alt || !image.text) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('image', image.file);
    formData.append('alt', image.alt);
    formData.append('text', image.text);
    if (image.date) formData.append('date', image.date);

    try {
      await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Recarregar as imagens após o upload
      const response = await axios.get('http://localhost:5000/images');
      setImages(response.data);

      setImage({ file: null, alt: '', text: '', date: '', preview: '' }); // Resetar o formulário
      setLoading(false);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      setError('Erro ao fazer upload. Tente novamente.');
      setLoading(false);
    }
  };

  // Handle image deletion
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Tem certeza de que deseja excluir esta imagem?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/images/${id}`);
        // Recarregar as imagens após a exclusão
        const response = await axios.get('http://localhost:5000/images');
        setImages(response.data);
      } catch (error) {
        console.error('Erro ao excluir imagem:', error);
        setError('Erro ao excluir imagem. Tente novamente.');
      }
    }
  };

  return (
    <div>
      <div className={style.adminpage}>
        <h2>Administração de Imagens</h2>

        {error && <div className={style.error}>{error}</div>}

        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={loading}
            className={style.inputFile}
            aria-label="Selecione uma imagem"
          />

          {image.preview && (
            <div className={style.imagePreview}>
              <img src={image.preview} alt="Pré-visualização" className={style.previewImage} />
            </div>
          )}
        </div>

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

        <input
          type="date"
          value={image.date}
          onChange={(e) => setImage({ ...image, date: e.target.value })}
          disabled={loading}
          className={style.inputDate}
          aria-label="Data da imagem (opcional)"
        />

        <div className={style.div_botoes_enviar_home}>
          <Link to="/apresentar" className={style.btnForm_home}>
            Apresentar
          </Link>

          <button
            className={style.btnForm_enviar}
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Enviar Imagem'}
          </button>
        </div>
      </div>

      <hr />
      <div className={style.imagelist}>
        {images.length === 0 ? (
          <p>Não há imagens para exibir.</p>
        ) : (
          images.map((img) => (
            <div key={img.id} className={style.imageitem}>
              <img
                className={style.image}
                src={`http://localhost:5000${img.src}`}
                alt={img.alt}
                width={100}
              />
              <p>{img.text}</p>
              {img.date && <p><strong>Data:</strong> {img.date}</p>}

              <div className={style.buttonContainer}>
                <button onClick={() => handleDelete(img.id)} className={style.btnForm_excluir}>
                  Excluir
                </button>
                <button
                  onClick={() => {
                    setEditingImageId(img.id);
                    setImage({
                      file: null,
                      alt: img.alt,
                      text: img.text,
                      date: img.date || '',
                      preview: `http://localhost:5000${img.src}`,
                    });
                  }}
                  className={style.btnForm}
                >
                  Editar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPage;
