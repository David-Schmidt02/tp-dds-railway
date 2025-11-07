import React from 'react';
import './Cart.css';
import { useNavigate } from "react-router";
import DeleteIcon from '@mui/icons-material/Delete';

const Cart = ({ carrito, eliminarDelCarrito }) => {
  const navigate = useNavigate();

  const calcularTotal = () => {
    return carrito.reduce((total, producto) => {
      const cantidad = producto.cantidad;
      const precio = producto.precio;
      return total + (cantidad * precio);
    }, 0);
  };

  const cantidadTotal = () => {
    return carrito.reduce((total, producto) => {
      return total + (producto.cantidad || 1);
    }, 0);
  };

  const irCheckout = () => {
    navigate('/checkout')
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Mi Carrito</h1>
        <p>Tienes {cantidadTotal()} productos en tu carrito</p>
      </div>

      {!carrito || carrito.length === 0 ? (
        <div className="cart-empty">
          <h2>Tu carrito está vacío</h2>
          <p>¡Explora nuestros productos y agrega algunos a tu carrito!</p>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {carrito.map((producto, index) => (
              <div key={index} className="cart-item">
                <div className="item-image">
                  <img
                    src={producto.foto}
                    alt={producto.nombre}
                    className="cart-item-image"
                  />
                </div>
                <div className="item-details">
                  <h3>{producto.nombre}</h3>
                  <p className="item-description">{producto.descripcion}</p>
                  <div className="item-quantity">
                    <span>Cantidad: {producto.cantidad || 1}</span>
                  </div>
                </div>
                <div className="item-price">
                  <span className="price">${producto.precio}</span>
                  <span className="subtotal">
                    Subtotal: ${(producto.precio * (producto.cantidad || 1)).toFixed(2)}
                  </span>
                  <button
                    className="delete-btn"
                    onClick={() => eliminarDelCarrito(producto.id)}
                  >
                    <DeleteIcon style={{ marginRight: "5px" }} />
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h2>Resumen del Pedido</h2>
              <div className="summary-row">
                <span>Productos ({cantidadTotal()})</span>
                <span>${calcularTotal().toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${calcularTotal().toFixed(2)}</span>
              </div>
              <button className="checkout-btn" onClick={irCheckout}>
                Proceder al Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;



