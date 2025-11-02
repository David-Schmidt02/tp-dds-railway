import React from "react";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";

const ProductoDetailPage = () => {
  const { id } = useParams();
  const { productos } = useContext(CartContext);
  const producto = productos.find(p => p.id === Number(id));

  if (!producto) {
    return <div>Producto no encontrado</div>;
  }

  return (
    <div className="detalle-container">
      <img src={producto.imagen} alt={producto.nombre} style={{ width: "300px", height: "300px", objectFit: "contain" }} />
      <h2>{producto.nombre}</h2>
      <p className="price">${producto.precio}</p>
      <p>ID: {producto.id}</p>
      {/* Agrega más detalles si es necesario */}
    </div>
  );
};

export default ProductoDetailPage;
