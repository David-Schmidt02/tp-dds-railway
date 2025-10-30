import React from 'react';
import '../../fontawesome/fontawesome.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo">
          <img src={'images/tituloTiendaSol.png'} alt="Tienda Sol Logo" className="logo-image" />
        </div>
      </div>
      <div className="navbar-center">
        <div className="search-box">
          <input type="text" placeholder="Que estas buscando?" />
          <button className="search-btn">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
      </div>
      <div className="navbar-right">
        <button className="cart-btn">
          <FontAwesomeIcon icon={faShoppingCart} />
        </button>
        <button className="login-btn">Ingresar</button>
      </div>
    </nav>
  );
}
