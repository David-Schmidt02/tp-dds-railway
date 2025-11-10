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
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    nombre: '',
    descripcion: '',
    precioMin: '',
    precioMax: '',
    categorias: [],
    vendedores: [],
    vendedor: '',
    page: 1,
    limit: 10,
    ordenar: ''
  });
  const [filtrosTemp, setFiltrosTemp] = useState({ ...filtrosAplicados });

    const cargarProductos = async ({ filtros }) => {
        const productosCargados = await getProductos(filtros);
        console.log("Respuesta del backend:", productosCargados);
        setProductos(productosCargados)
    }
  
    // Solo se dispara cuando se aplican los filtros
    useEffect(() => {
        console.log("Filtros aplicados:", filtrosAplicados);
        cargarProductos({ filtros: filtrosAplicados });
    }, [filtrosAplicados]);
    
  const aplicarFiltros = () => {
    setFiltrosAplicados({ ...filtrosTemp, page: 1 });
  };

  const limpiarFiltros = () => {
    const filtrosVacios = {
      nombre: '',
      descripcion: '',
      precioMin: '',
      precioMax: '',
      categorias: [],
      vendedores: [],
      vendedor: '',
      page: 1,
      limit: 10,
      ordenar: ''
    };
    setFiltrosTemp(filtrosVacios);
    setFiltrosAplicados(filtrosVacios);
  };

  const handleFiltroChange = (tipo, valor) => {
    // Ordenar y página se aplican directamente
    if (tipo === 'ordenar' || tipo === 'page') {
      setFiltrosAplicados(prev => ({
        ...prev,
        [tipo]: valor
      }));
      setFiltrosTemp(prev => ({
        ...prev,
        [tipo]: valor
      }));
    } else {
      // Categorías y precios se guardan temporalmente
      setFiltrosTemp(prev => ({
        ...prev,
        [tipo]: valor
      }));
    }
  };

  return (      
    <div className="ProductListingPage">
        <div className="products-main">
            <div className="filters-sidebar">
                <ProductosFiltros 
                    filtros={filtrosTemp} 
                    handleFiltroChange={handleFiltroChange}
                    aplicarFiltros={aplicarFiltros}
                    limpiarFiltros={limpiarFiltros}
                />
            </div>
            <div className="products-content">
                <div className="parte-arriba">
                    <h1>NUESTROS PRODUCTOS</h1>
                    <SortSelect 
                    value={filtrosAplicados.ordenar}
                    onChange={handleFiltroChange}                  
                    />
                </div> 
            <Grid productos={productos} actualizarCarrito={actualizarCarrito} />
            </div>
        </div>
        <Stack spacing={2} alignItems="center" sx={{ marginTop: 3 }}>
            <Pagination 
                count={10} 
                page={filtrosAplicados.page}
                onChange={(event, value) => handleFiltroChange('page', value)}
                color="primary" 
            />
        </Stack>
    </div>
  )
};

export default ProductListingPage;
