import { z } from "zod";

export const usuarioSchema = z.object({
    nombre: z.string()
        .min(3, {message : "El nombre debe tener al menos 3 caracteres"})
        .max(25, {message:  "El nombre no puede tener mas de 25 caracteres"}),
    email: z.string().email({message: "Formato de email invalido"}),
    telefono : telefonoSchema,
    tipoUsuario :  z.enum(["COMPRADOR", "VENDEDOR", "ADMIN"])
})


export const telefonoSchema = z 
    .string()
    .regex(/^\d+$/, { message: "El telefono solo puede contener numeros"})
    .min(8, { message: "El telefono debe tener minimo 8 numeros"})
    .min(15, { message: "El telefono debe tener maximo 15 numeros"});
