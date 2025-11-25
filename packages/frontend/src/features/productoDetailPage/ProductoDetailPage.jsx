import { useState, useEffect } from 'react'
import { useCart } from '../../context/cartContext';
import { useNavigate, useParams } from 'react-router-dom'
import './ProductoDetailPage.css'
import ColumnaFotos from './Components/ColumnaFotos'
import { getProductoPorId } from '../../services/api'

const ProductoDetailPage = () => {
  const { carrito, actualizarCarrito, itemEnCarrito, crearItemCarrito } = useCart();
  const navigate = useNavigate();
  const { id } = useParams();

  // Estados
  const [cantidad, setcantidad] = useState(1);
  const [fotoprincipal, setFotoprincipal] = useState('');
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const cargarProducto = async () => {
      try {
        setLoading(true);
        setError(null);

        const producto = await getProductoPorId(id);
        setItem(producto);
        setFotoprincipal(producto.fotos?.[0] || '');
        setcantidad(1);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {

    cargarProducto();
  }, []);

  if (loading) {
    return (
      <div className="item-detalles-page">
        <div className="error-container">
          <p>Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="item-detalles-page">
        <div className="error-container">
          <h2>Producto no encontrado</h2>
          <p>El producto que buscás no existe.</p>
          <button onClick={() => navigate('/')} className="btn agregar-al-carrito-btn">
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

  const itemId = item?.id || item?._id || id;

  const handleAgregarAlCarrito = () => {
    const itemCarrito = crearItemCarrito({
      id: itemId,
      titulo: item.titulo,
      precio: item.precio,
      moneda: item.moneda,
      cantidad: cantidad,
      foto: fotoprincipal || item.fotos?.[0],
      stock: item.stock
    });
    actualizarCarrito(itemCarrito);
    console.log(`Agregando ${cantidad} unidad(es) de ${item.titulo} al carrito`);

    setcantidad(0);
  };

  const handleComprarAhora = () => {
    const itemCarrito = crearItemCarrito({
      id: itemId,
      titulo: item.titulo,
      precio: item.precio,
      moneda: item.moneda,
      cantidad: cantidad,
      foto: fotoprincipal || item.fotos?.[0],
      stock: item.stock
    });
    actualizarCarrito(itemCarrito);
    console.log(`Agregando ${cantidad} unidad(es) de ${item.titulo} al carrito`);
    navigate("/checkout");
  };

  const formatPrecio = (precio, moneda) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',  // estilo de moneda de formato precio 
      currency: moneda || 'ARS',  // moneda por defecto ARS
      minimumFractionDigits: 0  // setea sin decimeales
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
        
        
      <ColumnaFotos
          fotos={item.fotos || []}
          fotoprincipal={fotoprincipal}
          setFotoprincipal={setFotoprincipal}
          item={item}
        />
       
        <div className="item-info">
          <h1 className="item-titulo">{item.titulo}</h1>
          <div className="item-vendedor">Vendido por: {item.vendedor?.nombre || item.vendedor?.id || 'Desconocido'}</div>
          
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
                  disabled={cantidad + itemEnCarrito(itemId).cantidad >= item.stock}
                  type="button"
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>
            </div>

            <button
              className="btn comprar-ahora-btn"
              onClick={handleComprarAhora}
              disabled={!item.activo || item.stock === 0}
              type="button"
            >
              Comprar ahora
            </button>

            <button
              className="btn agregar-al-carrito-btn"
              onClick={handleAgregarAlCarrito}
              disabled={!item.activo || item.stock === 0}
              type="button"
            >
              Agregar al carrito
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
