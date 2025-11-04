import { Link } from "react-router-dom";

import "./productoCard.css";

const ProductoCard = ({ id, nombre, imagen, precio, stock, seleccionado, onSeleccionar }) => {
	return (
		<div className="producto-card-container">
			<div className="producto-image-container">
				<Link to={`/producto/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
					<img src={imagen} alt={nombre} className="producto-card-container-img" />
				</Link>
			</div>
			<div className="producto-info">
				<Link to={`/producto/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
					<h3>{nombre}</h3>
				</Link>
				<div className="precio-stock-container">
					<p className="price">${precio}</p>
					<p className="producto-stock">{stock > 0 ? "En stock" : "Sin stock"}</p>
				</div>
				<button className="btn add-cart-btn" onClick={onSeleccionar}>
					AGREGAR AL CARRITO
				</button>
			</div>
		</div>
	);
};

export default ProductoCard;
