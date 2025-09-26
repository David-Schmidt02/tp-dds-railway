/*
import { Producto } from '../dominio/producto.js';
import { ProductoRepository } from '../src/repositories/productoRepository.js';

export class PedidoService {
    constructor(productoRepository) {
        this.productoRepository = productoRepository;
    }

obtenerProductos(vendedorId, filtros) {
  let resultado = this.productos.filter(p => p.vendedor === vendedorId);

  if (filtros.search) {
    const search = filtros.search.toLowerCase();
    resultado = resultado.filter(p =>
      p.titulo.toLowerCase().includes(search) ||
      p.descripcion.toLowerCase().includes(search) ||
      p.categorias.toLowerCase().includes(search)
    );
  }


  if (filtros.minPrice) {
    resultado = resultado.filter(p => p.precio >= Number(filtros.minPrice));
  }
  if (filtros.maxPrice) {
    resultado = resultado.filter(p => p.precio <= Number(filtros.maxPrice));
  }

  return resultado;
}

}
*/