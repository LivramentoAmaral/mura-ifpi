import React, { useState, useEffect, useRef } from 'react';
import style from './style.module.css';
import { useNavigate } from 'react-router-dom';  // useNavigate para navegação

const FullScreenCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  // Função para entrar em modo tela cheia
  const enterFullScreen = () => {
    if (carouselRef.current.requestFullscreen) {
      carouselRef.current.requestFullscreen().catch(err => {
        console.error("Error attempting to enable full-screen mode:", err.message);
      });
    } else if (carouselRef.current.mozRequestFullScreen) {
      carouselRef.current.mozRequestFullScreen(); // Firefox
    } else if (carouselRef.current.webkitRequestFullscreen) {
      carouselRef.current.webkitRequestFullscreen(); // Chrome, Safari
    } else if (carouselRef.current.msRequestFullscreen) {
      carouselRef.current.msRequestFullscreen(); // IE/Edge
    }
  };

  // Função para sair do modo de tela cheia
  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen(); // Firefox
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen(); // Chrome, Safari
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen(); // IE/Edge
    }
  };

  // Configurar um intervalo para passar as imagens automaticamente
  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  useEffect(() => {
    enterFullScreen(); // Entrar em tela cheia assim que o componente for carregado
    const interval = setInterval(nextImage, 5000);
    const messageTimeout = setTimeout(() => {
      setShowMessage(true);
    }, 3000); // Mostrar a mensagem após 3 segundos

    // Timeout para ocultar a mensagem após 2 minutos
    const hideMessageTimeout = setTimeout(() => {
      setShowMessage(false);
    }, 120000); // 2 minutos

    return () => {
      clearInterval(interval);
      clearTimeout(messageTimeout);
      clearTimeout(hideMessageTimeout);
    };
  }, [images.length]);

  // Função para redirecionar para a página de admin
  const handleCloseClick = () => {
    exitFullScreen();
    navigate('/');
  };

  // Função para lidar com a tecla 'X'
  const handleKeyPress = (event) => {
    if (event.key === 'x' || event.key === 'X') {
      exitFullScreen();
      navigate('/');
    }
  };

  // Adicionar o evento de tecla para o 'X' ao montar o componente
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div ref={carouselRef} className={`${style.fullscreencarousel}`}>
      {images.length > 0 && (
        <div className={style.imagecontainer}>
          <img
            src={`http://localhost:5000${images[currentIndex].src}`}
            alt={images[currentIndex].alt}
            className={style.carouselimage}
          />
          {images[currentIndex].text && (
            <div className={style.carouseltext}>{images[currentIndex].text}</div>
          )}
        </div>
      )}
      <button
        className={style.closeButton}
        onClick={handleCloseClick}
        style={{ position: 'absolute', top: '10px', right: '20px' }}
      >
        X
      </button>
      {showMessage && (
        <div className={style.exitMessage} style={{ position: 'absolute', top: '10px', right: '60px', color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: '10px', borderRadius: '5px' }}>
          Para sair, aperte no ➡️
        </div>
      )}
    </div>
  );
};

export default FullScreenCarousel;