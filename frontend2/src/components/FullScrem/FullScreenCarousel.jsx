import React, { useState, useEffect, useRef } from 'react';
import style from './style.module.css';
import FullscreenIcon from '@mui/icons-material/Fullscreen'; 
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Link } from 'react-router-dom';  // Importa o ícone FullscreenExit

const FullScreenCarousel = ({ images }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0); // Estado para controlar o índice da imagem atual
  const carouselRef = useRef(null); // Ref para acessar o contêiner do carrossel
  const fullscreenButtonRef = useRef(null); // Ref para o botão de tela cheia

  // Função para alternar entre o modo tela cheia
  const toggleFullScreen = () => {
    if (!isFullScreen) {
      if (carouselRef.current.requestFullscreen) {
        carouselRef.current.requestFullscreen();
      } else if (carouselRef.current.mozRequestFullScreen) { // Firefox
        carouselRef.current.mozRequestFullScreen();
      } else if (carouselRef.current.webkitRequestFullscreen) { // Chrome, Safari
        carouselRef.current.webkitRequestFullscreen();
      } else if (carouselRef.current.msRequestFullscreen) { // IE/Edge
        carouselRef.current.msRequestFullscreen();
      }
    } else {
      document.exitFullscreen(); // Sair do modo tela cheia
    }
    setIsFullScreen(!isFullScreen); // Alterna o estado do botão
  };

  // Função para passar para a próxima imagem
  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // Vai para a próxima imagem, reinicia quando atingir o fim
  };

  // Configurar um intervalo para passar as imagens automaticamente
  useEffect(() => {
    const interval = setInterval(nextImage, 5000); // Passa a imagem a cada 5 segundos
    return () => clearInterval(interval); // Limpa o intervalo quando o componente for desmontado
  }, [images.length]);

  // Função para lidar com a tecla 'Esc' para alternar o estado de tela cheia
  const handleKeyPress = (event) => {
    if (event.key === 'Escape') {
      if (isFullScreen) {
        document.exitFullscreen(); // Sair do modo tela cheia
        setIsFullScreen(false); // Atualiza o estado para refletir que o modo não está mais ativo
      }
    }
  };

  // Adicionar o evento de tecla para o 'Esc' ao montar o componente
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isFullScreen]);

  return (
    <div
      ref={carouselRef}
      className={`${style.fullscreencarousel} ${isFullScreen ? `${style.fullscreen}` : ''}`}
    >
      {images.length > 0 && (
        <div className={style.imagecontainer}>
          <img
            src={`http://localhost:5000${images[currentIndex].src}`}
            alt={images[currentIndex].alt}
            className={style.carouselimage}
          />
          {images[currentIndex].text && <div className={style.carouseltext}>{images[currentIndex].text}</div>}
        </div>
      )}
      <button
        ref={fullscreenButtonRef}
        className={style.fullscreenbutton}
        onClick={toggleFullScreen}
      >
        {/* Exibe o ícone correspondente */}
        {isFullScreen ? <FullscreenExitIcon sx={{
          fontSize: 54,
          color: 'white'
        }} /> : <FullscreenIcon sx={{
          fontSize: 54,
          color: 'white'
        }} />}
      </button>
      <Link to="/">retornar a página inicial</Link>
    </div>
  );
};

export default FullScreenCarousel;
