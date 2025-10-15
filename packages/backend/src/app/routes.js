import { pedidoErrorHandler } from '../middlewares/pedidoErrorHandler.js';
import { productoErrorHandler } from '../middlewares/productoErrorHandler.js';
import { notificacionErrorHandler } from '../middlewares/notificacionErrorHandler.js';
import { usuarioErrorHandler } from '../middlewares/usuarioErrorHandler.js';

export const configureRoutes = (app, {pedidoController, productoController, notificacionController, usuarioController}) => {
    app.get('/pedidos', pedidoController.obtenerPedidos.bind(pedidoController), pedidoErrorHandler)
    app.post('/pedidos', pedidoController.crearPedido.bind(pedidoController), pedidoErrorHandler)
    app.get('/usuarios/pedidos', pedidoController.consultarHistorialPedido.bind(pedidoController), pedidoErrorHandler)
    app.patch('/pedidos/:id', pedidoController.cancelarPedido.bind(pedidoController), pedidoErrorHandler)
    app.patch('/pedidos/:idPedido/itemsPedidos/:idItem', pedidoController.cambiarCantidadItem.bind(pedidoController), pedidoErrorHandler)

    app.get('/productos', productoController.obtenerProductos.bind(productoController), productoErrorHandler)
    //app.get('/productos/ordenados', productoController.obtenerProductosOrdenados.bind(productoController), productoErrorHandler);
    app.get('/productos/vendedor', productoController.listarProductosVendedorConFiltros.bind(productoController), productoErrorHandler);

    app.get('/notificaciones', notificacionController.obtenerNotificacionesDeUnUsuario.bind(notificacionController), notificacionErrorHandler);
    app.patch('/notificaciones', notificacionController.marcarNotificacionComoLeida.bind(notificacionController), notificacionErrorHandler);

    app.post('/usuarios', usuarioController.crearUsuario.bind(usuarioController), usuarioErrorHandler);
    app.get('/usuarios', usuarioController.obtenerUsuarios.bind(usuarioController), usuarioErrorHandler);

}