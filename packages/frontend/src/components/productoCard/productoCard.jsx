import { Link } from "react-router-dom";
import { useState } from "react";
import "./productoCard.css";

const ProductoCard = ({ id, nombre, imagen, precio, producto, actualizarCarrito}) => {
	const [isAdded, setIsAdded] = useState(false);

	const crearItemCarrito = () => {
		return {
			id: id,
			titulo: nombre,
			precio: precio,
			cantidad: 1,
			foto: Array.isArray(imagen) ? imagen[0] : imagen
		};
	};

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
					<Link 
						to={`/producto/${id}`} 
						state={{ 
							producto: {
								_id: String(producto._id),
								titulo: String(producto.titulo),
								descripcion: String(producto.descripcion || ''),
								precio: Number(producto.precio),
								moneda: String(producto.moneda || 'ARS'),
								stock: Number(producto.stock || 0),
								fotos: Array.isArray(producto.fotos) ? producto.fotos : [],
								categorias: Array.isArray(producto.categorias) ? producto.categorias : [],
								vendedor: String(producto.vendedor || ''),
								activo: Boolean(producto.activo)
							}
						}}
						style={{ textDecoration: 'none', color: 'inherit' }}
					>
						<img 
							src={Array.isArray(imagen) ? imagen[0] : imagen} 
							alt={nombre} 
							className="producto-image" 
						/>
					</Link>
				</div>
				<div className={`bottom ${isAdded ? 'clicked' : ''}`}>
					<div className="left">
						<div className="details">
							<h1>{String(nombre)}</h1>
							<p>${String(precio)}</p>
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
							<h1>{String(nombre)}</h1>
							<p>Agregado al carrito</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductoCard;
