
import React, { useRef } from 'react'
import './grid.css'
import productosItems from '../../mockData/mockDataProductos.js'
import ProductoCard from '../productoCard/productoCard.jsx'

const Grid = ({actualizarCarrito}) => {
	return (
		<div className="grid-container">
			{productosItems.map(producto => (
				<ProductoCard
					id={producto.id}
					nombre={producto.titulo}
					imagen={producto.fotos}
					precio={producto.precio}
					seleccionado={producto.seleccionado}
					onSeleccionar={() => {}}
					actualizarCarrito={actualizarCarrito}
				/>
			))}
		</div>
	);
};

export default Grid;