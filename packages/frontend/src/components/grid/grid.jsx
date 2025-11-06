
import React, { useRef } from 'react'
import './grid.css'

import ProductoCard from '../productoCard/productoCard.jsx'

const Grid = ({productos, actualizarCarrito}) => {
	return (
		<div className="grid-container">
			{productos.map(producto => (
				<ProductoCard
					id={producto.id}
					nombre={producto.titulo}
					imagen={producto.fotos}
					precio={producto.precio}
					actualizarCarrito={actualizarCarrito}
				/>
			))}
		</div>
	);
};

export default Grid;