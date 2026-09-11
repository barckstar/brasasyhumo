"use client";

import { useEffect, useRef, useState } from "react";
import { CarruselMedios } from "./CarruselMedios";
import { formatoColones } from "@/shared/lib/formatoColones";
import { useCarrito } from "@/shared/lib/carrito";
import { IconoCarrito, IconoCorazon } from "./Iconos";

import { alternarFavorito, useFavoritos } from "@/shared/lib/favoritos";
import type { Plato } from "@/shared/types/menu";

/**
 * Hoja de detalle del plato, al estilo de las apps de delivery: foto grande
 * arriba, nombre y precio, descripcion, nota para la cocina, y abajo un boton
 * fijo con la cantidad y el subtotal.
 *
 * En MOVIL ocupa la pantalla completa: con una hoja a media altura la foto y
 * el texto quedaban comprimidos y sobraba fondo oscuro sin usar. En escritorio
 * se centra como dialogo, que es donde una hoja a pantalla completa si estorba.
 */
export function DetallePlato({
  plato,
  onCerrar,
}: {
  plato: Plato | null;
  onCerrar: () => void;
}) {
  const { agregar, cambiarCantidad, ponerNota, cantidadDe, abrir } = useCarrito();
  const panel = useRef<HTMLDivElement>(null);
  const botonCerrar = useRef<HTMLButtonElement>(null);

  /*
    El hook va SUELTO y la condicion despues. Puesto detras de un `&&`
    —`plato !== null && useFavoritos()...`— se llamaria solo a veces, y las
    reglas de React prohiben llamar un hook condicionalmente: la lista de
    hooks tiene que ser la misma en todos los renders.
  */
  const favoritos = useFavoritos();
  const esFavorito = plato !== null && favoritos.includes(plato.id);
  const [cantidad, setCantidad] = useState(1);
  const [nota, setNota] = useState("");

  // Cada vez que se abre otro plato, el formulario arranca limpio.
  const idAbierto = plato?.id ?? null;
  const [ultimoId, setUltimoId] = useState<string | null>(null);
  if (idAbierto !== ultimoId) {
    setUltimoId(idAbierto);
    setCantidad(Math.max(1, plato ? cantidadDe(plato.id) : 1));
    setNota("");
  }

  useEffect(() => {
    if (!plato) return;
    document.body.style.overflow = "hidden";
    function alPulsar(e: KeyboardEvent) {
      if (e.key === "Escape") onCerrar();
    }
    document.addEventListener("keydown", alPulsar);
    /*
      EL BOTON DE CERRAR, por referencia y no "el primer boton del panel".

      Aquello dependia del orden del DOM y se rompio en cuanto la galeria paso
      a ir antes que la X: el foco caia en un segmento de la barra de progreso
      y un lector de pantalla anunciaba "Ver medio 1 de 4" al abrir la hoja.
    */
    botonCerrar.current?.focus();
    return () => {
      document.removeEventListener("keydown", alPulsar);
      document.body.style.overflow = "";
    };
  }, [plato, onCerrar]);

  if (!plato) return null;

  const yaEnCarrito = cantidadDe(plato.id);
  const subtotal = plato.precio * cantidad;

  function confirmar() {
    if (!plato) return;
    if (yaEnCarrito === 0) agregar(plato);
    cambiarCantidad(plato.id, cantidad);
    if (nota.trim()) ponerNota(plato.id, nota);
    onCerrar();
    abrir();
  }

  /*
    `h-[100dvh]` ademas de `inset-0`: un elemento fijo se dimensiona contra el
    viewport de MAQUETA, que en Android se queda corto cuando la barra de
    direcciones se retrae. La hoja terminaba unos pixeles antes del borde y por
    esa rendija asomaba lo que hubiera detras. `dvh` sigue el viewport real.
  */
  return (
    <div className="fixed inset-0 z-[65] h-[100dvh]">
      <div
        className="absolute inset-0 bg-base/85 backdrop-blur-sm"
        onClick={onCerrar}
        aria-hidden="true"
      />

      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-plato"
        className="absolute inset-0 flex flex-col overflow-hidden border-borde bg-base-alt sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:h-auto sm:max-h-[88dvh] sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl sm:border"
      >
        <div className="relative shrink-0">
          {/*
            La GALERIA COMPLETA, no solo la portada: aqui es donde se decide si
            se pide, y una sola foto obliga a irse al menu en video para ver el
            resto. Es el mismo componente del reel, en su variante `detalle`:
            no pasa de lamina sola —quien esta leyendo no quiere que la foto
            cambie— pero el video si corre.
          */}
          <div className="relative h-[38dvh] overflow-hidden bg-superficie sm:h-auto sm:aspect-16/10">
            <CarruselMedios
              medios={plato.medios}
              reproducir
              nombre={plato.nombre}
              variante="detalle"
            />
          </div>
          <button
            ref={botonCerrar}
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="absolute left-3 top-3 grid size-9 place-items-center rounded-full bg-base/80 text-xl leading-none text-texto backdrop-blur-sm transition-colors hover:text-acento"
          >
            ×
          </button>

          {/* El corazon va aqui y no solo en la tarjeta: al inicio y en las
              ofertas se llega al plato por esta hoja, sin pasar por la
              cuadricula del menu. */}
          <button
            type="button"
            onClick={() => alternarFavorito(plato.id)}
            aria-pressed={esFavorito}
            aria-label={
              esFavorito
                ? `Quitar ${plato.nombre} de favoritos`
                : `Guardar ${plato.nombre} en favoritos`
            }
            className={`absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-base/90 backdrop-blur-sm transition-all duration-200 active:scale-90 ${
              esFavorito ? "text-acento" : "text-texto hover:text-acento"
            }`}
          >
            <IconoCorazon lleno={esFavorito} className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          <div className="flex items-start justify-between gap-4">
            <h2
              id="titulo-plato"
              className="font-display text-2xl font-bold uppercase italic leading-tight text-texto"
            >
              {plato.nombre}
            </h2>
            <p className="shrink-0 font-display text-2xl font-bold text-acento">
              {formatoColones(plato.precio)}
            </p>
          </div>

          <p className="mt-3 leading-relaxed text-texto-suave">
            {plato.descripcion}
          </p>

          {plato.ingredientes.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {plato.ingredientes.map((i) => (
                <li
                  key={i}
                  className="rounded-full border border-borde px-3 py-1 text-xs text-texto-suave"
                >
                  {i}
                </li>
              ))}
            </ul>
          )}

          <label
            htmlFor="nota-plato"
            className="mt-6 block font-display text-xs font-semibold uppercase tracking-[0.2em] text-acento"
          >
            Indicaciones para la cocina
          </label>
          <input
            id="nota-plato"
            type="text"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            maxLength={80}
            placeholder="Sin cebolla, término medio…"
            className="mt-2 w-full rounded-xl border border-borde bg-base px-4 py-3 text-sm text-texto placeholder:text-texto-suave/50 focus:border-acento focus:outline-none"
          />

          {!plato.disponible && (
            <p className="mt-4 rounded-xl border border-borde px-4 py-3 text-sm text-texto-suave">
              Este platillo está agotado por hoy.
            </p>
          )}
        </div>

        <footer className="shrink-0 border-t border-borde p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1 rounded-full border border-borde p-1">
              <button
                type="button"
                onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                aria-label="Quitar una unidad"
                disabled={cantidad <= 1}
                className="grid size-9 place-items-center rounded-full text-lg text-texto transition-colors hover:text-acento disabled:opacity-35"
              >
                −
              </button>
              <span
                className="min-w-7 text-center font-display font-bold text-texto"
                aria-live="polite"
              >
                {cantidad}
              </span>
              <button
                type="button"
                onClick={() => setCantidad((c) => c + 1)}
                aria-label="Agregar una unidad"
                className="grid size-9 place-items-center rounded-full text-lg text-texto transition-colors hover:text-acento"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={confirmar}
              disabled={!plato.disponible}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-acento px-4 py-3.5 font-display text-sm font-semibold uppercase tracking-wide text-base transition-transform duration-200 hover:bg-acento-alt active:scale-[0.98] disabled:opacity-40 disabled:hover:bg-acento"
            >
              <IconoCarrito className="size-4" />
              {yaEnCarrito > 0 ? "Actualizar" : "Agregar"} ·{" "}
              {formatoColones(subtotal)}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
