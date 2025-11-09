
import React, { useRef } from 'react'
import './grid.css'

import ProductoCard from '../productoCard/productoCard.jsx'

const Grid = ({productos, actualizarCarrito}) => {
	return (
		<div className="grid-container">
			{productos && productos.length > 0 ? (
				productos.map((producto) => {
					const props = {
						id: producto.id,
						nombre: String(producto.titulo || ''),
						imagen: producto.fotos || [],
						precio: Number(producto.precio) || 0,
						producto: producto,
						actualizarCarrito: actualizarCarrito
					};

					return <ProductoCard key={producto.id} {...props} />;
				})
			) : (
				<p>No hay productos</p>
			)}
		</div>
	);
};

export default Grid;
