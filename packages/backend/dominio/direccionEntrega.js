export class DireccionEntrega {
    calle
    altura
    piso
    departamento
    codigoPostal
    ciudad
    provincia
    pais
    latitud
    longitud

    constructor(calle, altura, piso, departamento) {
        this.calle = calle
        this.altura = altura
        this.piso = piso
        this.departamento = departamento
        // el resto suponemos que son calculables
    }

}