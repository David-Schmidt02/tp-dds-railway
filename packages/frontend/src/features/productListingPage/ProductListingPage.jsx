import React, { useState, useEffect } from 'react';
import './ProductListingPage.css';
import Grid from '../../components/grid/grid.jsx';
import { getProductos } from '../../services/api.js';
import SortSelect from './components/SortSelect.jsx';
import ProductosFiltros from './ProductosFiltros/ProductosFiltros.jsx';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useSearchParams } from 'react-router-dom';

const ProductListingPage = ({ actualizarCarrito }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [productos, setProductos] = useState([]);
  const [paginacion, setPaginacion] = useState({ totalPages: 1, page: 1, totalItems: 0 });

  
  const filtrosDesdeURL = {
    nombre: '',
    descripcion: searchParams.get('nombre') || '',
    precioMin: searchParams.get('precioMin') || '',
    precioMax: searchParams.get('precioMax') || '',
    categorias: searchParams.getAll('categorias'),
    vendedores: searchParams.getAll('vendedores'),
    page: parseInt(searchParams.get('page') || '1'),
    limit: 10,
    ordenar: searchParams.get('ordenar') || ''
  };

  const cargarProductos = async ({ filtros }) => {
    const respuesta = await getProductos(filtros);
    setProductos(respuesta.items || []);
    setPaginacion({
      totalPages: respuesta.totalPages || 1,
      page: respuesta.page || 1,
      totalItems: respuesta.totalItems || 0
    });
  };

  useEffect(() => {
    cargarProductos({ filtros: filtrosDesdeURL });
  }, [searchParams]);

  const updateSearchParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);

    if (Array.isArray(value)) {
      newParams.delete(key);
      value.forEach(v => newParams.append(key, v));
    } else if (value === '' || value == null) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }

    if (key !== 'page') {
    newParams.set('page', 1);
    }
    setSearchParams(newParams);
  };

  const handleFiltroChange = (tipo, valor) => {
    updateSearchParam(tipo, valor);
  };

  const limpiarFiltros = () => {
  const page = searchParams.get("page") || 1; // conservar el valor actual (o 1)
  setSearchParams({ page });
};

  return (
    <div className="ProductListingPage" role="main" aria-labelledby="products-heading">
      <div className="products-main">
        <div className="filters-sidebar" role="complementary" aria-label="Filtros">
          <ProductosFiltros
            filtros={filtrosDesdeURL}
            handleFiltroChange={handleFiltroChange}
            limpiarFiltros={limpiarFiltros}
          />
        </div>
        <div className="products-content" role="region" aria-labelledby="products-heading" aria-live="polite">
          <div className="parte-arriba">
            <h1 id="products-heading">NUESTROS PRODUCTOS</h1>
            <SortSelect
              id="sort-select"
              aria-label="Ordenar productos"
              value={filtrosDesdeURL.ordenar}
              onChange={handleFiltroChange}
            />
          </div>
          <Grid productos={productos} />
        </div>
      </div>

      <div aria-label="Paginación de productos">
        <Stack spacing={2} alignItems="center" sx={{ marginTop: 3, marginBottom: 2 }}>
          <Pagination
            count={paginacion.totalPages}
            page={filtrosDesdeURL.page}
            onChange={(event, value) => handleFiltroChange('page', value)}
            sx={{
                  "& .MuiPaginationItem-root": {
                    color: "var(--color-blue-dark)", 
                  },
                  "& .Mui-selected": {
                    backgroundColor: "var(--color-blue-dark) !important", 
                    color: "#fff",
                  }
                }}
            aria-label="Paginación"
          />
        </Stack>
      </div>
    </div>
  );
};

export default ProductListingPage;
