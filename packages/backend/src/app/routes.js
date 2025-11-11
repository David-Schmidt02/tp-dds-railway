import { pedidoErrorHandler } from '../middlewares/pedidoErrorHandler.js';
import { productoErrorHandler } from '../middlewares/productoErrorHandler.js';
import { notificacionErrorHandler } from '../middlewares/notificacionErrorHandler.js';
import { usuarioErrorHandler } from '../middlewares/usuarioErrorHandler.js';
import { producto } from '../controllers/productoController.js';

export const configureRoutes = (app, {pedidoController, productoController, notificacionController, usuarioController}) => {
    app.get('/pedidos', pedidoController.obtenerPedidos.bind(pedidoController), pedidoErrorHandler)
    app.post('/pedidos', pedidoController.crearPedido.bind(pedidoController), pedidoErrorHandler)
    app.get('/usuarios/:usuarioId/pedidos', pedidoController.pedidosDeUsuario.bind(pedidoController), pedidoErrorHandler)
    app.patch('/pedidos/:pedidoId', pedidoController.cancelarPedido.bind(pedidoController), pedidoErrorHandler)
    app.patch('/pedidos/:idPedido/itemsPedido/:idProducto', pedidoController.cambiarCantidadItem.bind(pedidoController), pedidoErrorHandler)

    app.get('/vendedor/:idVendedor/productos', productoController.listarProductosVendedorConFiltros.bind(productoController), productoErrorHandler);
    app.get('/categorias', productoController.obtenerCategorias.bind(productoController), productoErrorHandler);
    app.get('/productos/:id', productoController.obtenerProductoPorId.bind(productoController), productoErrorHandler);
    app.get('/productos', productoController.productosConFiltros.bind(productoController), productoErrorHandler);

    app.get('/notificaciones/:idUsuario', notificacionController.obtenerNotificacionesDeUnUsuario.bind(notificacionController), notificacionErrorHandler);
    app.patch('/notificaciones/:idNotificacion', notificacionController.marcarNotificacionComoLeida.bind(notificacionController), notificacionErrorHandler);

    app.post('/usuarios', usuarioController.crearUsuario.bind(usuarioController), usuarioErrorHandler);
    app.get('/usuarios', usuarioController.obtenerUsuarios.bind(usuarioController), usuarioErrorHandler);
    app.get('/vendedores', usuarioController.obtenerVendedores.bind(usuarioController), usuarioErrorHandler);

}