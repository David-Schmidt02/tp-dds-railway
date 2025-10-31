
import './homePage.css';
import React from 'react';
import CarouselCategoria from './components/carouselCategoria/CarouselCategoria.jsx';

const categoriasMock = [
    { id: 1, nombre: 'Remeras', imagen: 'images/camisa1.jpg' },
    { id: 2, nombre: 'Pantalones', imagen: 'images/pantalon1.jpg' },
    { id: 3, nombre: 'Medias', imagen: 'images/medias1.jpg' },
    { id: 4, nombre: 'Buzos', imagen: 'images/Buzo1.jpg' },
    { id: 5, nombre: 'Gorros', imagen: 'images/gorro1.jpg' },
    { id: 6, nombre: 'Camisas', imagen: 'images/camisa1.jpg' },
];

const HomePage = () => {
    return (
        <>
        <div className="banner-area">
        </div> 
        
        <div style={{ padding: "2rem" }} >
            <CarouselCategoria categories={categoriasMock}></CarouselCategoria>
            <h1>Nuestros Productos</h1>
            <p>Aquí encontrarás todas las prendas disponibles.</p>
        </div> 
        </>
    );
};

export default HomePage;