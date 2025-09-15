export class DireccionEntrega {
    calle
    altura
    piso
    departamento
    codigoPostal
    ciudad
    //calculables con ciudad    
    provincia
    pais
    //calculables de otra forma
    latitud
    longitud

    constructor(calle, altura, piso, departamento, codigoPostal) {
        this.calle = calle
        this.altura = altura
        this.piso = piso
        this.departamento = departamento
        this.codigoPostal = codigoPostal
    }

}