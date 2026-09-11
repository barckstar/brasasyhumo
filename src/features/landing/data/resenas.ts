import { z } from "zod";
import { enlaceMapa } from "@/shared/config/negocio";
import datos from "./resenas.json";

/**
 * ============================================================================
 * RESEÑAS DE MUESTRA — NINGUNA ES REAL
 * ============================================================================
 * Brasa & Humo no existe, asi que no hay nadie que haya escrito esto. Los
 * autores se llaman "Cliente de muestra" A PROPOSITO: un nombre y apellido
 * verosimil hace que la seccion se lea como testimonio verdadero, y en una
 * demo que circula eso es fabricar un respaldo que nadie dio.
 *
 * ESTA LIBERTAD NO SE HEREDA. En el sitio de un negocio REAL las resenas se
 * transcriben literales de su ficha de Google, con sus tildes faltantes y su
 * puntuacion, porque son citas atribuidas a personas que cualquiera contrasta
 * en dos clics. Ahi NO se inventa ni se corrige ninguna.
 * ============================================================================
 */

const esquema = z.array(
  z.object({
    autor: z.string().min(1),
    /** Como aparece en Google: "Local Guide · 55 reseñas" o solo el conteo. */
    credencial: z.string().min(1),
    estrellas: z.number().int().min(1).max(5),
    texto: z.string().min(1),
    /** Tal como lo muestra Google: "Hace 3 meses". */
    fecha: z.string().min(1),
  }),
);

export const resenas = esquema.parse(datos);

/*
  Los dos enlaces apuntan al mismo sitio: la ficha del negocio en Google Maps.
  Se mantienen separados porque significan cosas distintas —uno invita a
  ESCRIBIR una resena y el otro a LEERLAS— y el dia que exista el Place ID en
  formato ChIJ, el de escribir pasa a `.../writereview?placeid=...`, que abre
  el formulario directo. Ese dato sigue pendiente del cliente.
*/
export function enlaceResena(): string {
  return enlaceMapa();
}

export function enlaceFichaGoogle(): string {
  return enlaceMapa();
}
