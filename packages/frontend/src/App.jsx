import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './features/layout/Layout';
import Home from './features/home/Home';
import ProductoDetailPage from './features/productoDetailPage/ProductoDetailPage';
import Checkout from './features/checkout/Checkout';
import Cart from './features/carrito/Cart';
import ProductListingPage from './features/productListingPage/ProductListingPage';
import { useState, useEffect } from 'react';
//import { CartProvider } from './context/CartContext';

function App() {

  // Cargar carrito desde localStorage al inicializar
  const [carrito, setCarrito] = useState(() => {
    try {
      const carritoGuardado = localStorage.getItem('carrito');
      return carritoGuardado ? JSON.parse(carritoGuardado) : [];
    } catch (error) {
      console.error('Error al cargar carrito desde localStorage:', error);
      return [];
    }
  });

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    try {
      localStorage.setItem('carrito', JSON.stringify(carrito));
    } catch (error) {
      console.error('Error al guardar carrito en localStorage:', error);
    }
  }, [carrito]);

  const actualizarCarrito = (producto) => {
    const productoExistente = carrito.find(item => item.id === producto.id);
    if (productoExistente) {
      setCarrito(
        carrito.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + (producto.cantidad) }
            : item
        )
      );
    } else {
      setCarrito([...carrito, { ...producto, cantidad: producto.cantidad || 1 }]);
    }
  };

  const limpiarCarrito = () => {
    setCarrito([]);
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter(producto => producto.id !== id));
  };

  const actualizarCantidadCarrito = (producto) => {
    setCarrito(
      carrito.map(item =>
        item.id === producto.id
          ? { ...item, cantidad: producto.cantidad }
          : item
      )
    );
  };

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout carrito={carrito} />}>
            <Route index element={<Home actualizarCarrito = {actualizarCarrito} />} />
            <Route path="/producto/:id" element={<ProductoDetailPage 
                  carrito={carrito}
                  actualizarCarrito={actualizarCarrito}
             />} />
            <Route
              path="/cart"
              element={
                <Cart
                  carrito={carrito}
                  eliminarDelCarrito={eliminarDelCarrito}
                  actualizarCarrito={actualizarCantidadCarrito}
                />}
            />
            <Route
              path="/checkout/*"
              element={
                <Checkout
                  carrito={carrito}
                  limpiarCarrito={limpiarCarrito}
                />}
            />
            <Route
              path="/productos"
              element={
                <ProductListingPage
                  actualizarCarrito={actualizarCarrito}
                />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
