import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './ProductoDetailPage.css'
import productosItems from '../../mockData/mockDataProductos.js'

const ProductoDetailPage = ({ carrito, actualizarCarrito }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = productosItems.find(item => item.id === id);
  const [cantidad, setcantidad] = useState(1);

  useEffect(() => {
    // Reset cantidad when product changes
    setcantidad(1);
  }, [id]);

  if (!item) {
    return (
      <div className="item-detail-page">
        <div className="error-container">
          <h2>Producto no encontrado</h2>
          <p>El producto que buscás no existe.</p>
          <button onClick={() => navigate('/')} className="comprar-ahora-btn">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const handleCambioCantidad = (cambio) => {
    const newCantidad = cantidad + cambio;
    if (newCantidad >= 1 && newCantidad <= item.stock) {
      setcantidad(newCantidad);
    }
  };

  const handleAgregarAlCarrito = () => {
    const itemCarrito = {
      id: item.id,
      titulo: item.titulo,
      precio: item.precio,
      moneda: item.moneda,
      cantidad: cantidad,
      foto: item.fotos[0]
    };
    actualizarCarrito(itemCarrito);
    console.log(`Agregando ${cantidad} unidad(es) de ${item.titulo} al carrito`);
     navigate("/")
  };

  const handleComprarAhora = () => {
    const itemCarrito = {
      id: item.id,
      titulo: item.titulo,
      precio: item.precio,
      moneda: item.moneda,
      cantidad: cantidad,
      foto: item.fotos[0]
    };
    actualizarCarrito(itemCarrito);
    console.log(`Agregando ${cantidad} unidad(es) de ${item.titulo} al carrito`);
    navigate("/checkout");
  };

  const formatPrecio= (precio, moneda) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: moneda || 'ARS',
      minimumFractionDigits: 0
    }).format(precio);
  };

  const obtenerEstadoStock = () => {
    if (!item.activo || item.stock === 0) {
      return { text: 'Sin stock', className: 'stock-unavailable' };
    } else if (item.stock <= 5) {
      return { text: `Últimas ${item.stock} unidades`, className: 'stock-low' };
    } else {
      return { text: 'Disponible', className: 'stock-available' };
    }
  };

  const stockStatus = obtenerEstadoStock();

  return (
    <div className="item-detalles-page">
      <div className="item-detalles-container">
        {/* Sección de imágenes */}
        <div className="item-imagenes">
          <img
            src={item.fotos[0]}
            alt={item.titulo}
            className="item-main-imagen"
          />
        </div>

        {/* Sección de información */}
        <div className="item-info">
          <h1 className="item-titulo">{item.titulo}</h1>
          <div className="item-vendedor">Vendedor: {item.vendedor}</div>
          <div className="item-descripcion">{item.descripcion}</div>

          <div className={`item-stock ${stockStatus.className}`}>
            {stockStatus.text}
          </div>

          <div className="item-precio">
            {formatPrecio(item.precio, item.moneda)}
          </div>

          <ul className="item-detalles">
            <li className="item-detalle">
              <span className="detalle-label">Categorías:</span>
              <span className="detalle-valor">{item.categorias.join(', ')}</span>
            </li>
            <li className="item-detalle">
              <span className="detalle-label">Stock disponible:</span>
              <span className="detalle-valor">{item.stock} unidades</span>
            </li>
          </ul>

          {/* Controles de compra */}
          <div className="item-actions">
            <div className="cantidad-selector">
              <span className="cantidad-label">Cantidad:</span>
              <div className="controlers-cantidad">
                <button
                  className="btn cantidad-btn"
                  onClick={() => handleCambioCantidad(-1)}
                  disabled={cantidad <= 1}
                >
                  -
                </button>
                <span className="cantidad-value">{cantidad}</span>
                <button
                  className="btn cantidad-btn"
                  onClick={() => handleCambioCantidad(1)}
                  disabled={cantidad >= item.stock}
                >
                  +
                </button>
              </div>
            </div>

            <button
              className="btn agregar-al-carrito-btn"
              onClick={handleAgregarAlCarrito}
              disabled={!item.activo || item.stock === 0}
            >
              Agregar al carrito
            </button>

            <button
              className="btn comprar-ahora-btn"
              onClick={handleComprarAhora}
              disabled={!item.activo || item.stock === 0}
            >
              Comprar ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductoDetailPage
