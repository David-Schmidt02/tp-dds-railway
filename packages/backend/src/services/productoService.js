import { Producto } from '../dominio/producto.js';
import { ProductoRepository } from '../repositories/productoRepository.js';
import { ProductoInexistente, ProductoStockInsuficiente } from '../excepciones/producto.js';
import mongoose from 'mongoose';

export class ProductoService {
    constructor(productoRepository) {
        this.productoRepository = productoRepository;
    }

    /**
     * Obtiene productos con filtros opcionales (sin session - operación de solo lectura)
     */
    async obtenerProductos(vendedorId = null, filtros = {}) {
        try {
            // Si no hay filtros ni vendedorId, devolver todos los productos directamente
            if (!vendedorId && Object.keys(filtros).length === 0) {
                return await this.productoRepository.obtenerTodos();
            }

            // Si hay vendedorId específico, filtrar por vendedor
            let queryFilters = {};

            if (vendedorId) {
                queryFilters.vendedor = vendedorId;
            }

            // Aplicar filtros de búsqueda
            if (filtros.search) {
                const searchRegex = new RegExp(filtros.search, 'i'); // Case insensitive
                queryFilters.$or = [
                    { titulo: searchRegex },
                    { descripcion: searchRegex },
                    { categorias: searchRegex }
                ];
            }

            // Filtros de precio
            if (filtros.minPrice || filtros.maxPrice) {
                queryFilters.precio = {};
                if (filtros.minPrice) queryFilters.precio.$gte = Number(filtros.minPrice);
                if (filtros.maxPrice) queryFilters.precio.$lte = Number(filtros.maxPrice);
            }

            // Obtener todos los productos y aplicar filtros
            const productos = await this.productoRepository.obtenerTodos();
            return this.aplicarFiltrosEnMemoria(productos, queryFilters);

        } catch (error) {
            console.error('Error al obtener productos:', error.message);
            throw error;
        }
    }

    /**
     * Método auxiliar para aplicar filtros en memoria
     */
    aplicarFiltrosEnMemoria(productos, filtros) {
        return productos.filter(producto => {
            // Filtro por vendedor
            if (filtros.vendedor && producto.vendedor !== filtros.vendedor) {
                return false;
            }

            // Filtro por búsqueda
            if (filtros.$or) {
                const search = filtros.$or;
                const matchesSearch = search.some(condition => {
                    if (condition.titulo) return producto.titulo?.toLowerCase().includes(filtros.search?.toLowerCase());
                    if (condition.descripcion) return producto.descripcion?.toLowerCase().includes(filtros.search?.toLowerCase());
                    if (condition.categorias) return producto.categorias?.toLowerCase().includes(filtros.search?.toLowerCase());
                });
                if (!matchesSearch) return false;
            }

            // Filtros de precio
            if (filtros.precio) {
                if (filtros.precio.$gte && producto.precio < filtros.precio.$gte) return false;
                if (filtros.precio.$lte && producto.precio > filtros.precio.$lte) return false;
            }

            return true;
        });
    }

    /**
     * Obtiene productos ordenados (con soporte para sessions)
     */
    async obtenerProductosOrdenados(orden, session = null) {
        let sortOption = {};

        switch (orden) {
            case 'precioAsc':
                sortOption = { precio: 1 };
                break;
            case 'precioDesc':
                sortOption = { precio: -1 };
                break;
            case 'masVendido':
                sortOption = { vendidos: -1 };
                break;
            default:
                sortOption = { createdAt: -1 };
        }

        try {
            const productos = await this.productoRepository.obtenerProductosOrdenados(sortOption, session);
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
                sort = { cantidadVendida: -1 };
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
     * EJEMPLO: Transferir stock entre productos con transacción
     * Demuestra el uso correcto de sessions para operaciones que deben ser atómicas
     */
    async transferirStock(idProductoOrigen, idProductoDestino, cantidad) {
        const session = await mongoose.startSession();
        
        try {
            let resultado;
            
            await session.withTransaction(async () => {
                // PASO 1: Verificar que ambos productos existen
                const productoOrigen = await this.productoRepository.obtenerProductoPorId(idProductoOrigen, session);
                const productoDestino = await this.productoRepository.obtenerProductoPorId(idProductoDestino, session);
                
                if (!productoOrigen) {
                    throw new ProductoInexistente(`Producto origen ${idProductoOrigen} no encontrado`);
                }
                if (!productoDestino) {
                    throw new ProductoInexistente(`Producto destino ${idProductoDestino} no encontrado`);
                }

                // PASO 2: Verificar stock disponible en producto origen
                const stockOrigen = await this.productoRepository.obtenerStockDisponible(idProductoOrigen, session);
                if (stockOrigen < cantidad) {
                    throw new ProductoStockInsuficiente(
                        `Stock insuficiente en producto origen. Disponible: ${stockOrigen}, Solicitado: ${cantidad}`
                    );
                }
                
                // PASO 3: Realizar la transferencia atómica
                await this.productoRepository.reservarStock(idProductoOrigen, cantidad, session);
                await this.productoRepository.cancelarStock(idProductoDestino, cantidad, session);
                
                resultado = { 
                    success: true, 
                    mensaje: `Transferencia exitosa de ${cantidad} unidades`,
                    origen: { id: idProductoOrigen, stockRestante: stockOrigen - cantidad },
                    destino: { id: idProductoDestino }
                };
            });
            
            return resultado;
            
        } catch (error) {
            console.error('Error en transferencia de stock:', error.message);
            throw error;
        } finally {
            await session.endSession();
        }
    }

    /**
     * EJEMPLO: Actualizar múltiples productos con transacción
     * Útil para operaciones bulk que deben ser atómicas
     */
    async actualizarMultiplesProductos(actualizaciones) {
        const session = await mongoose.startSession();
        
        try {
            let resultados = [];
            
            await session.withTransaction(async () => {
                for (const actualizacion of actualizaciones) {
                    const { id, cambios } = actualizacion;
                    
                    // Verificar que el producto existe antes de actualizar
                    const producto = await this.productoRepository.obtenerProductoPorId(id, session);
                    if (!producto) {
                        throw new ProductoInexistente(`Producto ${id} no encontrado`);
                    }
                    
                    // Aplicar cambios (esto requeriría un método updateProducto en el repository)
                    // const productoActualizado = await this.productoRepository.actualizarProducto(id, cambios, session);
                    
                    resultados.push({
                        id,
                        status: 'actualizado',
                        cambios
                    });
                }
            });
            
            return {
                success: true,
                productosActualizados: resultados.length,
                detalles: resultados
            };
            
        } catch (error) {
            console.error('Error en actualización múltiple:', error.message);
            throw error;
        } finally {
            await session.endSession();
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



