
import React from 'react';
import './Home.css';
import { useState, useEffect } from 'react';
import { getProductsSlowly } from '../../services/services.js';
import CarouselCategoria from './components/carouselCategoria/CarouselCategoria.jsx';
import Grid from "../../components/grid/grid.jsx";
import { CircularProgress } from '@mui/material';

import categoriasMock from '../../mockData/mockDataCategorias.js';


const Home = () => {

    
    const [productos, setProductos] = useState([]);

    const cargarProductos = async () => {
      const productosCargados = await getProductsSlowly();
      setProductos(productosCargados)
    }

    // Para que cuando se monte el componente los cargue
    useEffect(() => {
      cargarProductos()
    }, [])

   
    return (
        <>
            <div className="banner-area"></div> 
            
            {!productos.length ? <div className="spinner">
                <CircularProgress/>
            </div> :
            <div style={{ padding: "2rem" }} >
                <CarouselCategoria categories={categoriasMock}></CarouselCategoria>
                <h1>Nuestros Productos</h1>
                <p>Aquí encontrarás todas las prendas disponibles.</p>
                <Grid />
            </div>}
        </>
    );
};

export default Home;