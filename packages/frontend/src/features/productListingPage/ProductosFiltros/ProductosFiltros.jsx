import React, { useState, useEffect } from 'react';
import { FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import './ProductosFiltros.css';
import { getVendedores, getCategorias } from '../../../services/api.js';

function ProductosFiltros({ filtros, handleFiltroChange, aplicarFiltros, limpiarFiltros }) {
    const [categorias, setCategorias] = useState([]);
    const [vendedores, setVendedores] = useState([]);

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
        const categoriasActuales = filtros.categorias || [];
        const nuevasCategorias = categoriasActuales.includes(categoria)
            ? categoriasActuales.filter(cat => cat !== categoria)
            : [...categoriasActuales, categoria];

        handleFiltroChange('categorias', nuevasCategorias);
    };

    const handleVendedorChange = (vendedorId) => {
        const vendedoresActuales = filtros.vendedores || [];
        const nuevosVendedores = vendedoresActuales.includes(vendedorId)
            ? vendedoresActuales.filter(ven => ven !== vendedorId)
            : [...vendedoresActuales, vendedorId];

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
                            label={cat.toUpperCase()}
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
                            key={ven.id}
                            control={
                                <Checkbox
                                    checked={filtros.vendedores?.includes(ven.id) || false}
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