// Repositorios
import { NotificacionRepository } from "../repositories/notificacionRepository.js";
import { PedidoRepository } from "../repositories/pedidoRepository.js";
import { ProductoRepository } from "../repositories/productoRepository.js";
import { UsuarioRepository } from "../repositories/usuarioRepository.js";

// Services
import { PedidoService } from "../services/pedidoService.js";
import { ProductoService } from "../services/productoService.js";
import { UsuarioService } from "../services/usuarioService.js";

// Controllers
import { PedidoController } from "../controllers/pedidoController.js";
import { ProductoController } from "../controllers/productoController.js";
import { UsuarioController } from "../controllers/usuarioController.js";
import { NotificacionController } from "../controllers/notificacionController.js";

import mongoose from 'mongoose';

const DB_NAME = "local"

export const buildAppContext = () => {
    const pedidoRepository = new PedidoRepository();
    const productoRepository = new ProductoRepository();
    const usuarioRepository = new UsuarioRepository();
    const notificacionRepository = new NotificacionRepository();
    
    // Services
    const pedidoService = new PedidoService(pedidoRepository, productoRepository, notificacionRepository);
    const productoService = new ProductoService(productoRepository);
    const usuarioService = new UsuarioService(usuarioRepository);
    
    // Controllers
    const pedidoController = new PedidoController(pedidoService);
    const productoController = new ProductoController(productoService);
    const usuarioController = new UsuarioController(usuarioService);
    const notificacionController = new NotificacionController(notificacionRepository);

    return {
        pedidoRepository,
        productoRepository,
        usuarioRepository,
        notificacionRepository,
        pedidoService,
        productoService,
        usuarioService,
        pedidoController,
        productoController,
        usuarioController,
        notificacionController
    };
};