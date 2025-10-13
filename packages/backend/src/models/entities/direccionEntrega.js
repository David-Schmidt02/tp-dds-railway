export class DireccionEntrega {
    calle
    altura
    piso
    departamento
    codigoPostal
    ciudad
    referencia

    constructor(calle, altura, piso, departamento, codigoPostal, ciudad, referencia = null) {
        this.calle = calle
        this.altura = altura
        this.piso = piso
        this.departamento = departamento
        this.codigoPostal = codigoPostal
        this.ciudad = ciudad
        this.referencia = referencia
    }

}