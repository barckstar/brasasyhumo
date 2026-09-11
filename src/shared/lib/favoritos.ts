"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  escribirCrudo,
  leerCrudo,
  suscribir,
} from "@/shared/lib/almacenLocal";

/**
 * Favoritos guardados en el propio dispositivo.
 *
 * Viven en `shared` porque los usan el menu y los reels, y una feature no
 * importa de otra. Nacieron dentro de reels, que fue donde se pidieron
 * primero.
 *
 * ============================================================================
 * POR QUE NO ES UN CONTADOR PUBLICO DE "ME GUSTA"
 * ============================================================================
 * Un contador compartido —"432 personas marcaron este plato"— necesita estado
 * que sobreviva entre visitantes, y eso es una base de datos: alguien tiene que
 * guardar el numero en algun lado y servirlo a todos. `localStorage` no sirve
 * para eso, porque vive solo en el telefono de cada quien.
 *
 * Hay caminos gratuitos (el plan libre de Vercel KV o de Upstash Redis), pero
 * dejan de ser gratis si el sitio crece y hay que mantenerlos. Como el proyecto
 * tiene la restriccion explicita de no gastar en servicios, se implementa lo
 * que SI se puede sin costo y sin servidor: favoritos por dispositivo.
 *
 * Ademas resuelve un problema real del cliente que un contador no resuelve:
 * volver a pedir lo de siempre sin buscarlo entre 35 platos.
 *
 * Y evita el atajo deshonesto de mostrar un numero inventado, que en el sitio
 * de un negocio real es un dato falso.
 * ============================================================================
 */

const CLAVE_FAVORITOS = "brasa-humo-favoritos";

function parsear(crudo: string | null): string[] {
  if (!crudo) return [];
  try {
    const dato = JSON.parse(crudo);
    return Array.isArray(dato) ? dato.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function leerFavoritos(): string[] {
  return parsear(leerCrudo(CLAVE_FAVORITOS));
}

/**
 * Los favoritos del aparato, para pintar.
 *
 * ESTE HOOK EXISTE POR UN ERROR DE HIDRATACION REAL, no por prolijidad.
 *
 * Antes, cinco componentes repetian este bloque:
 *
 *     useSyncExternalStore(suscribir, leerCrudo, () => null);
 *     const favoritos = typeof window === "undefined" ? [] : leerFavoritos();
 *
 * Llamaban a `useSyncExternalStore` y TIRABAN SU VALOR. Ese valor es
 * justamente el que evita el desajuste: durante la hidratacion el hook
 * devuelve `getServerSnapshot()`, o sea lo mismo que pinto el servidor, y
 * recien despues vuelve a renderizar con el valor real del aparato.
 *
 * Al leer `localStorage` por fuera con `typeof window`, el primer render del
 * cliente YA traia los favoritos mientras el HTML del servidor no. En el
 * carril de categorias de los reels eso corria los hermanos de sitio —el
 * circulo de Favoritos solo se pinta si hay alguno— y React abortaba la
 * hidratacion de ese arbol entero para rehacerlo en el cliente.
 *
 * `typeof window` NO sirve para esto: durante la hidratacion el cliente YA
 * tiene `window`, asi que la condicion no distingue nada.
 */
export function useFavoritos(): string[] {
  const crudo = useSyncExternalStore(
    useCallback((avisar: () => void) => suscribir(CLAVE_FAVORITOS, avisar), []),
    () => leerCrudo(CLAVE_FAVORITOS),
    // En el servidor y en el render de hidratacion: sin favoritos.
    () => null,
  );
  return useMemo(() => parsear(crudo), [crudo]);
}

export function alternarFavorito(id: string): void {
  const actuales = leerFavoritos();
  const siguiente = actuales.includes(id)
    ? actuales.filter((x) => x !== id)
    : [...actuales, id];
  escribirCrudo(CLAVE_FAVORITOS, JSON.stringify(siguiente));
}
