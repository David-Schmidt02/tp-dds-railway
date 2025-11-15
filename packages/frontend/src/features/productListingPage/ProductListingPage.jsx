import React, { useState, useEffect } from 'react';
import './ProductListingPage.css';
import Grid from '../../components/grid/grid.jsx';
import { getProductos } from '../../services/api.js';
import SortSelect from './components/SortSelect.jsx';
import ProductosFiltros from './ProductosFiltros/ProductosFiltros.jsx';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';


const ProductListingPage = ({ actualizarCarrito }) => {
  const [productos, setProductos] = useState([]);
  const [paginacion, setPaginacion] = useState({ totalPages: 1, page: 1, totalItems: 0 });
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    nombre: '',
    descripcion: '',
    precioMin: '',
    precioMax: '',
    categorias: [],
    vendedores: [],
    page: 1,
    limit: 10,
    ordenar: ''
  });
  const [filtrosTemp, setFiltrosTemp] = useState({ ...filtrosAplicados });

    const cargarProductos = async ({ filtros }) => {
        const respuesta = await getProductos(filtros);
        setProductos(respuesta.items || []);
        setPaginacion({
            totalPages: respuesta.totalPages || 1,
            page: respuesta.page || 1,
            totalItems: respuesta.totalItems || 0
        });
    }

    useEffect(() => {
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
    <div className="ProductListingPage" role="main" aria-labelledby="products-heading">
        <div className="products-main">
            <div className="filters-sidebar" role="complementary" aria-label="Filtros">
                <ProductosFiltros 
                    filtros={filtrosTemp} 
                    handleFiltroChange={handleFiltroChange}
                    aplicarFiltros={aplicarFiltros}
                    limpiarFiltros={limpiarFiltros}
                />
            </div>
            <div className="products-content" role="region" aria-labelledby="products-heading" aria-live="polite">
                <div className="parte-arriba">
                    <h1 id="products-heading">NUESTROS PRODUCTOS</h1>
                    <SortSelect 
                    id="sort-select"
                    aria-label="Ordenar productos"
                    value={filtrosAplicados.ordenar}
                    onChange={handleFiltroChange}                  
                    />
                </div> 
            <Grid productos={productos} />
            </div>
        </div>
        <div aria-label="Paginación de productos">
          <Stack spacing={2} alignItems="center" sx={{ marginTop: 3 }}>
              <Pagination
                  count={paginacion.totalPages}
                  page={filtrosAplicados.page}
                  onChange={(event, value) => handleFiltroChange('page', value)}
                  color="primary"
                  aria-label="Paginación"
                  getItemAriaLabel={(type, page, selected) => {
                    if (type === 'page') return `${selected ? 'Página actual' : 'Ir a la página'} ${page}`;
                    if (type === 'first') return 'Ir a la primera página';
                    if (type === 'last') return 'Ir a la última página';
                    if (type === 'next') return 'Ir a la página siguiente';
                    if (type === 'previous') return 'Ir a la página anterior';
                    return '';
                  }}
              />
          </Stack>
        </div>
    </div>

  )
};

export default ProductListingPage;
