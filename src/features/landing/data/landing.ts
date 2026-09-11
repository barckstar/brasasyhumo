import { z } from "zod";
import datos from "./landing.json";

/**
 * Textos del inicio. TODO ESTO ES DEMO: es verosimil pero NO lo escribio el
 * cliente. Reemplazar cuando entregue su copy real.
 *
 * El contenido vive en `landing.json` y no aqui porque son textos, no logica:
 * los cambia quien escribe, no quien programa. Lo que se queda es la
 * VALIDACION, que corre al importar —o sea durante `next build`— y avisa si
 * alguien borra un campo o deja un titulo vacio.
 */

const esquema = z.object({
  sobreNosotros: z.object({
    antetitulo: z.string().min(1),
    tituloLinea1: z.string().min(1),
    tituloLinea2: z.string().min(1),
    parrafo: z.string().min(1),
    // Cuatro es lo que entra en la columna sin que el bloque crezca de mas.
    puntos: z.array(z.string().min(1)).min(1).max(4),
  }),
  porQue: z.object({
    antetitulo: z.string().min(1),
    titulo: z.string().min(1),
    razones: z
      .array(z.object({ titulo: z.string().min(1), texto: z.string().min(1) }))
      .min(1),
  }),
});

const contenido = esquema.parse(datos);

export const sobreNosotros = contenido.sobreNosotros;
export const porQue = contenido.porQue;
