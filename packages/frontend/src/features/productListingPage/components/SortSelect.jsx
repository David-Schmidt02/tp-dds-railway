import React from 'react';
import './SortSelect.css';

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
        <option value="">Sin ordenar</option>
        <option value="precioAsc">Precio Mas Bajo</option>
        <option value="precioDesc">Precio Mas Alto</option>
      </select>
    </div>
  );
};

export default SortSelect;