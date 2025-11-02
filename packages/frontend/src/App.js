import { BrowserRouter, Routes, Route, Navigate, } from 'react-router-dom';
import Layout from './features/layout/Layout';
import Home from './features/home/Home';
//import { CartProvider } from './context/CartContext';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />  
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
