import { Producto } from '../../src/models/entities/producto';
import { jest } from '@jest/globals';


describe('Clase Producto', () => {
  let producto;

  beforeEach(() => {
    producto = new Producto(
      'Vendedor1',
      'Remera',
      'Remera negra de algodon',
      ['Ropa', 'Hombre'],
      1000,
      'ARS',
      10,
      ['foto1.jpg'],
      true
    );
  });

  test('Se crea con los atributos correctos', () => {
    expect(producto.vendedor).toBe('Vendedor1');
    expect(producto.titulo).toBe('Remera');
    expect(producto.precio).toBe(1000);
    expect(producto.moneda).toBe('ARS');
    expect(producto.stock).toBe(10);
    expect(producto.activo).toBe(true);
  });

  test('Indicar si hay stock suficiente', () => {
    expect(producto.estaDisponible(5)).toBe(true);
    expect(producto.estaDisponible(15)).toBe(false);
  });

  test('Reducir el stock', () => {
    producto.reducirStock(3);
    expect(producto.stock).toBe(7);
  });

  test('Aumentar el stock', () => {
    producto.aumentarStock(5);
    expect(producto.stock).toBe(15);
  });
});
