import React, { useContext } from 'react';
import { Link } from "react-router-dom";

import './Navbar.css'

import { CartContext } from '../../context/CartContext';

// FontAwesome
import '../../fontawesome/fontawesome.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaShoppingCart, FaSearch } from 'react-icons/fa'


const Navbar = () => {
  //const { productosSeleccionados } = useContext(CartContext);
  //const haySeleccionados = productosSeleccionados().length > 0;

  //<FontAwesomeIcon icon={faShoppingCart} size="xl" style={{color: haySeleccionados ? "#0071ff" : "#d4c9be"}} aria-hidden="true" />

  return (
    <nav className="navbar" aria-label="Navegación principal">
      <div className="navbar-left">
        <Link to={`/`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="logo" aria-label="Logo de Tienda Sol">
            <img
              src={'images/tituloTiendaSol.png'}
              alt="Logo de Tienda Sol"
              className="logo-image"
              role="img"
              aria-hidden="false"
            />
          </div>
        </Link> 
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
            <FaSearch aria-hidden="true" />
          </button>
        </form>
      </div>
      <div className="navbar-right">
        <button
          className="cart-btn"
          aria-label="Ver carrito"

        >
          <FaShoppingCart className='navbar-cart'/>
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

export default Navbar