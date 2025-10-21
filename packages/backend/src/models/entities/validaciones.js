import { z } from "zod";

export const telefonoSchema = z 
    .string()
    .regex(/^\d+$/, { message: "El telefono solo puede contener numeros"})
    .min(8, { message: "El telefono debe tener minimo 8 numeros"})
    .max(15, { message: "El telefono debe tener maximo 15 numeros"});

export const monedaSchema = z.enum(["PESO_ARG", "DOLAR_USA", "REAL"]);

export const direccionEntregaSchema = z.object({
    calle : z.string(),
    numero : z.number().nonnegative(),
    piso : z.number().optional(),
    departamento : z.number().nonnegative().optional(),
    codigoPostal : z.number(),
    ciudad : z.string()
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
    activo: z.boolean().optional()
})

export const itemPedidoSchema = z.object({
    productoId: z.string(),
    cantidad: z.number().min(1, {message: "Debe haber al menos 1"}),
})

export const pedidoSchema = z.object({
    usuarioId: z.string(),
    items: z.array(itemPedidoSchema).min(1, {message: "El pedido debe tener al menos 1 item"}),
    moneda : monedaSchema,
    direccionEntrega : direccionEntregaSchema
})


