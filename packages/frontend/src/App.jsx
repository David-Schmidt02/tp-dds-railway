import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './features/layout/Layout';
import Home from './features/home/Home';
import ProductoDetailPage from './features/productoDetailPage/ProductoDetailPage';
import Checkout from './features/checkout/checkout';
import Cart from './features/carrito/Cart';
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

  // Normalizar producto para asegurar que siempre tenga 'id'
  const normalizarProducto = (producto) => {
    return {
      ...producto,
      id: producto.id || producto._id
    };
  };

  const actualizarCarrito = (producto) => {
    const productoNormalizado = normalizarProducto(producto);
    const productoExistente = carrito.find(item => item.id === productoNormalizado.id);
    if (productoExistente) {
      setCarrito(
      carrito.map(item =>
        item.id === productoNormalizado.id
        ? { ...item, cantidad: item.cantidad + (productoNormalizado.cantidad) }
        : item
      )
      );
    } else {
      setCarrito([...carrito, { ...productoNormalizado, cantidad: productoNormalizado.cantidad || 1 }]);
    }
  };

  const limpiarCarrito = () => {
    setCarrito([]);
  };

  const eliminarDelCarrito = (id) => {
  setCarrito(carrito.filter(producto => producto.id !== id));
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
                />} 
            />
            <Route 
              path="/checkout" 
              element={
                <Checkout 
                  carrito={carrito}
                  limpiarCarrito={limpiarCarrito}
                />} 
            />
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
