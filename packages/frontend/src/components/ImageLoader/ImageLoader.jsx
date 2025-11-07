import React, { useState, useEffect } from 'react';
import './ImageLoader.css';

const ImageLoader = ({ src, alt, className = '' }) => {
  const [imageState, setImageState] = useState('loading'); // 'loading', 'loaded', 'error'
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    if (!src) {
      setImageState('error');
      return;
    }

    setImageState('loading');

    // Hacer GET request a la imagen
    const loadImage = async () => {
      try {
        console.log(`Haciendo GET request a: ${src}`);
        
        const response = await fetch(src, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        
        console.log(`Imagen cargada exitosamente: ${src}`);
        setImageSrc(blobUrl);
        setImageState('loaded');
        
      } catch (error) {
        console.error(`Error cargando imagen ${src}:`, error);
        setImageState('error');
      }
    };

    loadImage();

    // Cleanup: liberar blob URL si fue creada por este componente
    return () => {
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [src]);

  // Renderizar según el estado
  if (imageState === 'loading') {
    return (
      <div className={`image-loader-loading ${className}`}>
        <div className="image-loader-spinner"></div>
        <span className="image-loader-text">Cargando...</span>
      </div>
    );
  }

  if (imageState === 'error') {
    return (
      <div className={`image-loader-error ${className}`}>
        <span className="image-loader-icon">📷</span>
        <span className="image-loader-text">Error al cargar</span>
      </div>
    );
  }

  return (
    <img 
      src={imageSrc} 
      alt={alt} 
      className={`image-loader-img ${className}`}
    />
  );
};

export default ImageLoader;