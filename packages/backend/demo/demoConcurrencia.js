/**
 * Script de demostración del sistema de pedidos con manejo de concurrencia
 * 
 * Este script muestra cómo funciona el sistema para prevenir overselling
 * en escenarios de alta concurrencia
 */

import { MongoClient } from 'mongodb';
import { ProductoRepository } from '../src/repositories/productoRepository.js';
import { PedidoRepository } from '../src/repositories/pedidoRepository.js';
import { PedidoService } from '../src/services/pedidoService.js';
import { PedidoController } from '../src/controllers/pedidoController.js';

// Configuración de demo
const DEMO_CONFIG = {
    mongoUrl: 'mongodb://localhost:27017',
    dbName: 'tienda_demo',
    productoId: 'demo_producto_123'
};

/**
 * Configura productos de prueba con stock limitado
 */
async function configurarProductosDemo(productoRepo) {
    console.log('📦 Configurando productos de demostración...');
    
    const productosDemo = [
        {
            _id: DEMO_CONFIG.productoId,
            titulo: 'Producto Demo - Stock Limitado',
            descripcion: 'Producto para demostrar manejo de concurrencia',
            precio: 100.00,
            stock: 5, // Stock muy limitado para demostrar concurrencia
            moneda: 'ARS',
            activo: true,
            vendedor: 'Demo Store',
            categorias: ['Demo', 'Testing']
        }
    ];
    
    for (const producto of productosDemo) {
        try {
            await productoRepo.productos.replaceOne(
                { _id: producto._id }, 
                producto, 
                { upsert: true }
            );
            console.log(`✅ Producto creado: ${producto.titulo} (Stock: ${producto.stock})`);
        } catch (error) {
            console.log(`⚠️ Producto ya existe: ${producto.titulo}`);
        }
    }
}

/**
 * Simula múltiples clientes intentando comprar simultáneamente
 */
async function simularClientesConcurrentes(pedidoService, cantidadClientes = 8) {
    console.log(`\n👥 Simulando ${cantidadClientes} clientes comprando simultáneamente...`);
    console.log('Stock disponible: 5 unidades');
    console.log('Cada cliente solicita: 1 unidad');
    console.log('Resultado esperado: máximo 5 pedidos exitosos\n');
    
    const crearPedidoCliente = async (numeroCliente) => {
        const pedidoData = {
            comprador: {
                id: `cliente_${numeroCliente}`,
                nombre: `Cliente ${numeroCliente}`,
                email: `cliente${numeroCliente}@demo.com`
            },
            items: [
                {
                    producto: { id: DEMO_CONFIG.productoId },
                    cantidad: 1
                }
            ],
            moneda: { 
                codigo: "ARS", 
                simbolo: "$", 
                nombre: "Peso Argentino" 
            },
            direccionEntrega: {
                calle: "Calle Demo",
                numero: numeroCliente,
                ciudad: "Buenos Aires",
                provincia: "CABA",
                pais: "Argentina",
                codigoPostal: "1000"
            }
        };
        
        try {
            const resultado = await pedidoService.crearPedido(pedidoData);
            return {
                cliente: numeroCliente,
                exito: true,
                pedidoId: resultado.id,
                mensaje: 'Pedido creado exitosamente'
            };
        } catch (error) {
            return {
                cliente: numeroCliente,
                exito: false,
                error: error.constructor.name,
                mensaje: error.message
            };
        }
    };
    
    // Ejecutar todas las compras simultáneamente
    const promesasPedidos = Array.from({ length: cantidadClientes }, (_, i) => 
        crearPedidoCliente(i + 1)
    );
    
    const resultados = await Promise.all(promesasPedidos);
    
    // Analizar resultados
    const exitosos = resultados.filter(r => r.exito);
    const fallidos = resultados.filter(r => !r.exito);
    
    console.log('📊 RESULTADOS DE LA SIMULACIÓN:');
    console.log('================================');
    console.log(`✅ Pedidos exitosos: ${exitosos.length}`);
    console.log(`❌ Pedidos fallidos: ${fallidos.length}`);
    console.log(`🔒 Integridad del stock: ${exitosos.length <= 5 ? 'PRESERVADA ✅' : 'VIOLADA ❌'}`);
    
    console.log('\n📋 Detalle por cliente:');
    resultados.forEach(resultado => {
        const icono = resultado.exito ? '✅' : '❌';
        const mensaje = resultado.exito ? 
            `Pedido ${resultado.pedidoId}` : 
            resultado.mensaje;
        console.log(`${icono} Cliente ${resultado.cliente}: ${mensaje}`);
    });
    
    return { exitosos: exitosos.length, fallidos: fallidos.length };
}

