import React from "react";
import "./card.css";

const Card = ({ product, onAddToCart }) => {
    const { image, name, price } = product;
    return (
        <div className="card-container">
            <img src={image} alt={name} className="card-image" />
            <div className="card-details">
                <div className="card-name">{name}</div>
                <div className="card-price">${price}</div>
            </div>
            <button className="card-add-btn" onClick={() => onAddToCart(product)}>
                Add To Cart
            </button>
        </div>
    );
};

export default Card;
