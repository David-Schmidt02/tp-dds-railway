/*
export class Moneda {
    nombre;
    constructor(nombre){ this.nombre = nombre }

    deNombre(nombre) {
        switch(nombre) {
            case "PESO_ARG": return Moneda.PESO_ARG;
            case "DOLAR_USA": return Moneda.DOLAR_USA;
            case "REAL": return Moneda.REAL;
            default: throw new Error(`Moneda no soportada: ${nombre}`); //
        }
    }
}

Moneda.PESO_ARG = new Moneda("PESO_ARG")
Moneda.DOLAR_USA = new Moneda("DOLAR_USA")
Moneda.REAL  = new Moneda("REAL")
*/

// La de arriba es otra opcion, pero como no tiene comportamiento creemos que es mejor esta

const Moneda = Object.freeze({
  PESO_ARG: "PESO_ARG",
  DOLAR_USA: "DOLAR_USA",
  REAL: "REAL",
});

function esMonedaValida(valor) {
  return Object.values(Moneda).includes(valor);
}