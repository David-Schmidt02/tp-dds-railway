import { BrowserRouter, Routes, Route, Navigate, } from 'react-router-dom';
import Layout from './features/layout/Layout';
import HomePage from './features/home/homePage';
import { CartProvider } from './context/CartContext';

const productosIniciales = [
  { id: 1, nombre: "Producto 1", precio: 100, imagen: "images/camisa1.jpg", seleccionado: false },
  { id: 2, nombre: "Producto 2", precio: 200, imagen: "images/camisa1.jpg", seleccionado: false },
  {
    id: 3,
    nombre: "Remera Básica",
    precio: 1200,
    imagen: "images/camisa1.jpg",
    seleccionado: false
  },
  // ...más productos
];

function App() {
  return (
    <CartProvider productosIniciales={productosIniciales}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/home" replace />} />  
            <Route path="home" element={<HomePage />} />
            {/* <Route path="*" element={<Navigate to="/home" replace />} />  no se que es*/}
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
