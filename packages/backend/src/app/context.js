// Repositorios
import { NotificacionRepository } from "../models/repositories/notificacionRepository.js";
import { PedidoRepository } from "../models/repositories/pedidoRepository.js";
import { ProductoRepository } from "../models/repositories/productoRepository.js";
import { UsuarioRepository } from "../models/repositories/usuarioRepository.js";

// Services
import { PedidoService } from "../services/pedidoService.js";
import { ProductoService } from "../services/productoService.js";
import { UsuarioService } from "../services/usuarioService.js";
import { NotificacionService } from "../services/notificacionService.js";

// Controllers
import { PedidoController } from "../controllers/pedidoController.js";
import { ProductoController } from "../controllers/productoController.js";
import { UsuarioController } from "../controllers/usuarioController.js";
import { NotificacionController } from "../controllers/notificacionController.js";

import mongoose from 'mongoose';

const DB_NAME = "local"

export const buildAppContext = () => {
    const productoRepository = new ProductoRepository();
    const pedidoRepository = new PedidoRepository(productoRepository);
    const usuarioRepository = new UsuarioRepository();
    const notificacionRepository = new NotificacionRepository();
    
    // Services
    const pedidoService = new PedidoService(pedidoRepository, productoRepository, notificacionRepository, usuarioRepository);
    const productoService = new ProductoService(productoRepository, usuarioRepository);
    const usuarioService = new UsuarioService(usuarioRepository);
    const notificacionService = new NotificacionService(notificacionRepository, usuarioRepository);
    
    // Controllers
    const pedidoController = new PedidoController(pedidoService);
    const productoController = new ProductoController(productoService);
    const usuarioController = new UsuarioController(usuarioService);
    const notificacionController = new NotificacionController(notificacionService);

    return {
        pedidoRepository,
        productoRepository,
        usuarioRepository,
        notificacionRepository,
        pedidoService,
        productoService,
        usuarioService,
        notificacionService,
        pedidoController,
        productoController,
        usuarioController,
        notificacionController
    };
};