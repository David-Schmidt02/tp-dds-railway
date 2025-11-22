import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './features/layout/Layout';
import Home from './features/home/Home';
import ProductoDetailPage from './features/productoDetailPage/ProductoDetailPage';
import Checkout from './features/checkout/checkout';
import Cart from './features/carrito/Cart';
import ProductListingPage from './features/productListingPage/ProductListingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/producto/:id" element={<ProductoDetailPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout/*" element={<Checkout />} />
          <Route path="/productos" element={<ProductListingPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
