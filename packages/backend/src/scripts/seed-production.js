import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectToDB } from '../app/db.js';
import { ProductoModel } from '../schema/productoSchema.js';
import { UsuarioModel } from '../schema/usuarioSchema.js';

dotenv.config();

// Usuario por defecto para el frontend
const USUARIO_DEFAULT_ID = '6560f1a1e4b0a1b2c3d4e5f3';

const usuarios = [
  {
    _id: new mongoose.Types.ObjectId(USUARIO_DEFAULT_ID),
    nombre: 'Usuario Default',
    email: 'usuario@default.com',
    telefono: '+54 11 1234-5678',
    tipoUsuario: 'COMPRADOR'
  },
  {
    nombre: 'SportMax',
    email: 'contacto@sportmax.com',
    telefono: '+54 11 5555-1111',
    tipoUsuario: 'VENDEDOR'
  },
  {
    nombre: 'Moda Urbana',
    email: 'ventas@modaurbana.com',
    telefono: '+54 11 5555-2222',
    tipoUsuario: 'VENDEDOR'
  },
  {
    nombre: 'Tech Store',
    email: 'info@techstore.com',
    telefono: '+54 11 5555-3333',
    tipoUsuario: 'VENDEDOR'
  }
];

async function seedDatabase() {
  try {
    console.log('🚀 Iniciando seed de la base de datos...\n');
    console.log('Conectando a MongoDB...');
    await connectToDB(process.env.DB_URI);
    console.log('✓ Conectado exitosamente\n');

    // Limpiar datos existentes
    console.log('Limpiando datos existentes...');
    await UsuarioModel.deleteMany({});
    await ProductoModel.deleteMany({});
    console.log('✓ Datos limpiados\n');

    // Insertar usuarios
    console.log('Insertando usuarios...');
    const usuariosInsertados = await UsuarioModel.insertMany(usuarios);
    console.log(`✓ ${usuariosInsertados.length} usuarios insertados:`);
    usuariosInsertados.forEach(u => {
      console.log(`  - ${u.nombre} (${u.tipoUsuario}) - ${u.email}`);
    });
    console.log('');

    // Obtener vendedores
    const [sportmax, modaUrbana, techStore] = usuariosInsertados.filter(
      u => u.tipoUsuario === 'VENDEDOR'
    );

    // Productos de SportMax
    const productosSportMax = [
      {
        titulo: "Zapatillas Running Pro",
        descripcion: "Zapatillas deportivas con amortiguación especial, ideales para running",
        precio: 35000,
        moneda: "ARS",
        stock: 15,
        vendidos: 28,
        categorias: ["calzado", "deportivo"],
        fotos: ["https://picsum.photos/seed/zapatillas-run-1/800/800"],
        activo: true,
        vendedor: sportmax._id
      },
      {
        titulo: "Short Deportivo DryFit",
        descripcion: "Short deportivo de tela técnica que absorbe la humedad",
        precio: 9500,
        moneda: "ARS",
        stock: 20,
        vendidos: 15,
        categorias: ["pantalones", "deportivo"],
        fotos: ["https://picsum.photos/seed/short-deport-1/800/800"],
        activo: true,
        vendedor: sportmax._id
      },
      {
        titulo: "Remera Técnica Sport",
        descripcion: "Remera de poliéster transpirable, ideal para entrenar",
        precio: 11000,
        moneda: "ARS",
        stock: 25,
        vendidos: 22,
        categorias: ["remeras", "deportivo"],
        fotos: ["https://picsum.photos/seed/remera-sport-1/800/800"],
        activo: true,
        vendedor: sportmax._id
      }
    ];

    // Productos de Moda Urbana
    const productosModaUrbana = [
      {
        titulo: "Jean Recto Clásico",
        descripcion: "Jean de corte recto, denim lavado, color azul medio",
        precio: 27000,
        moneda: "ARS",
        stock: 12,
        vendidos: 16,
        categorias: ["pantalones", "jeans"],
        fotos: ["https://picsum.photos/seed/jean-recto-1/800/800"],
        activo: true,
        vendedor: modaUrbana._id
      },
      {
        titulo: "Camisa Estampada Tropical",
        descripcion: "Camisa de manga corta con estampado de hojas tropicales",
        precio: 19500,
        moneda: "ARS",
        stock: 8,
        vendidos: 9,
        categorias: ["camisas", "verano"],
        fotos: ["https://picsum.photos/seed/camisa-tropical-1/800/800"],
        activo: true,
        vendedor: modaUrbana._id
      },
      {
        titulo: "Buzo Urbano con Capucha",
        descripcion: "Buzo estilo streetwear, capucha ajustable, bolsillo canguro",
        precio: 24000,
        moneda: "ARS",
        stock: 14,
        vendidos: 11,
        categorias: ["buzos", "urbano"],
        fotos: ["https://picsum.photos/seed/buzo-urbano-1/800/800"],
        activo: true,
        vendedor: modaUrbana._id
      },
      {
        titulo: "Gorra Snapback Urban",
        descripcion: "Gorra ajustable estilo urbano, visera plana, bordado frontal",
        precio: 7500,
        moneda: "ARS",
        stock: 18,
        vendidos: 7,
        categorias: ["gorros", "accesorios"],
        fotos: ["https://picsum.photos/seed/gorra-snap-1/800/800"],
        activo: true,
        vendedor: modaUrbana._id
      }
    ];

    // Productos de Tech Store
    const productosTechStore = [
      {
        titulo: "Auriculares Bluetooth Premium",
        descripcion: "Auriculares inalámbricos con cancelación de ruido activa, batería de 30 horas",
        precio: 45000,
        moneda: "ARS",
        stock: 15,
        vendidos: 5,
        categorias: ["audio", "accesorios", "bluetooth"],
        fotos: ["https://picsum.photos/seed/auriculares1/400/400"],
        activo: true,
        vendedor: techStore._id
      },
      {
        titulo: "Monitor LED 24 pulgadas Full HD",
        descripcion: "Monitor profesional 1920x1080, 75Hz, panel IPS, HDMI y DisplayPort",
        precio: 120000,
        moneda: "ARS",
        stock: 8,
        vendidos: 12,
        categorias: ["monitores", "pantallas", "oficina"],
        fotos: ["https://picsum.photos/seed/monitor24/400/400"],
        activo: true,
        vendedor: techStore._id
      },
      {
        titulo: "SSD 1TB NVMe Gen4",
        descripcion: "Disco sólido de alta velocidad, lectura 7000MB/s, escritura 5000MB/s",
        precio: 85000,
        moneda: "ARS",
        stock: 20,
        vendidos: 8,
        categorias: ["almacenamiento", "ssd", "componentes"],
        fotos: ["https://picsum.photos/seed/ssd1tb/400/400"],
        activo: true,
        vendedor: techStore._id
      },
      {
        titulo: "Webcam 4K con Micrófono",
        descripcion: "Cámara web profesional 4K 30fps, micrófono dual, ideal para streaming y videollamadas",
        precio: 35000,
        moneda: "ARS",
        stock: 12,
        vendidos: 15,
        categorias: ["perifericos", "webcam", "streaming"],
        fotos: ["https://picsum.photos/seed/webcam4k/400/400"],
        activo: true,
        vendedor: techStore._id
      },
      {
        titulo: "Memoria RAM DDR4 16GB 3200MHz",
        descripcion: "Módulo de memoria RGB, ideal para gaming y edición, disipador de aluminio",
        precio: 52000,
        moneda: "ARS",
        stock: 25,
        vendidos: 20,
        categorias: ["componentes", "ram", "memoria"],
        fotos: ["https://picsum.photos/seed/ram16gb/400/400"],
        activo: true,
        vendedor: techStore._id
      }
    ];

    // Insertar todos los productos
    const todosLosProductos = [
      ...productosSportMax,
      ...productosModaUrbana,
      ...productosTechStore
    ];

    console.log('Insertando productos...');
    const productosInsertados = await ProductoModel.insertMany(todosLosProductos);
    console.log(`✓ ${productosInsertados.length} productos insertados:`);
    console.log(`  - ${productosSportMax.length} productos de SportMax`);
    console.log(`  - ${productosModaUrbana.length} productos de Moda Urbana`);
    console.log(`  - ${productosTechStore.length} productos de Tech Store`);
    console.log('');

    console.log('🎉 Seed completado exitosamente!\n');
    console.log('Resumen:');
    console.log(`  📦 ${productosInsertados.length} productos`);
    console.log(`  👥 ${usuariosInsertados.length} usuarios`);
    console.log(`  🔑 Usuario default ID: ${USUARIO_DEFAULT_ID}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    process.exit(1);
  }
}

seedDatabase();
