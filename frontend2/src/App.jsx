/* eslint-disable react/jsx-pascal-case */
import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminPage from './pages/admin/AdminPage';
import FullScreenCarousel from './pages/FullScrem/FullScreenCarousel'; // Importando o componente FullScreenCarousel
import axios from 'axios';
import Navbar_tudo from './components/navbar/navbar';
import Agendar from './pages/agendas/agenda'; 

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
    <BrowserRouter>
      <div className="App">
        {loading ? (
          <p>Carregando imagens...</p> // Feedback enquanto as imagens estão carregando
        ) : (
          <Routes>
            {/* Define as rotas para AdminPage e FullScreenCarousel */}
            <Route
              path="/"
              element={
                <>
                  <Navbar_tudo />
                  <AdminPage onSave={setImages} fetchImages={fetchImages} images={images} />
                </>
              }
            />
            <Route path="/apresentar" element={<FullScreenCarousel images={images} />} />
            
            <Route path="/agendar" element={<><Navbar_tudo /><Agendar /></>} />

   


   
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
