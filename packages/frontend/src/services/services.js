import pro from '../mockData/mockDataProductos.js';

export const getProductsSlowly = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve(pro)
  }, 5000)
})