export const Moneda = Object.freeze({
  PESO_ARG: "PESO_ARG",
  DOLAR_USA: "DOLAR_USA",
  REAL: "REAL",
});

function esMonedaValida(valor) {
  return Object.values(Moneda).includes(valor);
}