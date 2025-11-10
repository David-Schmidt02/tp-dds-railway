import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import './ProductListingPage.css';
import Grid from '../../components/grid/grid.jsx';
import { getProductos } from '../../services/productoService.js';
import SortSelect from './components/SortSelect.jsx';
import ProductosFiltros from './ProductosFiltros/ProductosFiltros.jsx';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';


const ProductListingPage = ({ actualizarCarrito }) => {
  const location = useLocation();
  const [productos, setProductos] = useState();
  const [filtros, setFiltros] = useState({

    nombre: '',
    descripcion: '',
    precioMin: '',
    precioMax: '',
    categorias: [],
    vendedor: '',
    page: 1,
    limit: 10,
    ordenar: ''
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
      ordenar: ''
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
                <ProductosFiltros filtros={filtros} handleFiltroChange={handleFiltroChange} />
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
        <Stack spacing={2} alignItems="center" sx={{ marginTop: 3 }}>
            <Pagination 
                count={10} 
                page={filtros.page}
                onChange={(event, value) => handleFiltroChange('page', value)}
                color="primary" 
            />
        </Stack>
    </div>
  )
};

export default ProductListingPage;
