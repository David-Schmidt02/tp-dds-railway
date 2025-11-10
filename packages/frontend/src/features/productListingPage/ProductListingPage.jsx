import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import './ProductListingPage.css';
import Grid from '../../components/grid/grid.jsx';
import { getProductos } from '../../services/productoService.js';
import SortSelect from './SortSelect';

const ProductListingPage = ({ actualizarCarrito }) => {
  const location = useLocation();
  const [productos, setProductos] = useState();
  const [filtros, setFiltros] = useState({
    busqueda: '',
    precioMin: '',
    precioMax: '',
    categorias: [],
    ordenar: 'ultimo-desc'
  });

    const cargarProductos = async ({ filtros }) => {
        const productosCargados = await getProductos(filtros);
        console.log("Respuesta del backend:", productosCargados);
        setProductos(productosCargados)
    }
  
    // Para que cuando se monte el componente los cargue
    useEffect(() => {
        cargarProductos({ filtros });
    }, [filtros]);
    

  const limpiarFiltros = () => {
    setFiltros({
      busqueda: '',
      precioMin: '',
      precioMax: '',
      categorias: [],
      ordenar: 'ultimo-desc'
    });
  };

  const handleFiltroChange = (tipo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [tipo]: valor
    }));
  };

  return (      
    <div className="ProductListingPage">
        <div className="products-main">
            <div className="filters-sidebar">
                <h1>FILTROS</h1>
            </div>
            <div className="products-content">
                <div className="parte-arriba">
                    <h1>NUESTROS PRODUCTOS</h1>
                    <SortSelect 
                    value={filtros.ordenar}
                    onChange={handleFiltroChange}                  
                    />
                </div> 
            <Grid productos={productos} actualizarCarrito={actualizarCarrito} />
            </div>
        </div>
    </div>
  )
};

export default ProductListingPage;
