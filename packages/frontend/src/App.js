import { BrowserRouter, Routes, Route, Navigate, } from 'react-router-dom';
import Layout from './features/layout/Layout';
import HomePage from './features/home/homePage';
import Productos from "./features/productos/Productos"


import {useEffect, useState} from "react";
import { getProductos } from './mockData/api';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/home" replace />} />  
          <Route path="home" element={<HomePage />} />
          <Route path="productos" element={<Productos />} />
          {/* <Route path="*" element={<Navigate to="/home" replace />} />  no se que es*/}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
