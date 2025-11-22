import React from 'react';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const CartItem = ({ producto, onIncrease, onDecrease, onDelete }) => {
  return (
    <div className="cart-item">
      <Link to={`/producto/${producto.id}`} state={{ producto }} className="item-image-link">
        <div className="item-image">
          <img
            src={producto.foto}
            alt={producto.titulo || producto.nombre || 'Producto'}
            className="cart-item-image"
          />
        </div>
      </Link>

      <div className="item-details">
        <Link to={`/producto/${producto.id}`} state={{ producto }} className="item-title-link">
          <h3>{producto.titulo }</h3>
        </Link>
        <p className="item-price-unit">${producto.precio.toLocaleString('es-AR')}</p>
        <div className="quantity-controls">
          <button
            className="quantity-btn"
            onClick={() => onDecrease(producto)}
            disabled={(producto.cantidad || 1) <= 1}
          >
            <RemoveIcon fontSize="small" />
          </button>
          <span className="quantity-display">{producto.cantidad || 1}</span>
          <button
            className="quantity-btn"
            onClick={() => onIncrease(producto)}
            disabled = {producto.cantidad >= producto.stock}
          >
            <AddIcon fontSize="small" />
          </button>
        </div>
      </div>

      <div className="item-price">
        <span className="subtotal-label">Subtotal</span>
        <span className="price">
          ${(producto.precio * (producto.cantidad || 1)).toLocaleString('es-AR')}
        </span>
        <button className="delete-btn" onClick={() => onDelete(producto.id)} aria-label="Eliminar producto">
          <DeleteIcon fontSize="medium" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
