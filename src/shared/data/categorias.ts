import { z } from "zod";
import { ID_CATEGORIAS, type Categoria } from "@/shared/types/menu";
import datos from "./categorias.json";

/**
 * Las secciones del menu.
 *
 * Vive en `shared` porque la usan DOS features —el menu y los reels— y la
 * regla dura del proyecto es que una feature nunca importa de otra.
 *
 * El esquema comprueba que cada id exista en `ID_CATEGORIAS`: sin eso, una
 * categoria mal escrita aqui saldria en el carril de filtros y no devolveria
 * ningun plato, sin que nada avisara.
 */
const esquema = z
  .array(
    z.object({
      id: z.enum(ID_CATEGORIAS),
      nombre: z.string().min(1),
      /**
       * Etiqueta corta para el carril de circulos de los reels, donde cada
       * rotulo dispone de unos 64px.
       */
      corto: z.string().min(1).optional(),
    }),
  )
  .min(1);

export const categorias: Categoria[] = esquema.parse(datos);
