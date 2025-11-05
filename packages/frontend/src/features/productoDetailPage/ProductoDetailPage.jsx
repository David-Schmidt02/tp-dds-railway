import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './ProductoDetailPage.css'
import productosItems from '../../mockData/mockDataProductos.js'

const ProductoDetailPage = ({ carrito, actualizarCarrito }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Lookup robusto: compara como string para evitar problemas number vs string
  const item = productosItems.find(item => String(item.id) === String(id));

  // estado de cantidad y foto principal
  const [cantidad, setcantidad] = useState(1);
  const [mainPhoto, setMainPhoto] = useState(item ? item.fotos?.[0] || '' : '');

  useEffect(() => {
    // Reset cantidad y foto principal cuando cambia el id/item
    setcantidad(1);
    if (item) setMainPhoto(item.fotos?.[0] || '');
  }, [id, item]);

  if (!item) {
    return (
      <div className="item-detalles-page">
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

  const crearItemCarrito = () => ({
    id: item.id,
    titulo: item.titulo,
    precio: item.precio,
    moneda: item.moneda,
    cantidad: cantidad,
    foto: mainPhoto || item.fotos?.[0]
  });

  const handleAgregarAlCarrito = () => {
    const itemCarrito = crearItemCarrito();
    actualizarCarrito(itemCarrito);
    console.log(`Agregando ${cantidad} unidad(es) de ${item.titulo} al carrito`);
    navigate("/");
  };

  const handleComprarAhora = () => {
    const itemCarrito = crearItemCarrito();
    actualizarCarrito(itemCarrito);
    console.log(`Agregando ${cantidad} unidad(es) de ${item.titulo} al carrito`);
    navigate("/checkout");
  };

  /*const formatPrecio= (precio, moneda) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: moneda || 'ARS',
      minimumFractionDigits: 0
    }).format(precio);
  };*/

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
        {/* Sección de imágenes (thumbnails + imagen principal) */}
        <div className="thumbnails-column" role="tablist" aria-label="Miniaturas">
          {item.fotos?.map((f, idx) => (
            <button
              key={idx}
              className={`thumb-btn ${f === mainPhoto ? 'thumb-active' : ''}`}
              onClick={() => setMainPhoto(f)}
              aria-label={`Ver foto ${idx + 1}`}
              type="button"
            >
              <img src={f} alt={`${item.titulo} ${idx + 1}`} className="thumb-img" />
            </button>
          ))}
        </div>

        <div className="main-image-wrap">
          <img
            src={mainPhoto || item.fotos?.[0]}
            alt={item.titulo}
            className="item-main-imagen"
            loading="lazy"
          />
        </div>

        {/* Sección de información */}
        <div className="item-info">
          <h1 className="item-titulo">{item.titulo}</h1>
          <div className="item-vendedor">Vendido por: {item.vendedor}</div>
          
          {/* Tags de categorías */}
          {item.categorias && item.categorias.length > 0 && (
            <div className="tags-row">
              {item.categorias.map((categoria, idx) => (
                <span key={idx} className="tag-pill">{categoria}</span>
              ))}
            </div>
          )}

          <div className="item-descripcion">{item.descripcion}</div>

          <div className={`item-stock ${stockStatus.className}`}>
            {stockStatus.text}
          </div>

          <div className="item-precio">
            {formatPrecio(item.precio, item.moneda)}
          </div>

          <ul className="item-detalles">
            <li className="item-detalle">
              <span className="detalle-label">Stock disponible:</span>
              <span className="detalle-valor">{item.stock} unidades</span>
            </li>
            {item.marca && (
              <li className="item-detalle">
                <span className="detalle-label">Marca:</span>
                <span className="detalle-valor">{item.marca}</span>
              </li>
            )}
          </ul>

          {/* Controles de compra */}
          <div className="item-actions">
            <div className="cantidad-selector">
              <span className="cantidad-label">Cantidad:</span>
              <div className="controlers-cantidad" role="group" aria-label="Selector cantidad">
                <button
                  className="btn cantidad-btn"
                  onClick={() => handleCambioCantidad(-1)}
                  disabled={cantidad <= 1}
                  type="button"
                  aria-label="Disminuir cantidad"
                >
                  −
                </button>
                <span className="cantidad-value" aria-live="polite">{cantidad}</span>
                <button
                  className="btn cantidad-btn"
                  onClick={() => handleCambioCantidad(1)}
                  disabled={cantidad >= item.stock}
                  type="button"
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>
            </div>

            <button
              className="btn agregar-al-carrito-btn"
              onClick={handleAgregarAlCarrito}
              disabled={!item.activo || item.stock === 0}
              type="button"
            >
              Agregar al carrito
            </button>

            <button
              className="btn comprar-ahora-btn"
              onClick={handleComprarAhora}
              disabled={!item.activo || item.stock === 0}
              type="button"
            >
              Comprar ahora
            </button>
          </div>

          {/* Información adicional */}
          <div className="info-box">
            <h4>Envío gratis</h4>
            <p>En compras superiores a $50.000 pesos</p>
          </div>

          <div className="info-box">
            <h4>Devoluciones</h4>
            <p>Tenés 30 días para devolver el producto</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductoDetailPage
