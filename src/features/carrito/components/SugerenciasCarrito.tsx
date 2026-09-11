"use client";

import { useCallback, useSyncExternalStore } from "react";
import Image from "next/image";
import { formatoColones } from "@/shared/lib/formatoColones";
import { leerCrudo, escribirCrudo, suscribir } from "@/shared/lib/almacenLocal";
import { useCarrito } from "@/shared/lib/carrito";
import type { Plato } from "@/shared/types/menu";

const CLAVE = "brasa-humo-sugerencias-ocultas";

/**
 * Complementos sugeridos dentro del carrito.
 *
 * SE PUEDE PLEGAR, y la decisión se recuerda entre visitas. Es una herramienta
 * de venta, pero cuando alguien está revisando su pedido lo que necesita ver es
 * su pedido: si estorba una vez, va a estorbar siempre. Colapsada queda como
 * una línea discreta que se puede volver a abrir.
 *
 * Los platos llegan por prop desde el layout y NO se importan del menú aquí:
 * una feature no importa de otra.
 */
export function SugerenciasCarrito({ candidatos }: { candidatos: Plato[] }) {
  const { agregar, lineas } = useCarrito();

  const guardado = useSyncExternalStore(
    useCallback((f) => suscribir(CLAVE, f), []),
    () => leerCrudo(CLAVE),
    () => null,
  );
  const oculta = guardado === "1";

  const enCarrito = new Set(lineas.map((l) => l.plato.id));
  const sugerencias = candidatos.filter(
    (p) => p.disponible && !enCarrito.has(p.id),
  );

  if (sugerencias.length === 0) return null;

  return (
    <section className="border-t border-borde px-5 py-3">
      <button
        type="button"
        onClick={() => escribirCrudo(CLAVE, oculta ? "0" : "1")}
        aria-expanded={!oculta}
        aria-controls="lista-sugerencias"
        className="flex w-full items-center justify-between gap-3 py-1 text-left"
      >
        <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-acento">
          ¿Desea agregar algo más?
        </span>
        <span className="flex shrink-0 items-center gap-1.5 text-xs text-texto-suave">
          {oculta ? "Mostrar" : "Ocultar"}
          <span
            aria-hidden="true"
            className={`transition-transform duration-300 ${oculta ? "" : "rotate-180"}`}
          >
            ▾
          </span>
        </span>
      </button>

      {/*
        El alto va en estilo en linea y no en clases de Tailwind.

        Con `max-h-0` en un ternario dentro de plantilla, Tailwind no genero la
        regla —se verifico: la clase quedaba aplicada en el DOM pero el valor
        computado seguia en 288px porque la regla no existia en el CSS—. El
        estilo en linea no depende de que el escaneo detecte la clase.
      */}
      <div
        id="lista-sugerencias"
        aria-hidden={oculta}
        className="overflow-hidden transition-all duration-300"
        style={{
          maxHeight: oculta ? 0 : "18rem",
          opacity: oculta ? 0 : 1,
        }}
      >
        <ul className="-mx-1 mt-3 flex gap-3 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sugerencias.map((p) => (
            <li key={p.id} className="w-32 shrink-0">
              <div className="relative overflow-hidden rounded-xl bg-superficie">
                <div className="relative aspect-4/3">
                  <Image
                    src={p.portada.src}
                    alt={p.portada.alt}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => agregar(p)}
                  aria-label={`Agregar ${p.nombre} al pedido`}
                  className="absolute bottom-1.5 right-1.5 grid size-8 place-items-center rounded-full bg-base/90 text-lg leading-none text-texto shadow-md backdrop-blur-sm transition-colors hover:bg-acento hover:text-base"
                >
                  <span aria-hidden="true" className="-mt-0.5">
                    +
                  </span>
                </button>
              </div>
              <p className="mt-1.5 line-clamp-2 text-xs leading-tight text-texto">
                {p.nombre}
              </p>
              <p className="font-display text-sm font-bold text-acento">
                {formatoColones(p.precio)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
