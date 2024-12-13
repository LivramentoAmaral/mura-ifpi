import React, { useState, useEffect, useRef, useCallback } from 'react';
import style from './style.module.css';
import { useNavigate } from 'react-router-dom';

const FullScreenCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filteredImages, setFilteredImages] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  const isFullScreenActive = () =>
    document.fullscreenElement ||
    document.mozFullScreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement;

  const exitFullScreenAndNavigate = useCallback(async () => {
    if (isFullScreenActive()) {
      const exitFullscreen =
        document.exitFullscreen ||
        document.mozCancelFullScreen ||
        document.webkitExitFullscreen ||
        document.msExitFullscreen;

      if (exitFullscreen) {
        try {
          await exitFullscreen.call(document);
        } catch (error) {
          console.error('Erro ao sair do modo tela cheia:', error.message);
        }
      }
    }
    navigate('/');
  }, [navigate]);

  const handleKeyPress = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        exitFullScreenAndNavigate();
      }
    },
    [exitFullScreenAndNavigate]
  );

  const enterFullScreen = useCallback(() => {
    if (carouselRef.current) {
      const requestFullscreen =
        carouselRef.current.requestFullscreen ||
        carouselRef.current.mozRequestFullScreen ||
        carouselRef.current.webkitRequestFullscreen ||
        carouselRef.current.msRequestFullscreen;

      if (requestFullscreen) {
        requestFullscreen.call(carouselRef.current).catch((err) =>
          console.error('Erro ao entrar no modo tela cheia:', err.message)
        );
      }
    }
  }, []);

  useEffect(() => {
    // Filtrar as imagens para exibir apenas as com a data igual ao dia atual
    const today = new Date().toISOString().split('T')[0];
    const imagesToday = images.filter((img) => img.date === today);
    setFilteredImages(imagesToday);

    enterFullScreen();

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imagesToday.length);
    }, 5000);

    const messageTimeout = setTimeout(() => setShowMessage(true), 0);
    const hideMessageTimeout = setTimeout(() => setShowMessage(false), 120000);

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      clearInterval(interval);
      clearTimeout(messageTimeout);
      clearTimeout(hideMessageTimeout);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [images, enterFullScreen, handleKeyPress]);

  return (
    <div ref={carouselRef} className={style.fullscreencarousel}>
      {filteredImages.length > 0 ? (
        <div className={style.imagecontainer}>
          <img
            src={`http://localhost:5000${filteredImages[currentIndex].src}`}
            alt={filteredImages[currentIndex].alt}
            className={style.carouselimage}
          />
        </div>
      ) : (
        <div className={style.noImagesMessage}>Nenhuma imagem disponível para hoje.</div>
      )}
      <button
        className={style.closeButton}
        onClick={exitFullScreenAndNavigate}
        style={{ position: 'absolute', top: '10px', right: '20px' }}
      >
        X
      </button>
      {showMessage && (
        <div
          className={style.exitMessage}
          style={{
            position: 'absolute',
            top: '10px',
            right: '60px',
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '10px',
            borderRadius: '5px',
          }}
        >
          Para sair, aperte no ➡️
        </div>
      )}
    </div>
  );
};

export default FullScreenCarousel;
