import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './features/layout/Layout';
import Home from './features/home/Home';
import ProductoDetailPage from './features/productoDetailPage/ProductoDetailPage';
import Checkout from './features/checkout/checkout';
import Cart from './features/carrito/Cart';
import { useState } from 'react';
//import { CartProvider } from './context/CartContext';

function App() {

  const [carrito, setCarrito] = useState([]);

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
