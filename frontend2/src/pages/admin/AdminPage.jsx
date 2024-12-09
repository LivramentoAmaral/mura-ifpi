import React, { useState } from 'react';
import axios from 'axios';
import style from './style.module.css'; // Use a single styles import
import { Link } from 'react-router-dom';

const AdminPage = ({ onSave, fetchImages, images }) => {
  const [image, setImage] = useState({ file: null, alt: '', text: '', preview: '' });
  const [editingImageId, setEditingImageId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Função para exibir a imagem como pré-visualização antes de enviar
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage({
          file: selectedFile,
          alt: image.alt,
          text: image.text,
          preview: reader.result, // URL da imagem para visualização
        });
      };
      reader.readAsDataURL(selectedFile); // Lê a imagem e gera a URL para visualização
    }
  };

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
      setImage({ file: null, alt: '', text: '', preview: '' }); // Resetar os campos
      setLoading(false);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      setError('Erro ao fazer upload. Tente novamente.');
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!editingImageId) return;

    // Confirmar antes de salvar as alterações
    const isConfirmed = window.confirm('Você tem certeza que deseja salvar as alterações?');
    if (!isConfirmed) return; // Se não confirmar, não prossegue

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
      setImage({ file: null, alt: '', text: '', preview: '' });
      setLoading(false);
    } catch (error) {
      console.error('Erro ao editar imagem:', error);
      setError('Erro ao editar imagem. Tente novamente.');
      setLoading(false);
    }
  };

  // Função para excluir a imagem com confirmação
  const handleDelete = async (id) => {
    // Exibe uma janela de confirmação antes de excluir
    const confirmDelete = window.confirm("Tem certeza de que deseja excluir esta imagem?");

    // Se o usuário confirmar a exclusão (clicar em 'OK' ou 'Sim')
    if (confirmDelete) {
      try {
        // Envia a requisição DELETE para o backend
        await axios.delete(`http://localhost:5000/images/${id}`);
        // Recarrega as imagens após a exclusão
        fetchImages();
      } catch (error) {
        console.error('Erro ao excluir imagem:', error);
        setError('Erro ao excluir imagem. Tente novamente.');
      }
    } else {
      // Caso o usuário cancele, nada acontece
      console.log("Exclusão cancelada");
    }
  };

  const handleClick = (event) => {
    if (loading) {
      event.preventDefault(); // Impede o redirecionamento se estiver carregando
    } else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false); // Simula o término de uma ação antes de redirecionar
      }, 1000); // Ajuste o tempo conforme necessário
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
            onChange={handleImageChange} // Função para mostrar pré-visualização
            disabled={loading}
            className={style.inputFile}
            aria-label="Selecione uma imagem"
          />

          {/* Exibir a imagem após o usuário selecionar */}
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

        <div className={style.div_botoes_enviar_home}>
          <Link to="/apresentar" onClick={handleClick}>
            <button disabled={loading} className={style.btnForm_home}>
              {loading ? 'Carregando...' : 'Apresentar'}
            </button>
          </Link>

          {editingImageId ? (
            <button className={style.btnForm_enviar} onClick={handleEdit} disabled={loading}>
              {loading ? 'Carregando...' : 'Salvar Alterações'}
            </button>
          ) : (
            <button className={style.btnForm_enviar} onClick={handleUpload} disabled={loading}>
              {loading ? 'Carregando...' : 'Enviar Imagem'}
            </button>
          )}
        </div>
      </div>

      <hr />
      <div className={style.imagelist}>
        {images.map((img) => (
          <div key={img.id} className={style.imageitem}>
            <img className={style.image} src={`http://localhost:5000${img.src}`} alt={img.alt} width={100} />
            <p>{img.text}</p>

            <div className={style.buttonContainer}>
              <button onClick={() => handleDelete(img.id)} className={style.btnForm_excluir}>
                Excluir
              </button>
              <button
                onClick={() => {
                  setEditingImageId(img.id);
                  setImage({ file: null, alt: img.alt, text: img.text, preview: `http://localhost:5000${img.src}` });
                }}
                className={style.btnForm}
              >
                Editar
              </button>


            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
