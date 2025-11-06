
import React from 'react';
import './Home.css';
import { useState, useEffect } from 'react';
import { getProductos } from '../../services/productoService.js';
import CarouselCategoria from './components/carouselCategoria/CarouselCategoria.jsx';
import Grid from "../../components/grid/grid.jsx";
import { CircularProgress } from '@mui/material';

import categoriasMock from '../../mockData/mockDataCategorias.js';


const Home = ({actualizarCarrito}) => {

    
    const [productos, setProductos] = useState([]);


    const cargarProductos = async () => {
      const productosCargados = await getProductos();
      console.log("Respuesta del backend:", productosCargados);
      setProductos(productosCargados)
    }

    // Para que cuando se monte el componente los cargue
    useEffect(() => {
      cargarProductos()
    }, [])

   
    return (
        <>
            <div className="banner-area">
                <div className="banner-text">
                    <h2>Descuentos de hasta el 50</h2>    
                </div>
            </div> 
            
            {!productos.length ? <div className="spinner">
                <CircularProgress/>
            </div> :
            <div>
                <CarouselCategoria categories={categoriasMock}></CarouselCategoria>
                <div className="productos-section">
                    <div className="productos-header">
                        <h1 className="productos-title">Nuestros Productos</h1>
                    </div>
                    <p className="productos-descripcion">Aquí encontrarás todas las prendas disponibles.</p>
                    <Grid productos={productos} actualizarCarrito={actualizarCarrito} />
                </div>
            </div>}
        </>
    );
};

export default Home;