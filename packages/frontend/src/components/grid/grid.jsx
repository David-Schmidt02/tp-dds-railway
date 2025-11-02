
import React, { useRef } from 'react'
import './grid.css'
import productosItems from '../../mockData/mockDataProductos.js'
import ProductoCard from '../productoCard/productoCard.jsx'

const Grid = () => {
	return (
		<div className="grid-container">
			{productosItems.map(producto => (
				<ProductoCard
					key={producto.id}
					id={producto.id}
					nombre={producto.title}
					imagen={producto.image}
					precio={producto.price}
					stock={producto.stock}
					seleccionado={producto.seleccionado}
					onSeleccionar={() => {}}
				/>
			))}
		</div>
	);
};

export default Grid;