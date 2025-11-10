import React from 'react';
import { FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import './ProductosFiltros.css';


const categorias = [
    'Buzo',
    'Remera',
    'Pantalones',
    'Shorts',
    'Calzado',
];

const precios = [
    { label: 'Menos de $1000', value: 'menos-1000' },
    { label: '$1000 - $5000', value: '1000-5000' },
    { label: 'Más de $5000', value: 'mas-5000' },
];

function ProductosFiltros({ filtros, handleFiltroChange }) {
    
    const handleCategoriaChange = (categoria) => {
        const categoriasActuales = filtros.categorias || [];
        const nuevasCategorias = categoriasActuales.includes(categoria)
            ? categoriasActuales.filter(cat => cat !== categoria)
            : [...categoriasActuales, categoria];
        
        handleFiltroChange('categorias', nuevasCategorias);
    };


    const handlePrecioChange = (tipo, valor) => {
    const valorNumerico = valor ? parseFloat(valor) : '';
    handleFiltroChange(tipo, valorNumerico);
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
                    value={filtros.precioMin || ''}
                    onChange={(e) => handlePrecioChange('precioMin', e.target.value)}
                    />
                    <input
                    type="number"
                    min="0"
                    placeholder="Máximo"
                    value={filtros.precioMax || ''}
                    onChange={(e) => handlePrecioChange('precioMax', e.target.value)}
                    />
                </div>
            </div>
            
            <div className="filtros-seccion">
                <label className="filtros-label">Categorías:</label>
                <FormGroup>
                    {categorias.map((cat) => (
                        <FormControlLabel
                            key={cat}
                            control={
                                <Checkbox
                                    checked={filtros.categorias?.includes(cat) || false}
                                    onChange={() => handleCategoriaChange(cat)}
                                    sx={{
                                        color: '#030303',
                                        '&.Mui-checked': {
                                            color: '#007bff',
                                        },
                                    }}
                                />
                            }
                            label={cat}
                            className="filtros-checkbox-label"
                        />
                    ))}
                </FormGroup>
            </div>
        </div>
    );
}

export default ProductosFiltros