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

  const enterFullScreen = () => {
    if (carouselRef.current) {
      const requestFullscreen =
        carouselRef.current.requestFullscreen ||
        carouselRef.current.mozRequestFullScreen ||
        carouselRef.current.webkitRequestFullscreen ||
        carouselRef.current.msRequestFullscreen;

      if (requestFullscreen) {
        requestFullscreen.call(carouselRef.current).catch((err) => {
          console.error('Error attempting to enable full-screen mode:', err.message);
        }, []);
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const exitFullScreen = useCallback(() => {
    if (isFullScreenActive()) {
      const exitFullscreen =
        document.exitFullscreen ||
        document.mozCancelFullScreen ||
        document.webkitExitFullscreen ||
        document.msExitFullscreen;

      if (exitFullscreen) {
        exitFullscreen.call(document).catch((err) => {
          console.error('Error attempting to exit full-screen mode:', err.message);
        });
      }
    }
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  useEffect(() => {
    enterFullScreen();
    const interval = setInterval(nextImage, 5000);
    const messageTimeout = setTimeout(() => setShowMessage(true), 0);
    const hideMessageTimeout = setTimeout(() => setShowMessage(false), 120000);

    return () => {
      clearInterval(interval);
      clearTimeout(messageTimeout);
      clearTimeout(hideMessageTimeout);
    };
  }, [images.length, nextImage]);

  const handleCloseClick = () => {
    exitFullScreen();
    navigate('/');
  };

  const handleKeyPress = useCallback((event) => {
    if (event.key === 'x' || event.key === 'X') {
      exitFullScreen();
      navigate('/');
    }
  }, [exitFullScreen, navigate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

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
        onClick={handleCloseClick}
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
