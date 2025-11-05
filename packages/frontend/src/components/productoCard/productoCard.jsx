import { Link } from "react-router-dom";
import { useState } from "react";
import "./productoCard.css";

const ProductoCard = ({ id, nombre, imagen, precio, actualizarCarrito}) => {
	const [isAdded, setIsAdded] = useState(false);

	  const crearItemCarrito = () => ({
		id: id,
		titulo: nombre,
		precio: precio,
		//moneda: item.moneda,
		cantidad: 1,
		foto: imagen
	});

	const handleAgregarAlCarrito = () => {
		const itemCarrito = crearItemCarrito();
		actualizarCarrito(itemCarrito);
		console.log(`Agregando 1 unidad de ${nombre} al carrito`);

		setIsAdded(true);
  		setTimeout(() => setIsAdded(false), 3000);
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
						<div className="buy" onClick={handleAgregarAlCarrito}>
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
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductoCard;
