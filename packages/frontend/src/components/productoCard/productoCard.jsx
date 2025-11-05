import { Link } from "react-router-dom";
import { useState } from "react";
import "./productoCard.css";

const ProductoCard = ({ id, nombre, imagen, precio, stock, seleccionado, onSeleccionar }) => {
	const [isAdded, setIsAdded] = useState(false);

	const handleAddToCart = () => {
		setIsAdded(true);
		onSeleccionar();
		// Reset after animation
		setTimeout(() => setIsAdded(false), 3000);
	};

	const handleRemoveFromCart = () => {
		setIsAdded(false);
		// Here you could call a remove function if needed
	};

	return (
		<div className="wrapper">
			<div className="container">
				<div className="top">
					<Link to={`/producto/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
						<img src={imagen} alt={nombre} className="producto-image" />
					</Link>
				</div>
				<div className={`bottom ${isAdded ? 'clicked' : ''}`}>
					<div className="left">
						<div className="details">
							<h1>{nombre}</h1>
							<p>${precio}</p>
						</div>
						<div className="buy" onClick={handleAddToCart}>
							<i className="material-icons">add_shopping_cart</i>
						</div>
					</div>
					<div className="right">
						<div className="done">
							<i className="material-icons">done</i>
						</div>
						<div className="details">
							<h1>{nombre}</h1>
							<p>Agregado al carrito</p>
						</div>
						<div className="remove" onClick={handleRemoveFromCart}>
							<i className="material-icons">clear</i>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductoCard;
