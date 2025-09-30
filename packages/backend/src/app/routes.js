export const configureRoutes = (app, {pedidoController, productoController}) => {
    app.post('/pedidos', pedidoController.crearPedido.bind(pedidoController))
    app.post('/pedidos', pedidoController.obtenerPedidos.bind(pedidoController))
    app.delete('/pedidos', pedidoController.cancelarPedido.bind(pedidoController))
    app.get('/productos', productoController.obtenerProductos.bind(productoController))
}

