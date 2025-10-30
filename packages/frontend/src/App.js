import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './features/layout/Layout';
import HomePage from './features/home/homePage';


import {useEffect, useState} from "react";
import { getProductos } from './mockData/api';



function App() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const cargarProductos = async () => setProductos(await getProductos())
    cargarProductos()
  }, [])

  const agregarProductosAComanda = async (productosSeleccionados) => {
    console.log("Agregando productos...", productosSeleccionados.map(p => `${p.nombre} (Notas: ${p.notas})`))
    setComanda({...comanda, productos: productosSeleccionados})
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="home" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
