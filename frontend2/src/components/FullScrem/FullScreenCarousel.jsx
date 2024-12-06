import React, { useState, useEffect, useRef, useCallback } from 'react';
import style from './style.module.css';
import { useNavigate } from 'react-router-dom';

const FullScreenCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
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
          await exitFullscreen.call(document); // Espera sair da tela cheia
        } catch (error) {
          console.error('Erro ao sair do modo tela cheia:', error.message);
        }
      }
    }
    navigate('/'); // Navega para "/" imediatamente após sair do modo tela cheia
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
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    enterFullScreen();
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    const messageTimeout = setTimeout(() => setShowMessage(true), 0);
    const hideMessageTimeout = setTimeout(() => setShowMessage(false), 120000);

    return () => {
      clearInterval(interval);
      clearTimeout(messageTimeout);
      clearTimeout(hideMessageTimeout);
    };
  }, [images.length, enterFullScreen]);

  return (
    <div ref={carouselRef} className={style.fullscreencarousel}>
      {images.length > 0 && (
        <div className={style.imagecontainer}>
          <img
            src={`http://localhost:5000${images[currentIndex].src}`}
            alt={images[currentIndex].alt}
            className={style.carouselimage}
          />
        </div>
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

      <div>
      <button
        className={style.sd}
        onClick={exitFullScreenAndNavigate}
        style={{ position: 'absolute', button:'40px', color:'red' }}
      >
        voltar
      </button>
      </div>
    </div>
    
  );
};

export default FullScreenCarousel;
