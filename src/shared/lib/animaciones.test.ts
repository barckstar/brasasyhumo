import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Guardia contra keyframes huerfanos.
 *
 * Existe por un fallo real: al revertir el mapa de Leaflet se elimino un bloque
 * de `globals.css` delimitado por dos marcadores, y las animaciones de fuego
 * habian quedado justo en medio. Se borraron por arrastre. Los componentes
 * seguian pidiendo `animation: llama-parpadeo`, el CSS ya no la definia, y
 * nada fallo: ni el build, ni los tipos, ni el lint. La animacion simplemente
 * dejo de correr, en silencio.
 *
 * Esta prueba cierra ese hueco: toda animacion que un componente invoque debe
 * tener su `@keyframes` definido.
 */

const RAIZ = join(process.cwd(), "src");
const CSS = join(RAIZ, "app", "globals.css");

function archivosFuente(dir: string): string[] {
  return readdirSync(dir).flatMap((entrada) => {
    const ruta = join(dir, entrada);
    if (statSync(ruta).isDirectory()) return archivosFuente(ruta);
    return /\.(tsx|ts)$/.test(entrada) && !entrada.endsWith(".test.ts")
      ? [ruta]
      : [];
  });
}

describe("animaciones CSS", () => {
  const css = readFileSync(CSS, "utf8");

  const definidas = new Set(
    [...css.matchAll(/@keyframes\s+([\w-]+)/g)].map((m) => m[1]),
  );

  const usadas = new Map<string, string>();
  for (const archivo of archivosFuente(RAIZ)) {
    const codigo = readFileSync(archivo, "utf8");
    for (const m of codigo.matchAll(/animation:\s*["'`]?([a-z][\w-]*)[\s"'`]/g)) {
      usadas.set(m[1], archivo);
    }
  }

  it("define al menos una animacion", () => {
    expect(definidas.size).toBeGreaterThan(0);
  });

  it("toda animacion usada por un componente tiene su @keyframes", () => {
    const huerfanas = [...usadas.entries()]
      .filter(([nombre]) => !definidas.has(nombre))
      .map(([nombre, archivo]) => `${nombre} (usada en ${archivo})`);

    expect(huerfanas).toEqual([]);
  });

  it("las animaciones de fuego del logo siguen definidas", () => {
    // Estas tres son las que se perdieron una vez.
    for (const nombre of ["llama-parpadeo", "onda-calor", "temblor-calor"]) {
      expect(definidas.has(nombre)).toBe(true);
    }
  });

  it("respeta prefers-reduced-motion", () => {
    expect(css).toContain("prefers-reduced-motion: reduce");
  });
});
