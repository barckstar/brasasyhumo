import { z } from "zod";
import { galerias } from "@/shared/data/galerias";
import { ID_CATEGORIAS, type Plato } from "@/shared/types/menu";
import datos from "./menu.json";

/**
 * ============================================================================
 * MENU DE MUESTRA — BRASA & HUMO
 * ============================================================================
 * Este restaurante NO EXISTE: nombres, descripciones y precios son inventados
 * para enseñar el producto. Los precios se eligieron en el rango real de un
 * ahumadero de gama media-alta en Costa Rica (₡1.900 el acompañamiento mas
 * barato, ₡22.000 la tabla para compartir), porque una demo con precios
 * absurdos deja de servir para ensenar.
 *
 * `ingredientes` queda vacio: las descripciones ya dicen la composicion.
 *
 * ----------------------------------------------------------------------------
 * LOS PLATOS VIVEN EN `menu.json`, NO AQUI
 * ----------------------------------------------------------------------------
 * Son una lista de 35 registros iguales: en TypeScript ocupaban 365 lineas de
 * comillas y comas que el compilador no aprovechaba para nada, porque un dato
 * literal no se equivoca de tipo. En JSON se leen de un vistazo y los edita
 * cualquiera sin abrir el editor de codigo.
 *
 * Lo que SI aporta TypeScript es la VALIDACION, y esa queda aqui: `parse` corre
 * al importar el modulo, o sea durante `next build`. Un precio como texto, una
 * categoria mal escrita o un id repetido rompen el build, que es donde uno
 * quiere enterarse, y no con el menu en blanco en el telefono de un cliente.
 *
 * Las FOTOS y los VIDEOS tampoco estan aqui: viven en `shared/data/galerias.json`.
 * Este archivo dice QUE se vende; aquel, COMO se ve.
 * ============================================================================
 */

const esquema = z
  .array(
    z.object({
      id: z.string().min(1),
      nombre: z.string().min(1),
      descripcion: z.string().min(1),
      ingredientes: z.array(z.string()),
      // Colones enteros: un precio con decimales seria un error de captura.
      precio: z.number().int().positive(),
      categoria: z.enum(ID_CATEGORIAS),
      destacado: z.boolean().optional(),
      disponible: z.boolean(),
    }),
  )
  .min(1)
  // Un id repetido no rompe nada visible pero parte el carrito: dos platos
  // distintos comparten linea y las cantidades se pisan.
  .refine(
    (lista) => new Set(lista.map((p) => p.id)).size === lista.length,
    "hay ids repetidos en menu.json",
  );

/*
  Los medios se pegan aqui, desde `galerias.json`. Separarlos permite cambiar
  fotos y videos sin tocar el archivo que lleva los precios.
*/
export const menu: Plato[] = esquema.parse(datos).map((p) => {
  const g = galerias[p.id];
  if (!g) throw new Error(`galerias.json no tiene medios para "${p.id}"`);
  return { ...p, portada: g.portada, medios: g.medios };
});

export const platosDestacados = menu.filter((p) => p.destacado && p.disponible);
