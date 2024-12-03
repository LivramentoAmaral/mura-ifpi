import React, { useState, useEffect } from 'react';
import './App.css';
import AdminPage from './components/admin/AdminPage';
import axios from 'axios';
import FullScreenCarousel from './components/FullScrem/FullScreenCarousel';

function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar imagens do backend
  const fetchImages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/images');
      setImages(response.data); // Atualiza o estado com as imagens
      setLoading(false); // Desativa o estado de carregamento
    } catch (error) {
      console.error("Erro ao buscar imagens do backend:", error);
      setLoading(false); // Desativa o estado de carregamento em caso de erro
    }
  };

  // Efeito para carregar as imagens do servidor
  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="App">
      {loading ? (
        <p>Carregando imagens...</p> // Feedback enquanto as imagens estão carregando
      ) : (
        <>
          <FullScreenCarousel images={images} />
          <AdminPage onSave={setImages} fetchImages={fetchImages} images={images} />
        </>
      )}
    </div>
  );
}

export default App;
