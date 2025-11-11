import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './ProductListingPage.css';
import Grid from '../../components/grid/grid.jsx';
import { getProductos } from '../../services/api.js';
import SortSelect from './components/SortSelect.jsx';
import ProductosFiltros from './ProductosFiltros/ProductosFiltros.jsx';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';


const ProductListingPage = ({ actualizarCarrito }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const nombreParam = searchParams.get('nombre') || '';
  const categoriaDesdeNavegacion = location.state?.categoriaSeleccionada;


  const [productos, setProductos] = useState([]);
  const [paginacion, setPaginacion] = useState({ totalPages: 1, page: 1, totalItems: 0 });
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    nombre: '',
    descripcion: nombreParam,
    precioMin: '',
    precioMax: '',
    categorias: categoriaDesdeNavegacion ? [categoriaDesdeNavegacion] : [],
    vendedores: [],
    page: 1,
    limit: 10,
    ordenar: ''
  });
  const [filtrosTemp, setFiltrosTemp] = useState({ ...filtrosAplicados });

    const cargarProductos = async ({ filtros }) => {
        // Si hay múltiples vendedores, hacer requests separados
        if (filtros.vendedores && filtros.vendedores.length > 0) {
            const todosLosProductos = [];

            for (const vendedorId of filtros.vendedores) {
                const respuesta = await getProductos({
                    ...filtros,
                    idVendedor: vendedorId,
                    vendedores: undefined
                });
                todosLosProductos.push(...(respuesta.items || []));
            }

            // Eliminar duplicados por _id
            const productosUnicos = todosLosProductos.filter((producto, index, self) =>
                index === self.findIndex(p => p._id === producto._id)
            );

            setProductos(productosUnicos);
            setPaginacion({
                totalPages: 1,
                page: 1,
                totalItems: productosUnicos.length
            });
        } else {
            // Request normal sin filtro de vendedor
            const respuesta = await getProductos(filtros);
            setProductos(respuesta.items || []);
            setPaginacion({
                totalPages: respuesta.totalPages || 1,
                page: respuesta.page || 1,
                totalItems: respuesta.totalItems || 0
            });
        }
    }

    useEffect(() => {
        if (categoriaDesdeNavegacion) {
            setFiltrosTemp(prev => ({
                ...prev,
                categorias: [categoriaDesdeNavegacion]
            }));
        }
    }, [categoriaDesdeNavegacion]);

  

   useEffect(() => {
      const params = new URLSearchParams(location.search);
      const nombre = params.get('nombre') || '';
      setFiltrosAplicados(prev => ({ ...prev, descripcion : nombre, page: 1 }));
      setFiltrosTemp(prev => ({ ...prev, descripcion : nombre, page: 1 }));
    }, [location.search]);

 

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
      ordenar: '',
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
                count={paginacion.totalPages}
                page={filtrosAplicados.page}
                onChange={(event, value) => handleFiltroChange('page', value)}
                color="primary"
            />
        </Stack>
    </div>
  )
};

export default ProductListingPage;
