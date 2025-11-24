import { Link } from "react-router-dom";
import { useState } from "react";
import "./productoCard.css";
import { useCart } from '../../context/cartContext';

const ProductoCard = ({ producto }) => {
	const [isAdded, setIsAdded] = useState(false);
	
	const { actualizarCarrito, crearItemCarrito } = useCart();
		

	const handleAgregarAlCarrito = () => {
		const itemCarrito = crearItemCarrito({
			id: producto.id,
			titulo: producto.titulo,
			precio: producto.precio,
			moneda: producto.moneda,
			cantidad: 1,
			foto: producto.fotos[0],
			stock: producto.stock
		});
		actualizarCarrito(itemCarrito);
		console.log(`Agregando 1 unidad de ${producto.titulo} al carrito`);

		setIsAdded(true);
  		setTimeout(() => setIsAdded(false), 1500);
	};

	return (
		<div className="wrapper">
			<div className="container">
				<div className="top">
					<Link
						to={`/producto/${producto.id}`}
						state={{ producto }}
					>
						<img
							src={producto.fotos[0] }
							alt={producto.titulo}
							className="producto-image"
						/>
					</Link>
				</div>
				<div className={`bottom ${isAdded ? 'clicked' : ''}`}>
					<div className="left">
						<div className="details">
							<h1>{String(producto.titulo)}</h1>
							<p>${String(producto.precio)}</p>
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
							<h1>{String(producto.titulo)}</h1>
							<p>Agregado al carrito</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductoCard;
