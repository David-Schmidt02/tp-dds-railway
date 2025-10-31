import React from 'react';

const Carousel = ({ categories }) => {
  return (
    <div style={{ display: 'flex', overflowX: 'auto', gap: '1rem', padding: '1rem 0' }}>
      {categories.map((cat, idx) => (
        <div key={idx} style={{ minWidth: 150, textAlign: 'center' }}>
          <img src={cat.imagen} alt={cat.nombre} style={{ width: '100%', borderRadius: '8px' }} />
          <div style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>{cat.nombre}</div>
        </div>
      ))}
    </div>
  );
};

export default Carousel;
