import React from 'react';
import './Home.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductos, getCategorias } from '../../services/api.js';
import Grid from "../../components/grid/grid.jsx";
import { CircularProgress } from '@mui/material';


const Home = ({ actualizarCarrito }) => {

    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);


    const cargarProductos = async () => {
        const respuesta = await getProductos();
        setProductos(respuesta.items || []);
    }

    const cargarCategorias = async () => {
        const categoriasData = await getCategorias();
        const categoriasOrdenadas = (categoriasData || []).sort((a, b) => a.localeCompare(b));
        setCategorias(categoriasOrdenadas);
    }

    useEffect(() => {
        cargarProductos();
        cargarCategorias();
    }, [])


    return (
        <>
            <div className="banner-area">
                <div className="banner-text">
                    <h2>Descuentos de hasta el 50</h2>
                </div>
            </div>

            {!productos.length ? <div className="spinner">
                <CircularProgress />
            </div> :
                <div>
                    <div className="productos-section">
                        <div className="productos-header">
                            <h1 className="productos-title">Nuestros Productos</h1>
                        </div>
                        <p className="productos-descripcion">Aquí encontrarás todas las prendas disponibles.</p>
                        <Grid productos={productos} />
                    </div>
                    <button
                        className="ver-mas-btn"
                        onClick={() => {
                        navigate("/productos");
                        window.scrollTo(0, 0);    
                        }}
                    >
                        <span>Ver más</span>
                    </button>
                </div>}
        </>
    );
};

export default Home;