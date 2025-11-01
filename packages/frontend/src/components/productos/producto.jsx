import React, { useContext } from "react";
import "./productos.css";

import { CartContext } from "../../context/CartContext";

const ProductoCard = ({ nombre, imagen, precio, seleccionado, onSeleccionar }) => {
	return (
		<div className={`box${seleccionado ? " selected" : ""}`} onClick={onSeleccionar}>
			<img src={imagen} alt={nombre} style={{ width: "100%", height: "120px", objectFit: "contain" }} />
			<h3>{nombre}</h3>
			<p className="price">${precio}</p>
		</div>
	);
};


const Productos = () => {
	const { productos, seleccionarProducto } = useContext(CartContext);

	return (
		<div className="grid-container">
			{productos.map(producto => (
				<ProductoCard
					key={producto.id}
					nombre={producto.nombre}
					imagen={producto.imagen}
					precio={producto.precio}
					seleccionado={producto.seleccionado}
					onSeleccionar={() => seleccionarProducto(producto.id)}
				/>
			))}
		</div>
	);
};

export default Productos;