/**
 * Verifica el stock final después de las operaciones
 */
async function verificarStockFinal(productoRepo) {
    console.log('\n🔍 Verificando stock final...');
    
    try {
        const producto = await productoRepo.obtenerProductoPorId(DEMO_CONFIG.productoId);
        console.log(`📦 Stock restante: ${producto.stock} unidades`);
        console.log(`💰 Precio: $${producto.precio}`);
        
        return producto.stock;
    } catch (error) {
        console.error('❌ Error verificando stock:', error.message);
        return null;
    }
}

/**
 * Función principal de demostración
 */
async function ejecutarDemo() {
    console.log('🚀 INICIANDO DEMOSTRACIÓN DE CONCURRENCIA');
    console.log('==========================================\n');
    
    let client;
    
    try {
        // Conectar a MongoDB
        console.log('🔌 Conectando a MongoDB...');
        client = new MongoClient(DEMO_CONFIG.mongoUrl);
        await client.connect();
        
        const db = client.db(DEMO_CONFIG.dbName);
        
        // Configurar repositorios y servicios
        const productoRepo = new ProductoRepository(db);
        const pedidoRepo = new PedidoRepository(db);
        const pedidoService = new PedidoService(pedidoRepo, productoRepo, db);
        
        // Configurar datos de prueba
        await configurarProductosDemo(productoRepo);
        
        // Verificar stock inicial
        console.log('\n📋 Stock inicial:');
        const stockInicial = await verificarStockFinal(productoRepo);
        
        // Simular concurrencia
        const resultados = await simularClientesConcurrentes(pedidoService, 8);
        
        // Verificar stock final
        const stockFinal = await verificarStockFinal(productoRepo);
        
        // Validar integridad
        const stockConsumido = stockInicial - stockFinal;
        const integridadOK = stockConsumido === resultados.exitosos;
        
        console.log('\n🏁 RESUMEN FINAL:');
        console.log('==================');
        console.log(`Stock inicial: ${stockInicial}`);
        console.log(`Stock final: ${stockFinal}`);
        console.log(`Stock consumido: ${stockConsumido}`);
        console.log(`Pedidos exitosos: ${resultados.exitosos}`);
        console.log(`Integridad: ${integridadOK ? '✅ CORRECTA' : '❌ VIOLADA'}`);
        
        if (integridadOK) {
            console.log('\n🎉 ¡El sistema previno correctamente el overselling!');
            console.log('✅ Los mecanismos de concurrencia funcionan correctamente.');
        } else {
            console.log('\n⚠️ Se detectó una inconsistencia en el manejo de stock.');
        }
        
    } catch (error) {
        console.error('💥 Error durante la demostración:', error.message);
    } finally {
        if (client) {
            await client.close();
            console.log('\n🔌 Conexión cerrada.');
        }
    }
}

/**
 * Ejecutar demo si se llama directamente
 */
if (import.meta.url === `file://${process.argv[1]}`) {
    ejecutarDemo().catch(console.error);
}

export { ejecutarDemo, simularClientesConcurrentes, configurarProductosDemo };