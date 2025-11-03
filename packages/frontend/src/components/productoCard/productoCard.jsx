import { Link } from "react-router-dom";

import "./productoCard.css";

const ProductoCard = ({ id, nombre, imagen, precio, stock, seleccionado, onSeleccionar }) => {
	return (
		<div className="producto-card-container">
			 <Link to={`/producto/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
     			 <img src={imagen} alt={nombre} className="producto-card-container-img" />
     			 <h3>{nombre}</h3>
     			<p className="price">${precio}</p>
    		</Link>
    		<div className="producto-info">
    		 
   			  <p className="producto-stock">{stock > 0 ? "En stock" : "Sin stock"}</p>
     		  <button className="btn add-cart-btn" onClick={onSeleccionar}>Agregar al carrito</button>
      		  
    		</div>
		</div>
	);
};

export default ProductoCard;
