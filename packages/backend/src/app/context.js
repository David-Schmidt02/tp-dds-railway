// Repositorios
import { NotificacionesRepository } from "../repositories/notificacionRepository.js";
import { PedidoRepository } from "../repositories/pedidoRepository.js";
import { ProductoRepository } from "../repositories/productoRepository.js";
import { UsuariosRepository } from "../repositories/usuarioRepository.js";

// Services
import { PedidoService } from "../services/pedidoService.js";
// import { ProductoService } from "../services/productoService.js";
// import { NotificacionService } from "../services/notifica.js";
// import { UsuarioService } from "../services/usuarioService.js";

// Controllers
import { PedidoController } from "../controllers/pedidoController.js";
// import { ProductoController } from "../controllers/productoController.js";
// import { UsuarioController } from "../controllers/usuarioController.js";
// import { NotificacionController } from "../controllers/notificacionController.js";


const DB_NAME = "pedidosDelSol"

export const buildAppContext = (DB_CLIENT) => {
    const db = DB_CLIENT.db(DB_NAME)
    const pedidoRepository = new PedidoRepository();
    const productoRepository = ProductoRepository;
    const pedidoService = new PedidoService(pedidoRepository, productoRepository);
    const pedidoController = new PedidoController(pedidoService);

  return {
    pedidoRepository,
    productoRepository,
    pedidoService,
    pedidoController
  };
};