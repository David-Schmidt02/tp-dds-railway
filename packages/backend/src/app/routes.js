export const configureRoutes = (app, {pedidoController, productoController, notificacionesController}) => {
    app.get('/pedidos', pedidoController.obtenerPedidos.bind(pedidoController))
    app.post('/pedidos', pedidoController.crearPedido.bind(pedidoController))
    app.patch('/pedidos/:id', pedidoController.cancelarPedido.bind(pedidoController))
    //app.get('/pedidos/:id', pedidoController.consultarHistorialPedido.bind(pedidoController)) -> Terminar
    app.patch('/pedidos/:idPedido/itemsPedidos/:idItem', pedidoController.cambiarCantidadItem.bind(pedidoController))

    app.get('/productos', productoController.obtenerProductos.bind(productoController))
    app.get('/productos/ordenados', productoController.obtenerProductosOrdenados.bind(productoController));

    app.get('/notificaciones', notificacionesController.obtenerNotificacionesDeUnUsuario.bind(notificacionesController));
    app.patch('notificaciones', notificacionesController.marcarNotificacionComoLeida.bind(notificacionesController));
}