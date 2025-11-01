import React, { useState, useEffect } from "react";
import './CarouselCategoria.css';
import CategoriaItem from '../categoria/CategoriaItem.jsx';

const CarouselCategoria = ({ categories }) => {
    const [index, setIndex] = useState(0);
    const visible = 6;

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
        <>
            <h2 className="carousel-title">Categorias de la pagina</h2>
            <div className="categoria-carousel">
                 <button className="carousel-btn" onClick={anterior} disabled={index === 0}>
                ◀
                </button>
                {categories.slice(index, index + visible).map((category) =>
                    <CategoriaItem categoria={category} key={category.id} />
                )}
                <button className="carousel-btn" onClick={siguiente} disabled={index >= categories.length - visible}>
                ▶
                </button>
            </div>
            
        </>
    );
};

export default CarouselCategoria;