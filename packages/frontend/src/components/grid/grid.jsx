
import React, { useRef } from 'react'
import './grid.css'

import ProductoCard from '../productoCard/productoCard.jsx'

const Grid = ({productos, actualizarCarrito}) => {
	return (
		<div className="grid-container">
			{productos && productos.length > 0 ? (
				productos.map((producto, index) => {
					const productoId = producto._id || producto.id || index;
					
					// Validar que las props sean del tipo correcto
					const props = {
						key: productoId,
						id: productoId,
						nombre: String(producto.titulo || ''),
						imagen: producto.fotos || [],
						precio: Number(producto.precio) || 0,
						producto: producto,
						actualizarCarrito: actualizarCarrito
					};
					
					return <ProductoCard {...props} />;
				})
			) : (
				<p>No hay productos</p>
			)}
		</div>
	);
};

export default Grid;