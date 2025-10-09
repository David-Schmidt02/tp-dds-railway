export const configureRoutes = (app, {pedidoController, productoController, notificacionController}) => {
    app.get('/pedidos', pedidoController.obtenerPedidos.bind(pedidoController))
    app.post('/pedidos', pedidoController.crearPedido.bind(pedidoController))
    app.patch('/pedidos/:id', pedidoController.cancelarPedido.bind(pedidoController))
    //app.get('/pedidos/:id', pedidoController.consultarHistorialPedido.bind(pedidoController)) -> Terminar
    app.patch('/pedidos/:idPedido/itemsPedidos/:idItem', pedidoController.cambiarCantidadItem.bind(pedidoController))

    app.get('/productos', productoController.obtenerProductos.bind(productoController))
    app.get('/productos/ordenados', productoController.obtenerProductosOrdenados.bind(productoController));

    app.get('/notificaciones', notificacionController.obtenerNotificacionesDeUnUsuario.bind(notificacionController));
    app.patch('/notificaciones', notificacionController.marcarNotificacionComoLeida.bind(notificacionController));

    app.post('/usuarios', usuarioController.crearUsuario.bind(usuarioController));
}