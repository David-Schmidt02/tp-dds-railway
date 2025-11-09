import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';
import CartItem from './components/CartItem';
import CartSummary from './components/CartSummary';
import EmptyCart from './components/EmptyCart';
import { useCartActions } from './hooks/useCartActions';

const Cart = ({ carrito, eliminarDelCarrito, actualizarCarrito }) => {
  const navigate = useNavigate();
  const { aumentarCantidad, disminuirCantidad, calcularTotal, cantidadTotal } = useCartActions(carrito, actualizarCarrito);

  const irCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Mi Carrito</h1>
        <p>Tienes {cantidadTotal()} productos en tu carrito</p>
      </div>

      {!carrito || carrito.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {carrito.map((producto, index) => (
              <CartItem
                key={index}
                producto={producto}
                onIncrease={aumentarCantidad}
                onDecrease={disminuirCantidad}
                onDelete={eliminarDelCarrito}
              />
            ))}
          </div>

          <CartSummary
            cantidadTotal={cantidadTotal()}
            total={calcularTotal()}
            onCheckout={irCheckout}
          />
        </div>
      )}
    </div>
  );
};

export default Cart;
