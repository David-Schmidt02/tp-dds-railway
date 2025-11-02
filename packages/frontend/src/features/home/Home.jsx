
import React from 'react';
import './Home.css';

import CarouselCategoria from './components/carouselCategoria/CarouselCategoria.jsx';
import Grid from "../../components/grid/grid.jsx";

import categoriasMock from '../../mockData/mockDataCategorias.js';

const Home = () => {
    return (
        <>
            <div className="banner-area">
            </div> 
            
            <div style={{ padding: "2rem" }} >
                <CarouselCategoria categories={categoriasMock}></CarouselCategoria>
                <h1>Nuestros Productos</h1>
                <p>Aquí encontrarás todas las prendas disponibles.</p>
                <Grid />
            </div> 
        </>
    );
};

export default Home;