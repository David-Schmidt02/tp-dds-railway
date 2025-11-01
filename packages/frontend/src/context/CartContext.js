import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children, productosIniciales = [] }) => {
  // productos: todos los productos existentes en la tienda
  const [productos, setProductos] = useState(productosIniciales);
  // carrito: productos seleccionados para comprar
  const [carrito, setCarrito] = useState([]);

   useEffect(() => {
    setProductos(productosIniciales);
  }, [productosIniciales]);


  // Selecciona/deselecciona un producto
  const seleccionarProducto = (id) => {
    setProductos(productos.map(p => p.id === id ? { ...p, seleccionado: !p.seleccionado } : p));
  };

  // Devuelve los productos seleccionados para comprar
  const productosSeleccionados = () => productos.filter(p => p.seleccionado);

  // Agrega los productos seleccionados al carrito y limpia la selección
  const agregarACarrito = () => {
    const seleccionados = productosSeleccionados();
    setCarrito([...carrito, ...seleccionados]);
    setProductos(productos.map(p => ({ ...p, seleccionado: false })));
  };

  return (
    <CartContext.Provider value={{ productos, setProductos, seleccionarProducto, productosSeleccionados, agregarACarrito, carrito }}>
      {children}
    </CartContext.Provider>
  );
};
