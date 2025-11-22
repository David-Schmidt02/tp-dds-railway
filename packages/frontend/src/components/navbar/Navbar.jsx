import React, { useState } from "react";
import { FaSearch, FaShoppingCart, FaUserAlt } from "react-icons/fa";
import TextField from "@mui/material/TextField";
import Badge from "@mui/material/Badge";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from '../../context/cartContext';
import "./Navbar.css";

const Navbar = () => {
  const { cantidadTotal } = useCart();
  const navigate = useNavigate();
  const [texto, setTexto] = useState("");

  const irACarrito = () => {
    navigate("/cart");
  };


  const manejarBusqueda = (e) => {    
    e.preventDefault(); 
    const query = texto.trim();
    if (query.length > 0) {
      navigate(`/productos?nombre=${encodeURIComponent(query)}`);
      setTexto('');
    }
  };

  return (
    <nav
      className="navbar"
      aria-label="Navegación principal"
    >
      <div className="navbar-left">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="logo" aria-label="Logo de Tienda Sol">
            <img
              src="images/tituloTiendaSol.png"
              alt="Logo de Tienda Sol"
              className="logo-image"
              role="img"
              aria-hidden="false"
            />
          </div>
        </Link>
      </div>
      <div className="navbar-center">
        <form
          className="search-box"
          role="search"
          aria-label="Buscar productos"
          onSubmit={manejarBusqueda}
        >
          <TextField
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            fullWidth
            variant="standard"
            placeholder="¿Qué estás buscando?"
          />

          <button
            className="search-navbar-btn"
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
          onClick={irACarrito}
        >
          <Badge
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={cantidadTotal()}
            color="primary"
          >
            <FaShoppingCart className="navbar-icon" />
          </Badge>
        </button>
        <button className="btn login-btn" aria-label="Ingresar a la cuenta">
          <FaUserAlt className="navbar-icon" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
