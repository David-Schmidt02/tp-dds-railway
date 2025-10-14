import { Producto } from '../models/entities/producto.js';
import { ProductoRepository } from '../models/repositories/productoRepository.js';
import { ProductoInexistente, ProductoStockInsuficiente } from '../excepciones/producto.js';
import mongoose from 'mongoose';

export class ProductoService {
    constructor(productoRepository, usuarioRepository) {
        this.productoRepository = productoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    /**
     * Obtiene productos
     */
    async obtenerProductos(page, limit) {
        if (isNaN(page) || isNaN(limit)) {
            throw new Error("Los parámetros de paginación deben ser números");
        }

        if (page < 1 || limit < 1) {
            throw new Error("Los parámetros de paginación deben ser positivos");
        }
        try {const productos = await this.productoRepository.obtenerTodos(
                page,
                limit,
            );
            return productos;
        } catch (error) {
            console.error('Error al listar productos con filtros:', error.message);
            throw error;
        }
    }
    

    /**
     * Obtiene productos ordenados (con soporte para sessions)
     */
    async obtenerProductosOrdenados(page, limit, orden) {
        // Validaciones
        if (isNaN(page) || isNaN(limit)) {
            throw new Error("Los parámetros de paginación deben ser números");
        }

        if (page < 1 || limit < 1) {
            throw new Error("Los parámetros de paginación deben ser positivos");
        }

        let sort = {};

        switch (orden) {
            case 'precioAsc':
                sort = { precio: 1 };
                break;
            case 'precioDesc':
                sort = { precio: -1 };
                break;
            case 'masVendido':
                sort = { vendidos: -1 };
                break;
            default:
                sort = { createdAt: -1 };
        }

        try {
            const productos = await this.productoRepository.obtenerProductosOrdenados(page, limit, sort);
            return productos;
        } catch (error) {
            console.error('Error al obtener productos ordenados:', error.message);
            throw error;
        }
    }

    /**
     * Lista productos de un vendedor con filtros y paginación
     */
    async listarProductosVendedorConFiltros(filters, page, limit, orden) {
        // Validaciones
        if (isNaN(page) || isNaN(limit)) {
            throw new Error("Los parámetros de paginación deben ser números");
        }

        if (page < 1 || limit < 1) {
            throw new Error("Los parámetros de paginación deben ser positivos");
        }

        // Validar que el vendedor existe
        if (filters.vendedor) {
            await this.usuarioRepository.obtenerUsuarioPorId(filters.vendedor);
        }

        // Configurar ordenamiento
        let sort = {};
        switch (orden) {
            case "precioAsc":
                sort = { precio: 1 };
                break;
            case "precioDesc":
                sort = { precio: -1 };
                break;
            case "masVendido":
                sort = { vendidos: -1 };
                break;
            default:
                sort = { createdAt: -1 };
        }

        try {
            const productos = await this.productoRepository.findByFilters(
                filters,
                page,
                limit,
                sort
            );

            return productos;
        } catch (error) {
            console.error('Error al listar productos con filtros:', error.message);
            throw error;
        }
    }
    /**
     * Obtener un producto por ID (con soporte para sessions)
     */
    async obtenerProductoPorId(id, session = null) {
        try {
            return await this.productoRepository.obtenerProductoPorId(id, session);
        } catch (error) {
            console.error('Error al obtener producto por ID:', error.message);
            throw error;
        }
    }

    /**
     * Verificar stock disponible (con soporte para sessions)
     */
    async verificarStockDisponible(idProducto, session = null) {
        try {
            return await this.productoRepository.obtenerStockDisponible(idProducto, session);
        } catch (error) {
            console.error('Error al verificar stock:', error.message);
            throw error;
        }
    }
}



