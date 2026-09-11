"use client";

import Image from "next/image";
import { categorias } from "@/shared/data/categorias";
import type { CategoriaId, Plato } from "@/shared/types/menu";

/** Los filtros del recorrido: las categorias reales mas los favoritos. */
export type FiltroReel = CategoriaId | "todas" | "favoritos";


/**
 * Filtro de categorías del recorrido de reels.
 *
 * En escritorio es un riel vertical en el costado izquierdo, que si no queda
 * vacío. Cada categoría se muestra como círculo con una foto suya: se reconoce
 * de un vistazo, sin leer, que es lo que corresponde en una vista pensada para
 * deslizar rápido.
 *
 * EN MÓVIL baja a una fila deslizable, y ahí es donde estaba fea:
 *
 * - Era una franja negra opaca de 104px metida entre el navbar y el reel, así
 *   que la pantalla arrancaba con 168px de controles antes de mostrar comida.
 *   Ahora el fondo es un degradado que se desvanece: el reel pasa por debajo y
 *   el carril flota encima, como en cualquier app de video.
 * - Los rótulos se cortaban ("Hamburgue...", "Menú Gri..."). Ahora usan la
 *   etiqueta corta de la categoría y caben enteros.
 * - Nada indicaba que la fila seguía hacia el lado. El difuminado del borde
 *   derecho lo dice sin ocupar espacio.
 * - Le reservaba 140px al reel, con lo que la foto arrancaba bajo una franja
 *   negra. Ahora no reserva nada: el degradado se apoya sobre la foto.
 */
export function FiltroCategorias({
  platos,
  activa,
  onCambiar,
  cantidadFavoritos,
}: {
  platos: Plato[];
  activa: FiltroReel;
  onCambiar: (c: FiltroReel) => void;
  cantidadFavoritos: number;
}) {
  /** Primera foto disponible de cada categoría, para la miniatura. */
  const portada = (id: CategoriaId) =>
    platos.find((p) => p.categoria === id && p.disponible)?.portada.src;

  const conPlatos = categorias.filter((c) =>
    platos.some((p) => p.categoria === c.id),
  );

  return (
    /*
      `top-24` y no `top-16` EN MOVIL: el navbar termina en los 66px y el
      carril arrancaba en 64, o sea pegados. Se baja a 96 para abrir la franja
      donde vive la barra de progreso del carrusel, que va entre los dos.
      Si se vuelve a subir, la barra queda tapada por el navbar.

      SIN FONDO, en ninguna medida. El carril llevaba un degradado oscuro que
      se leia como una banda gris pegada encima de la comida, y desde que bajo
      a `top-24` cae entero sobre la foto, asi que quedo aun mas a la vista.
      Ahora flota: los circulos y los rotulos van directo sobre el medio.

      ESO MUEVE LA LEGIBILIDAD A LA SOMBRA. Sin fondo detras, lo unico que
      separa cada rotulo de la foto es su `drop-shadow`. Si alguien la quita,
      el texto desaparece sobre cualquier plato claro.
    */
    <div
      role="group"
      aria-label="Filtrar reels por categoría"
      className="pointer-events-auto fixed left-0 right-0 top-24 z-30 flex gap-4 overflow-x-auto px-4 pb-6 pt-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:right-auto lg:top-1/2 lg:w-28 lg:-translate-y-1/2 lg:flex-col lg:gap-3 lg:overflow-visible lg:p-0 [mask-image:linear-gradient(to_right,#000_88%,transparent_100%)] lg:[mask-image:none]"
    >
      <Circulo
        activa={activa === "todas"}
        onClick={() => onCambiar("todas")}
        etiqueta="Todo"
      />

      {/* Favoritos solo aparece cuando hay alguno: un filtro que siempre
          devuelve vacio es una promesa rota. */}
      {cantidadFavoritos > 0 && (
        <Circulo
          activa={activa === "favoritos"}
          onClick={() => onCambiar("favoritos")}
          etiqueta={`Favoritos (${cantidadFavoritos})`}
          icono="corazon"
        />
      )}
      {conPlatos.map((c) => (
        <Circulo
          key={c.id}
          activa={activa === c.id}
          onClick={() => onCambiar(c.id)}
          etiqueta={c.corto ?? c.nombre}
          foto={portada(c.id)}
        />
      ))}
    </div>
  );
}

function Circulo({
  activa,
  onClick,
  etiqueta,
  foto,
  icono,
}: {
  activa: boolean;
  onClick: () => void;
  etiqueta: string;
  foto?: string;
  icono?: "corazon";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activa}
      className="flex w-16 shrink-0 flex-col items-center gap-1.5 lg:w-full"
    >
      <span
        className={`grid size-10 place-items-center overflow-hidden rounded-full transition-all duration-200 lg:size-16 ${
          activa
            ? "ring-2 ring-acento ring-offset-2 ring-offset-base"
            : "opacity-60 hover:opacity-100"
        }`}
      >
        {foto ? (
          <Image
            src={foto}
            alt=""
            width={64}
            height={64}
            className="size-full object-cover"
          />
        ) : icono === "corazon" ? (
          <span className="grid size-full place-items-center bg-superficie text-acento">
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 lg:size-6" aria-hidden="true">
              <path d="M20.8 5.6a5.2 5.2 0 0 0-7.4 0L12 7l-1.4-1.4a5.2 5.2 0 1 0-7.4 7.4L12 21.5l8.8-8.5a5.2 5.2 0 0 0 0-7.4Z" />
            </svg>
          </span>
        ) : (
          // "Todo" no tiene foto propia: lleva la llama de la marca.
          <span className="grid size-full place-items-center bg-superficie">
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-acento lg:size-6" aria-hidden="true">
              <path d="M12 2c1.5 3.1.3 4.8-.7 6.1-1.2 1.6-2 2.9-2 4.8 0 3.1 2.6 5.6 5.7 5.6s5.6-2.5 5.6-5.6c0-2.3-1.2-3.7-2.6-5.6.4 1.3.2 2.4-.6 3 .5-2.6-1.3-5.9-5.4-8.3z" />
            </svg>
          </span>
        )}
      </span>
      {/*
        `leading-none` y no `leading-tight`: con el rotulo de una sola linea,
        el interlineado sobrante empujaba el carril 6px mas abajo por nada.

        El texto activo va en blanco y no en naranja: sobre el degradado del
        carril el naranja se acerca al minimo de contraste, y el anillo naranja
        del circulo ya dice cual esta escogida.
      */}
      <span
        className={`w-full text-center text-[10px] leading-none drop-shadow-[0_1px_3px_rgba(5,5,5,0.95)] lg:text-[11px] ${
          activa ? "font-semibold text-texto" : "text-texto-suave"
        }`}
      >
        {etiqueta}
      </span>
    </button>
  );
}
