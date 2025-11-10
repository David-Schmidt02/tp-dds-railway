import React from 'react';

const SortSelect = ({ value, onChange }) => {
  const handleFiltroChange = (tipo, valor) => {
    onChange(tipo, valor);
  };

  return (
    <div className="sort-section">
      <label htmlFor="sort-select">Ordenar por</label>
      <select 
        id="sort-select" 
        className="custom-select"
        value={value}
        onChange={(e) => handleFiltroChange('ordenar', e.target.value)}
      >
        <option value="precio-asc">Precio Mas Bajo</option>
        <option value="precio-desc">Precio Mas Alto</option>
        <option value="vendidos-asc">Más Vendidos</option>
        <option value="ultimo-desc">Más Recientes</option>
      </select>
    </div>
  );
};

export default SortSelect;