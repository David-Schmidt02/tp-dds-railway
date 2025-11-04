import React, { useState, useEffect } from "react";
import './CarouselCategoria.css';
import CategoriaItem from '../categoria/CategoriaItem.jsx';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const CarouselCategoria = ({ categories }) => {
    const [index, setIndex] = useState(0);
    const visible = 4;

    useEffect(() => {
        setIndex(0);
    }, [categories]);

    const siguiente = () => {
        if (index < categories.length - visible) setIndex(index + 1);
    };

    const anterior = () => {
        if (index > 0) setIndex(index - 1);
    };

    if (!Array.isArray(categories) || categories.length === 0) {
        return <p className="carousel-empty">No hay categorías disponibles</p>;
    }

    return (
        <div className="carousel-container">
            <div className="carousel-header">
                <h2 className="carousel-title">Categorias de la pagina</h2>
                <div className="carousel-controls">
                    <button className="btn carousel-btn" onClick={anterior} disabled={index === 0}>
                        <KeyboardArrowLeftIcon />
                    </button>
                    <button className="btn carousel-btn" onClick={siguiente} disabled={index >= categories.length - visible}>
                        <KeyboardArrowRightIcon />
                    </button>
                </div>
            </div>
            <div className="categoria-carousel">
                {categories.slice(index, index + visible).map((category) =>
                    <CategoriaItem categoria={category} key={category.id} />
                )}
            </div>
        </div>
    );
};

export default CarouselCategoria;