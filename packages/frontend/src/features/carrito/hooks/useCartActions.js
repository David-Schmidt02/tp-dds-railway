export const useCartActions = (carrito, actualizarCarrito) => {
  
  const aumentarCantidad = (producto) => {
    if (producto.cantidad < producto.stock){
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

  return {
    aumentarCantidad,
    disminuirCantidad,
    calcularTotal,
    cantidadTotal
  };
};
