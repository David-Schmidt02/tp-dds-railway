import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
	// Cargar carrito desde localStorage al inicializar
	const [carrito, setCarrito] = useState(() => {
		try {
			const carritoGuardado = localStorage.getItem('carrito');
			return carritoGuardado ? JSON.parse(carritoGuardado) : [];
		} catch (error) {
			console.error('Error al cargar carrito desde localStorage:', error);
			return [];
		}
	});

	// Guardar carrito en localStorage cada vez que cambie
	useEffect(() => {
		localStorage.setItem('carrito', JSON.stringify(carrito));
	}, [carrito]);

	const actualizarCarrito = (producto) => {
		const productoExistente = carrito.find(item => item.id === producto.id);
		if (productoExistente) {
			setCarrito(
				carrito.map(item =>
					item.id === producto.id
						? { ...item, cantidad: item.cantidad + (producto.cantidad) }
						: item
				)
			);
		} else {
			setCarrito([...carrito, { ...producto, cantidad: producto.cantidad || 1 }]);
		}
	};

	const limpiarCarrito = () => {
		setCarrito([]);
	};

	const eliminarDelCarrito = (id) => {
		setCarrito(carrito.filter(producto => producto.id !== id));
	};

    const actualizarCantidadCarrito = ({ id, cantidad }) => {
        setCarrito(carrito.map(item =>
            item.id === id ? { ...item, cantidad } : item
        ));
    };

	// Devuelve el item en el carrito por id
	const itemEnCarrito = (id) => {
		if (!id) return { cantidad: 0 };
		const productoEnCarrito = carrito.find(prod => prod.id === id);
		return productoEnCarrito || { cantidad: 0 };
	};

	// Crea un objeto item para el carrito
	const crearItemCarrito = ({ id, titulo, precio, moneda, cantidad, foto, stock }) => ({
		id,
		titulo,
		precio,
		moneda,
		cantidad,
		foto,
		stock
	});

	// Acciones para el carrito
	const aumentarCantidad = (producto) => {
		if (producto.cantidad < producto.stock) {
			const nuevoProducto = { ...producto, cantidad: (producto.cantidad || 1) + 1 };
			actualizarCarrito(nuevoProducto);
		}
	};

	const disminuirCantidad = (producto) => {
		if ((producto.cantidad || 1) > 1) {
			const nuevoProducto = { ...producto, cantidad: (producto.cantidad || 1) - 1 };
			actualizarCarrito(nuevoProducto);
		}
	};

	const calcularTotal = () => {
		return carrito.reduce((total, producto) => {
			const cantidad = producto.cantidad;
			const precio = producto.precio;
			return total + (cantidad * precio);
		}, 0);
	};

	const cantidadTotal = () => {
		return carrito.reduce((total, producto) => {
			return total + (producto.cantidad || 1);
		}, 0);
	};

	return (
		<CartContext.Provider value={{
			carrito,
			actualizarCarrito,
			limpiarCarrito,
			eliminarDelCarrito,
			actualizarCantidadCarrito,
			itemEnCarrito,
			crearItemCarrito,
			aumentarCantidad,
			disminuirCantidad,
			calcularTotal,
			cantidadTotal
		}}>
			{children}
		</CartContext.Provider>
	);
};

export const useCart = () => useContext(CartContext);
