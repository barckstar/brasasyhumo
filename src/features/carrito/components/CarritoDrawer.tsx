"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useCarrito } from "@/shared/lib/carrito";
import { formatoColones } from "@/shared/lib/formatoColones";
import { negocio } from "@/shared/config/negocio";
import { SugerenciasCarrito } from "./SugerenciasCarrito";
import type { Plato } from "@/shared/types/menu";

/**
 * Panel del carrito. Es un drawer, no una pagina: asi el sitio se mantiene en
 * las dos paginas acordadas.
 *
 * Accesibilidad: atrapa el foco, cierra con Escape, bloquea el scroll del
 * fondo y se anuncia como dialogo.
 */
export function CarritoDrawer({
  onIrAlCheckout,
  sugerencias = [],
}: {
  onIrAlCheckout: () => void;
  /** Complementos a ofrecer. Llegan del layout para no acoplar features. */
  sugerencias?: Plato[];
}) {
  const { lineas, abierto, cerrar, cambiarCantidad, quitar, ponerNota, total, vaciar } =
    useCarrito();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;

    const anterior = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    function alPulsar(e: KeyboardEvent) {
      if (e.key === "Escape") {
        cerrar();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;

      const focos = panel.current.querySelectorAll<HTMLElement>(
        'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
      );
      if (focos.length === 0) return;
      const primero = focos[0];
      const ultimo = focos[focos.length - 1];

      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    }

    document.addEventListener("keydown", alPulsar);
    panel.current?.querySelector<HTMLElement>("button")?.focus();

    return () => {
      document.removeEventListener("keydown", alPulsar);
      document.body.style.overflow = "";
      anterior?.focus();
    };
  }, [abierto, cerrar]);

  if (!abierto) return null;

  return (
    /*
        `h-[100dvh]` ademas de `inset-0`: un elemento fijo se dimensiona contra
        el viewport de MAQUETA, que en Android se queda corto cuando la barra
        de direcciones se retrae. El drawer terminaba unos pixeles antes del
        borde y por esa rendija asomaba lo que hubiera detras. `dvh` sigue el
        viewport real. No se pudo reproducir en el navegador de escritorio: es
        una correccion dirigida al comportamiento de Android.
      */
      <div className="fixed inset-0 h-[100dvh] z-[60]">
      <div
        className="absolute inset-0 bg-base/80 backdrop-blur-sm"
        onClick={cerrar}
        aria-hidden="true"
      />

      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-carrito"
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-borde bg-base-alt shadow-2xl"
      >
        <header className="flex items-center justify-between gap-4 border-b border-borde px-5 py-4">
          <h2
            id="titulo-carrito"
            className="font-display text-xl font-bold uppercase italic tracking-wide text-texto"
          >
            Su pedido
          </h2>
          <button
            type="button"
            onClick={cerrar}
            aria-label="Cerrar el carrito"
            className="grid size-9 place-items-center rounded-full text-2xl leading-none text-texto-suave transition-colors hover:text-acento focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento"
          >
            ×
          </button>
        </header>

        {lineas.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <p className="text-texto-suave">Todavía no hay nada en su pedido.</p>
            <button
              type="button"
              onClick={cerrar}
              className="font-display text-sm font-semibold uppercase tracking-wide text-acento hover:underline"
            >
              Ver el menú
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-borde overflow-y-auto px-5">
              {lineas.map((l) => (
                <li key={l.plato.id} className="py-4">
                  <div className="flex gap-3">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-superficie">
                      <Image
                        src={l.plato.portada.src}
                        alt={l.plato.portada.alt}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-texto">
                          {l.plato.nombre}
                        </h3>
                        <button
                          type="button"
                          onClick={() => quitar(l.plato.id)}
                          aria-label={`Quitar ${l.plato.nombre} del pedido`}
                          className="text-xs text-texto-suave transition-colors hover:text-acento"
                        >
                          Quitar
                        </button>
                      </div>

                      <div className="mt-2 flex items-center justify-between gap-3">
                        <div className="inline-flex items-center gap-1 rounded-full border border-borde">
                          <button
                            type="button"
                            onClick={() =>
                              cambiarCantidad(l.plato.id, l.cantidad - 1)
                            }
                            aria-label={`Quitar una unidad de ${l.plato.nombre}`}
                            className="grid size-7 place-items-center rounded-full text-texto transition-colors hover:text-acento"
                          >
                            −
                          </button>
                          <span className="min-w-5 text-center text-sm font-semibold text-texto">
                            {l.cantidad}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              cambiarCantidad(l.plato.id, l.cantidad + 1)
                            }
                            aria-label={`Agregar una unidad de ${l.plato.nombre}`}
                            className="grid size-7 place-items-center rounded-full text-texto transition-colors hover:text-acento"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-display font-bold text-acento">
                          {formatoColones(l.plato.precio * l.cantidad)}
                        </p>
                      </div>

                      <input
                        type="text"
                        value={l.nota ?? ""}
                        onChange={(e) => ponerNota(l.plato.id, e.target.value)}
                        placeholder="Indicación: sin cebolla, término medio…"
                        maxLength={80}
                        aria-label={`Nota para ${l.plato.nombre}`}
                        className="mt-2 w-full rounded-lg border border-borde bg-base px-3 py-1.5 text-xs text-texto placeholder:text-texto-suave/60 focus:border-acento focus:outline-none"
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <SugerenciasCarrito candidatos={sugerencias} />

            <footer className="border-t border-borde p-5">
              <div className="flex items-baseline justify-between">
                <span className="font-display uppercase tracking-wide text-texto-suave">
                  Total
                </span>
                <span className="font-display text-3xl font-bold text-acento">
                  {formatoColones(total)}
                </span>
              </div>
              <p className="mt-1 text-xs text-texto-suave">
                Precios finales. El costo del express lo cobra el mensajero al llegar.
              </p>

              <button
                type="button"
                onClick={onIrAlCheckout}
                className="mt-4 w-full rounded-full bg-acento py-3.5 font-display font-semibold uppercase tracking-wide text-base transition-transform duration-200 hover:bg-acento-alt active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento-alt"
              >
                Continuar el pedido
              </button>

              {/* Antes era un texto gris de 12px que nadie encontraba.
                  Ahora es un boton real, con borde y su icono. */}
              <button
                type="button"
                onClick={vaciar}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-borde py-2.5 text-sm text-texto-suave transition-colors hover:border-acento/60 hover:text-acento"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-4"
                  aria-hidden="true"
                >
                  <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
                  <path d="M10 11v6M14 11v6" />
                </svg>
                Vaciar el pedido
              </button>

              <p className="mt-3 text-center text-xs text-texto-suave">
                Se coordina por WhatsApp {negocio.whatsappVisible}
              </p>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
