import { z } from "zod";
import { galerias } from "@/shared/data/galerias";
import type { Plato } from "@/shared/types/menu";
import datos from "./ofertas.json";

/**
 * ============================================================================
 * OFERTAS DE MUESTRA — BRASA & HUMO
 * ============================================================================
 * Inventadas, como el resto del negocio. Estan pensadas para que la seccion se
 * vea como se veria con promociones reales: un 2x1, un combo, un dia fijo de
 * la semana y una tabla para compartir.
 *
 * `hasta` en null significa sin fecha de fin. Cuando una promocion la tenga,
 * `ofertasVigentes()` la retira sola el dia que vence.
 *
 * ----------------------------------------------------------------------------
 * LAS PROMOCIONES VIVEN EN `ofertas.json` Y SUS FOTOS EN `galerias.json`
 * ----------------------------------------------------------------------------
 * Aqui solo quedan el esquema que las valida y las dos funciones que las usan.
 * Las promociones cambian cada semana y las cambia quien las publica, no quien
 * programa: un JSON se edita sin abrir el editor de codigo.
 *
 * Los medios van bajo la clave `oferta-<id>`, en el mismo archivo que los
 * platos. Y como una oferta es un combo de platos que YA tienen galeria, su
 * entrada solo lleva el arte propio y un `heredaDe`: las fotos y el video del
 * plato se resuelven por referencia, asi que cambiarlos actualiza las dos
 * cosas a la vez.
 * ============================================================================
 */

const esquema = z
  .array(
    z.object({
      id: z.string().min(1),
      titulo: z.string().min(1),
      detalle: z.string().optional(),
      /** Precio de la promocion, en colones enteros. Impuestos incluidos. */
      precio: z.number().int().positive(),
      /** Etiqueta corta para el badge, ej. "2x1" o "-22%". */
      gancho: z.string().optional(),
      /** Lo que el arte del cliente aclara en letra chica. */
      restriccion: z.string().optional(),
      /**
       * Fecha de fin en ISO, o null si el arte no la dice.
       * Se valida el formato: un "31/12" se colaria como texto y
       * `new Date()` lo leeria como fecha invalida, dejando la promo colgada.
       */
      hasta: z.iso.date().nullable(),
    }),
  )
  .min(1)
  .refine(
    (lista) => new Set(lista.map((o) => o.id)).size === lista.length,
    "hay ids repetidos en ofertas.json",
  );

export type Oferta = z.infer<typeof esquema>[number];

export const ofertas = esquema.parse(datos);

export function ofertasVigentes(hoy: Date = new Date()): Oferta[] {
  return ofertas.filter((o) => !o.hasta || new Date(o.hasta) >= hoy);
}

/**
 * Convierte una oferta en la forma que entiende el carrito.
 *
 * Se reutiliza el tipo `Plato` en vez de inventar un tipo paralelo: el carrito,
 * el checkout y el mensaje de WhatsApp ya saben tratar platos, y una promocion
 * no es mas que una linea con nombre y precio. El prefijo `oferta-` en el id
 * evita que choque con un plato del menu que se llame parecido.
 */
export function ofertaComoPlato(o: Oferta): Plato {
  const medios = galerias[`oferta-${o.id}`];
  if (!medios) {
    throw new Error(`galerias.json no tiene medios para la oferta "${o.id}"`);
  }
  return {
    id: `oferta-${o.id}`,
    nombre: o.gancho ? `${o.titulo} (${o.gancho})` : o.titulo,
    descripcion: [o.detalle, o.restriccion].filter(Boolean).join(" · "),
    ingredientes: [],
    precio: o.precio,
    categoria: "ofertas",
    portada: medios.portada,
    medios: medios.medios,
    disponible: true,
  };
}
