import {ItemPedido} from '../../src/models/entities/itemPedido'; 
import { jest } from '@jest/globals';


describe('Clase ItemPedido', () => {
  let mockProducto;
  let item;

  beforeEach(() => {
    mockProducto = {
      id: 'p001',
      getVendedor: jest.fn(() => 'vendedor123')
    };

    item = new ItemPedido(mockProducto, 3, 200);
  });

  test('Crear con los atributos correctos', () => {
    expect(item.producto).toBe(mockProducto);
    expect(item.cantidad).toBe(3);
    expect(item.precioUnidad).not.toBeDefined(); 
    expect(item.precioUnitario).toBe(200);
  });

  test('Calcular correctamente el subtotal', () => {
    expect(item.subtotal()).toBe(600); 
  });

  test('Obtener el vendedor desde el producto', () => {
    const vendedor = item.obtenerVendedor();
    expect(vendedor).toBe('vendedor123');
    expect(mockProducto.getVendedor).toHaveBeenCalled();
  });

  test('Devolver el id del producto', () => {
    expect(item.getId()).toBe('p001');
  });

  test('Cambiar la cantidad correctamente', () => {
    item.cambiarCantidad(5);
    expect(item.cantidad).toBe(5);
  });

  test('Lanzar error si la nueva cantidad es menor o igual a 0', () => {
    expect(() => item.cambiarCantidad(0)).toThrow('La cantidad debe ser mayor a 0');
    expect(() => item.cambiarCantidad(-3)).toThrow('La cantidad debe ser mayor a 0');
  });
});
