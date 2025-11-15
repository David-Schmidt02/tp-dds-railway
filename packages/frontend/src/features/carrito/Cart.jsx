import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';
import CartItem from './components/CartItem';
import CartSummary from './components/CartSummary';
import EmptyCart from './components/EmptyCart';
import { useCart } from '../../context/cartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { carrito, eliminarDelCarrito, actualizarCantidadCarrito } = useCart();

  // Funciones para aumentar/disminuir cantidad y calcular totales
  const aumentarCantidad = (producto) => {
    actualizarCantidadCarrito({ id: producto.id, cantidad: producto.cantidad + 1 });
  };
  const disminuirCantidad = (producto) => {
    if (producto.cantidad > 1) {
      actualizarCantidadCarrito({ id: producto.id, cantidad: producto.cantidad - 1 });
    }
  };
  const calcularTotal = () => {
    return carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);
  };
  const cantidadTotal = () => {
    return carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
  };

  const irCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="cart-container" role="region" aria-label="Carrito de compras">
      <div className="cart-header" role="banner" aria-label="Encabezado del carrito">
        <h1 tabIndex="0">Mi Carrito</h1>
        <p aria-live="polite">Tienes {cantidadTotal()} productos en tu carrito</p>
      </div>

      {!carrito || carrito.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="cart-content" role="main" aria-label="Contenido del carrito">
          <div className="cart-items" role="list" aria-label="Lista de productos en el carrito">
            {carrito.map((producto, index) => (
              <CartItem
                key={index}
                producto={producto}
                onIncrease={aumentarCantidad}
                onDecrease={disminuirCantidad}
                onDelete={eliminarDelCarrito}
                aria-label={`Producto ${producto.titulo}`}
              />
            ))}
          </div>

          <CartSummary
            cantidadTotal={cantidadTotal()}
            total={calcularTotal()}
            onCheckout={irCheckout}
            aria-label="Resumen del carrito"
          />
        </div>
      )}
    </div>
  );
};

export default Cart;
