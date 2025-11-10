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

const vendedores = [
    'Vendedor 1',
    'Vendedor 2',
    'Vendedor 3',
    'Vendedor 4',
    'Vendedor 5',
];

const precios = [
    { label: 'Menos de $1000', value: 'menos-1000' },
    { label: '$1000 - $5000', value: '1000-5000' },
    { label: 'Más de $5000', value: 'mas-5000' },
];

function ProductosFiltros({ filtros, handleFiltroChange, aplicarFiltros, limpiarFiltros }) {
    
    const handleCategoriaChange = (categoria) => {
        const categoriasActuales = filtros.categorias || [];
        const nuevasCategorias = categoriasActuales.includes(categoria)
            ? categoriasActuales.filter(cat => cat !== categoria)
            : [...categoriasActuales, categoria];
        
        handleFiltroChange('categorias', nuevasCategorias);
    };

    const handleVendedorChange = (vendedor) => {
        const vendedoresActuales = filtros.vendedores || [];
        const nuevosVendedores = vendedoresActuales.includes(vendedor)
            ? vendedoresActuales.filter(ven => ven !== vendedor)
            : [...vendedoresActuales, vendedor];
        
        handleFiltroChange('vendedores', nuevosVendedores);
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
                                            color: '#0f345cff',
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

            <div className="filtros-seccion">
                <label className="filtros-label">Vendedores:</label>
                <FormGroup>
                    {vendedores.map((ven) => (
                        <FormControlLabel
                            key={ven}
                            control={
                                <Checkbox
                                    checked={filtros.vendedores?.includes(ven) || false}
                                    onChange={() => handleVendedorChange(ven)}
                                    sx={{
                                        color: '#030303',
                                        '&.Mui-checked': {
                                            color: '#0f345cff',
                                        },
                                    }}
                                />
                            }
                            label={ven}
                            className="filtros-checkbox-label"
                        />
                    ))}
                </FormGroup>
            </div>

            <div className="filtros-botones">
                <button className="btn btn-buscar" onClick={aplicarFiltros}>
                    Buscar
                </button>
                <button className="btn btn-limpiar" onClick={limpiarFiltros}>
                    Limpiar
                </button>
            </div>
        </div>
    );
}

export default ProductosFiltros