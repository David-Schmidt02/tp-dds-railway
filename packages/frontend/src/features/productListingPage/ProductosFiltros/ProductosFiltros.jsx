import React, { useState, useEffect } from 'react';
import { FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import './ProductosFiltros.css';
import { getVendedores, getCategorias } from '../../../services/api.js';
import { useSearchParams } from 'react-router-dom';

function ProductosFiltros({ filtros, handleFiltroChange, limpiarFiltros }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categorias, setCategorias] = useState([]);
  const [vendedores, setVendedores] = useState([]);

  const [precioMinTemp, setPrecioMinTemp] = useState(filtros.precioMin || '');
  const [precioMaxTemp, setPrecioMaxTemp] = useState(filtros.precioMax || '');

  const [mostrarMasCategorias, setMostrarMasCategorias] = useState(false);
  const [mostrarMasVendedores, setMostrarMasVendedores] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const categoriasData = await getCategorias();
        const vendedoresData = await getVendedores();
        setCategorias(categoriasData.sort((a, b) => a.localeCompare(b)));
        setVendedores(vendedoresData);
      } catch (error) {
        console.error('Error cargando datos de filtros:', error);
      }
    };
    cargarDatos();
  }, []);

  const handleCategoriaChange = (categoria) => {
    const nuevasCategorias = filtros.categorias.includes(categoria)
      ? filtros.categorias.filter(cat => cat !== categoria)
      : [...filtros.categorias, categoria];

    handleFiltroChange('categorias', nuevasCategorias);
  };

  const handleVendedorChange = (vendedorId) => {
    const nuevosVendedores = filtros.vendedores.includes(vendedorId)
      ? filtros.vendedores.filter(ven => ven !== vendedorId)
      : [...filtros.vendedores, vendedorId];

    handleFiltroChange('vendedores', nuevosVendedores);
  };

  const aplicarPrecio = () => {
    const newParams = new URLSearchParams(searchParams);

    if (precioMinTemp !== '') newParams.set('precioMin', Number(precioMinTemp));
    else newParams.delete('precioMin');

    if (precioMaxTemp !== '') newParams.set('precioMax', Number(precioMaxTemp));
    else newParams.delete('precioMax');

    newParams.set('page', 1);
    setSearchParams(newParams);
  };

  return (
    <div className="filtros-container">
      <h3 className="filtros-titulo">Filtrar productos</h3>

      <div className="filtros-seccion">
        <label className="filtros-label">Precio:</label>
        <div className="filtros-precio">
          <input
            type="number"
            min="0"
            placeholder="Mínimo"
            value={precioMinTemp}
            onChange={(e) => setPrecioMinTemp(e.target.value)}
          />
          <input
            type="number"
            min="0"
            placeholder="Máximo"
            value={precioMaxTemp}
            onChange={(e) => setPrecioMaxTemp(e.target.value)}
          />
        </div>
        <button className="btn btn-buscar" onClick={aplicarPrecio}>Aplicar Precio</button>
      </div>

      <div className="filtros-seccion">
        <label className="filtros-label">Categorías:</label>
        <FormGroup>
          {(mostrarMasCategorias ? categorias : categorias.slice(0, 5)).map((cat) => (
            <FormControlLabel
              key={cat}
              control={
                <Checkbox
                  checked={filtros.categorias.includes(cat)}
                  onChange={() => handleCategoriaChange(cat)}
                  sx={{
                    color: '#030303',
                    '&.Mui-checked': {
                      color: '#0f345cff',
                    },
                  }}
                />
              }
              label={cat.toUpperCase()}
              className="filtros-checkbox-label"
            />
          ))}
        </FormGroup>

        {categorias.length > 5 && (
          <button
            className="ver-mas-btn-filtro"
            onClick={() => setMostrarMasCategorias(!mostrarMasCategorias)}
          >
            {mostrarMasCategorias ? "Ver menos ▴" : "Ver más ▾"}
          </button>
        )}
      </div>

      <div className="filtros-seccion">
        <label className="filtros-label">Vendedores:</label>
        <FormGroup>
          {(mostrarMasVendedores ? vendedores : vendedores.slice(0, 5)).map((ven) => (
            <FormControlLabel
              key={ven.id}
              control={
                <Checkbox
                  checked={filtros.vendedores.includes(ven.id)}
                  onChange={() => handleVendedorChange(ven.id)}
                  sx={{
                    color: '#030303',
                    '&.Mui-checked': {
                      color: '#0f345cff',
                    },
                  }}
                />
              }
              label={ven.nombre}
              className="filtros-checkbox-label"
            />
          ))}
        </FormGroup>

        {vendedores.length > 5 && (
          <button
            className="ver-mas-btn-filtro"
            onClick={() => setMostrarMasVendedores(!mostrarMasVendedores)}
          >
            {mostrarMasVendedores ? "Ver menos ▴" : "Ver más ▾"}
          </button>
        )}
      </div>

      <div className="filtros-botones">
        <button className="btn btn-limpiar" onClick={limpiarFiltros}>
          Limpiar
        </button>
      </div>
    </div>
  );
}

export default ProductosFiltros;
