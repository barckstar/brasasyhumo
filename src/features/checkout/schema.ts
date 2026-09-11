import { z } from "zod";

export const modalidades = ["retiro", "express"] as const;

/**
 * Los tres metodos que anuncia el menu impreso del local. El sitio NO procesa
 * pagos: el metodo viaja en el mensaje para que el restaurante llegue listo.
 */
export const metodosPago = ["efectivo", "sinpe", "tarjeta"] as const;

export const etiquetaMetodoPago: Record<
  (typeof metodosPago)[number],
  string
> = {
  efectivo: "Efectivo",
  sinpe: "Sinpe Móvil",
  tarjeta: "Tarjeta",
};

export const datosPedidoSchema = z
  .object({
    nombre: z
      .string()
      .trim()
      .min(2, "Indíquenos su nombre")
      .max(60, "Nombre demasiado largo"),
    telefono: z
      .string()
      .trim()
      // Costa Rica: 8 digitos, con o sin guion o espacio.
      .regex(/^\d{4}[\s-]?\d{4}$/, "Teléfono de 8 dígitos, ej. 8888-8888"),
    modalidad: z.enum(modalidades),
    metodoPago: z.enum(metodosPago),
    direccion: z.string().trim().max(200).optional(),
    /**
     * Coordenadas del punto de entrega, si el cliente uso el boton de
     * ubicacion. Salen de `navigator.geolocation`, que es gratis y no pide
     * llave. Viajan en el mensaje como enlace de Google Maps.
     */
    lat: z.number().optional(),
    lng: z.number().optional(),
    notas: z.string().trim().max(200).optional(),
  })
  .refine(
    (d) => d.modalidad !== "express" || (d.direccion?.length ?? 0) >= 6,
    {
      // Sin direccion el mensajero no puede salir: es obligatoria en express.
      message: "Para el servicio express necesitamos la dirección",
      path: ["direccion"],
    },
  );

export type DatosPedido = z.infer<typeof datosPedidoSchema>;
