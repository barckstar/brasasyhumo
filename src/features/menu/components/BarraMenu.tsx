"use client";

import { useEffect, useRef } from "react";
import { useNavbarOculto } from "@/shared/lib/useNavbarOculto";
import { Contenedor } from "@/shared/components/ui/Contenedor";
import { IconoCorazon } from "@/shared/components/ui/Iconos";
import type { Categoria, FiltroCatalogo } from "@/shared/types/menu";

/**
 * Barra fija del menu: alternador de vista y filtro de categorias.
 *
 * Va a ANCHO COMPLETO, fuera del Contenedor, con fondo opaco y borde inferior.
 * Antes vivia dentro del Contenedor y su fondo solo cubria el ancho de la
 * columna: las tarjetas se veian pasar por los costados.
 *
 * SIGUE AL NAVBAR: cuando el navbar se esconde al bajar, esta barra sube a
 * ocupar su lugar (top-0). Si se quedara fija en top-16 quedaria una franja
 * de 64px por la que se verian pasar las tarjetas.
 */
export function BarraMenu({
  filtro,
  onCambiarFiltro,
  categorias,
  cantidadFavoritos,
}: {
  filtro: FiltroCatalogo;
  onCambiarFiltro: (c: FiltroCatalogo) => void;
  categorias: Categoria[];
  cantidadFavoritos: number;
}) {
  const navbarOculto = useNavbarOculto();
  const carril = useRef<HTMLDivElement>(null);

  /*
    Convierte la rueda vertical del mouse en desplazamiento horizontal.

    El carril siempre fue desplazable — 560px de chips en 241 visibles — pero
    con un mouse no habia forma de moverlo: la rueda vertical no desplaza
    contenedores horizontales, y hace falta Shift o un trackpad. Se sentia
    trabado. En movil el gesto tactil ya funcionaba solo.

    El listener se registra a mano y NO como onWheel de React porque necesita
    `passive: false` para poder llamar a preventDefault.
  */
  useEffect(() => {
    const nodo = carril.current;
    if (!nodo) return;

    function alGirarRueda(e: WheelEvent) {
      const n = carril.current;
      if (!n) return;
      // Si el gesto ya es horizontal (trackpad), se deja pasar tal cual.
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (n.scrollWidth <= n.clientWidth) return;
      e.preventDefault();
      // scroll-behavior smooth aqui rompia el desplazamiento por rueda: la
      // asignacion se encolaba como animacion y nunca llegaba a aplicarse.
      n.scrollLeft += e.deltaY;
    }

    nodo.addEventListener("wheel", alGirarRueda, { passive: false });
    return () => nodo.removeEventListener("wheel", alGirarRueda);
  }, []);

  return (
    <div
      className={`sticky z-30 border-b border-borde bg-base/95 backdrop-blur-md transition-[top] duration-300 ${
        navbarOculto ? "top-0" : "top-16"
      }`}
    >
      <Contenedor className="flex items-center gap-3 py-3">
        <div className="relative min-w-0 flex-1">
          <div
            ref={carril}
            role="group"
            aria-label="Filtrar por categoría"
            className="-mb-2 flex gap-2 overflow-x-auto pb-2 pr-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <Chip
              activo={filtro === "todas"}
              onClick={() => onCambiarFiltro("todas")}
            >
              Todo
            </Chip>

            {/* Favoritos solo aparece cuando hay alguno: un filtro que siempre
                devuelve vacio es una promesa rota. Va de segundo, antes que
                las categorias, porque es el atajo de quien ya sabe que pide. */}
            {cantidadFavoritos > 0 && (
              <Chip
                activo={filtro === "favoritos"}
                onClick={() => onCambiarFiltro("favoritos")}
              >
                <IconoCorazon lleno className="size-4" />
                Favoritos ({cantidadFavoritos})
              </Chip>
            )}

            {categorias.map((c) => (
              <Chip
                key={c.id}
                activo={filtro === c.id}
                onClick={() => onCambiarFiltro(c.id)}
              >
                {c.nombre}
              </Chip>
            ))}
          </div>

          {/*
            Degradado en el borde derecho: es el unico aviso de que hay mas
            categorias. Sin el, los chips se ven simplemente cortados y nadie
            adivina que el carril se desliza.
          */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-base to-transparent"
          />
        </div>
      </Contenedor>
    </div>
  );
}

function Chip({
  activo,
  onClick,
  children,
}: {
  activo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 font-display text-sm font-medium uppercase tracking-wide transition-colors ${
        activo
          ? "border-acento bg-acento text-base"
          : "border-borde text-texto-suave hover:border-acento/50 hover:text-acento-alt"
      }`}
    >
      {children}
    </button>
  );
}
