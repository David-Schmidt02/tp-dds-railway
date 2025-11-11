import { Producto } from '../models/entities/producto.js';
import { ProductoRepository } from '../models/repositories/productoRepository.js';
import { ProductoInexistente, ProductoStockInsuficiente } from '../excepciones/producto.js';
import mongoose from 'mongoose';

export class ProductoService {
    constructor(productoRepository, usuarioRepository) {
        this.productoRepository = productoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    async listarProductosVendedorConFiltros(filters, page, limit, orden) {
        const {vendedor, categorias} = filters;
        
        if (vendedor) {
            await this.usuarioRepository.obtenerUsuarioPorId(vendedor);
        }
        
        if (categorias) {
            const categoriasArray = typeof categorias === "string"
                ? categorias.split(",")
                : categorias;

            filters.categorias = categoriasArray;
        }
        
        try {
            const productos = await this.productoRepository.findByFilters(
                filters,
                page,
                limit,
                orden
            );

            return productos;
        } catch (error) {
            console.error('Error al listar productos con filtros:', error.message);
            throw error;
        }
    }

    async ProductosConFiltros(filters, page, limit, orden) {
        const {vendedor, categorias} = filters;
        
        if (vendedor) {
            await this.usuarioRepository.obtenerUsuarioPorId(vendedor);
        }
        
        if (categorias) {
            const categoriasArray = typeof categorias === "string"
                ? categorias.split(",")
                : categorias;

            filters.categorias = categoriasArray;
        }

        try {
            const productos = await this.productoRepository.findByFilters(
                filters,
                page,
                limit,
                orden
            );
            return productos;
        } catch (error) {
            console.error('Error al listar productos con filtros:', error.message);
            throw error;
        }
    }


    
    async obtenerProductoPorId(id) {
        try {
            return await this.productoRepository.obtenerProductoPorId(id);
        } catch (error) {
            console.error('Error al obtener producto por ID:', error.message);
            throw error;
        }
    }

    async verificarStockDisponible(idProducto) {
        try {
            return await this.productoRepository.obtenerStockDisponible(idProducto);
        } catch (error) {
            console.error('Error al verificar stock:', error.message);
            throw error;
        }
    }

    async obtenerCategorias() {
        try {
            return await this.productoRepository.obtenerCategoriasUnicas();
        } catch (error) {
            console.error('Error al obtener categorías:', error.message);
            throw error;
        }
    }
}



