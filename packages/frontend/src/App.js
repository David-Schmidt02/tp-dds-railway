import Platos from './features/platos/Platos';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, useNavigate} from 'react-router';
import { Routes, Route } from 'react-router-dom';
import Layout from './features/layout/Layout';
import ProductDetailPage from './features/products/ProductDetail';
import Bebidas from "./features/bebidas/bebidas";
import {Comanda} from "./features/pedido/comanda";
import {useEffect, useState} from "react";
import {getBebidas, getPlatos, putCommanda} from "./mockData/api";

function App() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const cargarProductos = async () => setProductos(await getPlatos())
    cargarProductos()
  }, [])

  const agregarProductosAComanda = async (productosSeleccionados) => {
    console.log("Agregando productos...", productosSeleccionados.map(p => `${p.nombre} (Notas: ${p.notas})`))
    setComanda({...comanda, productos: productosSeleccionados})
  }

  return (
      <BrowserRouter>
      <Routes>
      <Route path="/" element={<Layout cantProductos={productos.length}  />} >
        {<Route path="/platos" element={productos.length === 0 ? "Cargando..." :  <Platos
          todosLosProductos={productos}
          alAgregarAComanda={agregarProductosAComanda}
        />}/>}
        <Route path="/comanda" element={<Comanda comanda={comanda} />} />
      </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
