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
