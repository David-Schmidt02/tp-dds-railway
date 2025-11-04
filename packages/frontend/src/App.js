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

  const actualizarCarrito = (hotel) => {
    setCarrito([...carrito, hotel]);
  };

  const limpiarCarrito = () => {
    setCarrito([]);
  };

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout carrito={carrito} />}>
            <Route index element={<Home />} />
            <Route path="/producto/:id" element={<ProductoDetailPage 
                  carrito={carrito}
                  actualizarCarrito={actualizarCarrito}
             />} />
            <Route 
              path="/cart" 
              element={
                <Cart 
                  carrito={carrito}
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
