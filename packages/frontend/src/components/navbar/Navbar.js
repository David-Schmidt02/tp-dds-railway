import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import '../../fontawesome/fontawesome.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';


import './Navbar.css';

export default function Navbar() {
  const { productosSeleccionados } = useContext(CartContext);
  const haySeleccionados = productosSeleccionados().length > 0;

  return (
    <nav className="navbar" aria-label="Navegación principal">
      <div className="navbar-left">
        <div className="logo" aria-label="Logo de Tienda Sol">
          <img
            src={'images/tituloTiendaSol.png'}
            alt="Logo de Tienda Sol"
            className="logo-image"
            role="img"
            aria-hidden="false"
          />
        </div>
      </div>
      <div className="navbar-center">
        <form className="search-box" role="search" aria-label="Buscar productos">
          <input
            type="text"
            placeholder="¿Qué estás buscando?"
            aria-label="Buscar"
          />
          <button
            className="search-btn"
            type="submit"
            aria-label="Buscar"
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} aria-hidden="true" />
          </button>
        </form>
      </div>
      <div className="navbar-right">
        <button
          className="cart-btn"
          aria-label="Ver carrito"
        >
          <FontAwesomeIcon icon={faShoppingCart} size="xl" style={{color: haySeleccionados ? "#0071ff" : "#d4c9be"}} aria-hidden="true" />
        </button>
        <button
          className="login-btn"
          aria-label="Ingresar a la cuenta"
        >
          Ingresar
        </button>
      </div>
    </nav>
  );
}
