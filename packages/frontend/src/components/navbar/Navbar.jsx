import React, { useContext } from 'react';
import { useState } from 'react';
import { Link } from "react-router-dom";

import './Navbar.css'
import { TextField } from '@mui/material';

import { CartContext } from '../../context/CartContext';

// FontAwesome
import '../../fontawesome/fontawesome.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaSearch, FaShoppingCart, FaUserAlt } from 'react-icons/fa'
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';


const Navbar = () => {
  
  const [texto, setTexto] = useState("");

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
          <TextField
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            fullWidth
            variant="standard"
            placeholder="¿Qué estás buscando?"
          />

          <button
            className="btn search-btn"
            type="submit"
            aria-label="Buscar"
          >
            <FaSearch aria-hidden="true" />
          </button>
        </form>
      </div>
      <div className="navbar-right">
        <button
          className="btn cart-btn"
          aria-label="Ver carrito"
        >
          <Badge anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} badgeContent={4} color="primary">
            <FaShoppingCart className='navbar-icon' id="cart-icon" />
          </Badge>
        </button>
        <button
          className="btn login-btn"
          aria-label="Ingresar a la cuenta"
        >
          <FaUserAlt className='navbar-icon'/>
        </button>
      </div>
    </nav>
  );
}

export default Navbar