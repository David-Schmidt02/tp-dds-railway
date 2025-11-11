import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";


import "./Navbar.css";
import { TextField } from "@mui/material";

import { FaSearch, FaShoppingCart, FaUserAlt } from "react-icons/fa";
import Badge from "@mui/material/Badge";
import { useNavigate } from "react-router-dom";

const Navbar = ({ carrito }) => {
  const navigate = useNavigate();
  const [texto, setTexto] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

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
  

  const cantProductosEnCarrito = () => {
    if (!carrito || !Array.isArray(carrito)) {
      return 0;
    }
    let suma = 0;
    for (const producto of carrito) {
      suma += producto.cantidad || 1; // Si no tiene cantidad, cuenta como 1
    }
    return suma;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // cuando se baja más de 50px
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`navbar ${isScrolled ? "scrolled" : ""}`}
      aria-label="Navegación principal"
    >
      <div className="navbar-left">
        <Link to={`/`} style={{ textDecoration: "none", color: "inherit" }}>
          <div className="logo" aria-label="Logo de Tienda Sol">
            <img
              src={"images/tituloTiendaSol.png"}
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
            badgeContent={cantProductosEnCarrito()}
            color="primary"
          >
            <FaShoppingCart className="navbar-icon" id="cart-icon" />
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
