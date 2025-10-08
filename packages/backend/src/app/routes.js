export const configureRoutes = (app, {pedidoController, productoController}) => {
    app.get('/pedidos', pedidoController.obtenerPedidos.bind(pedidoController))
    app.post('/pedidos', pedidoController.crearPedido.bind(pedidoController))
    app.patch('/pedidos/:id', pedidoController.cancelarPedido.bind(pedidoController))
    //app.get('/pedidos/:id', pedidoController.consultarHistorialPedido.bind(pedidoController)) -> Terminar
    app.patch('/pedidos/:idPedido/itemsPedidos/:idItem', pedidoController.cambiarCantidadItem.bind(pedidoController))

    app.get('/productos', productoController.obtenerProductos.bind(productoController))
}