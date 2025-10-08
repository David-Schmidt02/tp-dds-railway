import { z } from "zod";

export const telefonoSchema = z 
    .string()
    .regex(/^\d+$/, { message: "El telefono solo puede contener numeros"})
    .min(8, { message: "El telefono debe tener minimo 8 numeros"})
    .max(15, { message: "El telefono debe tener maximo 15 numeros"});

export const monedaSchema = z.enum(["PESO_ARG", "DOLAR_USA", "REAL"]);

export const direccionEntregaSchema = z.object({
    calle : z.string(),
    altura : z.number().nonnegative(),
    piso : z.number(),
    departamento : z.number().nonnegative(),
    codigoPostal : z.number()
})

export const usuarioSchema = z.object({
    nombre: z.string()
        .min(3, {message : "El nombre debe tener al menos 3 caracteres"})
        .max(25, {message:  "El nombre no puede tener mas de 25 caracteres"}),
    email: z.string().email({message: "Formato de email invalido"}),
    telefono : telefonoSchema,
    tipoUsuario : z.enum(["COMPRADOR", "VENDEDOR", "ADMIN"])
})

export const productoSchema = z.object({
    vendedor: usuarioSchema,
    titulo: z.string(),
    descripcion: z.string(),
    categorias: z.array(z.string()).min(1, {message: "El producto debe tener una categoria"}),
    precio: z.number().nonnegative(),
    moneda: monedaSchema,
    stock: z.number().nonnegative(),
    //fotos:
    activo: z.boolean().optional()
})

export const itemPedidoSchema = z.object({
    producto: z.string(),
    cantidad: z.number().min(1, {message: "Debe haber al menos 1"}),
    precioUnitario: z.number().nonnegative()
})

export const pedidoSchema = z.object({
    comprador: usuarioSchema,
    items: z.array(itemPedidoSchema).min(1, {message: "El pedido debe tener al menos 1 item"}),
    moneda : monedaSchema,
    direccionEntrega : direccionEntregaSchema
})

export const pedidoRequestSchema = z.object({
    usuarioId: z.string(),
    items: z.array(z.object({
        productoId: z.string(),
        cantidad: z.number().min(1)
    })).min(1),
    metodoPago: monedaSchema,
    direccionEntrega: z.object({
        calle: z.string(),
        numero: z.string(),
        ciudad: z.string(),
        codigoPostal: z.string(),
        provincia: z.string().optional()
    }),
    comentarios: z.string().optional()
})
