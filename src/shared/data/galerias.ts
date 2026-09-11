import { z } from "zod";
import datos from "./galerias.json";

/**
 * Los medios de cada plato, leidos de `galerias.json` y VALIDADOS al cargar.
 *
 * VIVE EN `shared` y no dentro de una feature porque lo usan DOS: el menu y
 * las ofertas. La regla dura del proyecto es que una feature nunca importa de
 * otra, asi que lo compartido sube.
 *
 * ============================================================================
 * POR QUE UN JSON Y NO MAS TYPESCRIPT
 * ============================================================================
 * Las fotos y los videos cambian mucho mas seguido que los precios, y los
 * cambia quien no necesariamente escribe codigo. Con los medios dentro de
 * `menu.ts` habia que abrir el archivo de los PRECIOS para cambiar una foto:
 * el archivo pasaba de 1.194 lineas y el riesgo de tocar un precio sin querer
 * era real.
 *
 * Ahora `menu.ts` dice QUE se vende y este JSON COMO se ve.
 *
 * ============================================================================
 * POR QUE SE VALIDA
 * ============================================================================
 * Un JSON no lo revisa el compilador. Sin esto, una coma de mas o un `tipo`
 * mal escrito no se notaria hasta que el plato apareciera en blanco en el
 * telefono de un cliente. `parse` corre al importar el modulo, o sea DURANTE
 * `next build`: un JSON malo rompe el build, que es donde uno quiere enterarse.
 */

const foto = z.object({
  // Rutas de `public/`, siempre absolutas. Una ruta relativa se resuelve
  // distinto segun desde que pagina se pinte.
  src: z.string().startsWith("/"),
  // El alt nunca vacio: es requisito de accesibilidad del proyecto, y el
  // patron es "Que + Donde".
  alt: z.string().min(1),
});

const medio = z.discriminatedUnion("tipo", [
  z.object({
    tipo: z.literal("imagen"),
    src: z.string().startsWith("/"),
    alt: z.string().min(1),
  }),
  z.object({
    tipo: z.literal("video"),
    src: z.string().startsWith("/"),
    // El poster es OBLIGATORIO: el video va con `preload="none"`, asi que
    // hasta que no entra en pantalla lo unico que se ve es el poster.
    poster: z.string().startsWith("/"),
    alt: z.string().min(1),
  }),
]);

const esquema = z.record(
  z.string(),
  z.object({
    portada: foto,
    /**
     * Puede ir VACIO si hay `heredaDe`: una oferta sin arte propio muestra
     * directamente la galeria del plato. Lo que no puede quedar vacio es el
     * resultado FINAL —un reel sin medios se ve en negro— y eso se comprueba
     * despues de resolver la herencia.
     */
    medios: z.array(medio),
    /**
     * Clave de otra entrada cuyos medios se agregan detras de los propios.
     *
     * Lo usan las ofertas: una promocion es un combo de platos que YA tienen
     * galeria, asi que detras de su arte se muestran las fotos y el video de
     * ese plato. Se REFERENCIA en vez de copiar para que cambiar la foto del
     * plato actualice tambien su oferta; con una copia, la oferta se quedaba
     * con la version vieja y nadie se enteraba.
     */
    heredaDe: z.string().optional(),
  }),
);

const crudo = esquema.parse(datos);

/**
 * Cuantos medios del plato se arrastran detras del arte de una oferta.
 * Cinco, que es lo que tiene cada plato: una oferta sin arte propio muestra la
 * galeria completa.
 */
const HEREDADOS = 5;

export const galerias = Object.fromEntries(
  Object.entries(crudo).map(([clave, entrada]) => {
    if (!entrada.heredaDe) {
      if (entrada.medios.length === 0) {
        throw new Error(`galerias.json: "${clave}" no tiene medios ni heredaDe`);
      }
      return [clave, entrada];
    }
    const origen = crudo[entrada.heredaDe];
    if (!origen) {
      throw new Error(
        `galerias.json: "${clave}" hereda de "${entrada.heredaDe}", que no existe`,
      );
    }
    if (origen.heredaDe) {
      // Una herencia en cadena seria un ciclo esperando a pasar.
      throw new Error(
        `galerias.json: "${clave}" hereda de "${entrada.heredaDe}", que a su vez hereda`,
      );
    }
    const medios = [...entrada.medios, ...origen.medios.slice(0, HEREDADOS)];
    if (medios.length === 0) {
      throw new Error(`galerias.json: "${clave}" queda sin medios`);
    }
    return [clave, { ...entrada, medios }];
  }),
);
