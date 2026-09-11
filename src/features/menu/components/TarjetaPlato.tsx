"use client";

import Image from "next/image";
import { formatoColones } from "@/shared/lib/formatoColones";
import { useCarrito } from "@/shared/lib/carrito";
import { useDetallePlato } from "@/shared/lib/detallePlato";
import { IconoCorazon } from "@/shared/components/ui/Iconos";

import { alternarFavorito, useFavoritos } from "@/shared/lib/favoritos";
import type { Plato } from "@/shared/types/menu";

/**
 * Tarjeta de plato al estilo de las apps de delivery: foto con esquinas
 * redondeadas, boton "+" sobrepuesto en la esquina de la foto, y nombre,
 * precio y descripcion debajo.
 *
 * El patron es deliberado: el usuario ya sabe usarlo por Uber Eats, asi que no
 * hay que ensenarle nada. Tocar la tarjeta abre el detalle; el "+" agrega
 * directo sin abrirlo, para el que ya sabe lo que quiere.
 *
 * Los tres botones —foto, "+" y corazon— son HERMANOS y no van anidados: un
 * boton dentro de otro es HTML invalido y el navegador decide solo cual gana.
 */
export function TarjetaPlato({ plato }: { plato: Plato }) {
  const { agregar, cantidadDe } = useCarrito();
  const { abrirDetalle } = useDetallePlato();
  const cantidad = cantidadDe(plato.id);

  const esFavorito = useFavoritos().includes(plato.id);

  return (
    <article className={plato.disponible ? "" : "opacity-55"}>
      <div className="relative">
        <button
          type="button"
          onClick={() => abrirDetalle(plato)}
          aria-label={`Ver ${plato.nombre}`}
          className="block w-full overflow-hidden rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento"
        >
          <span className="relative block aspect-4/3 bg-superficie">
            <Image
              src={plato.portada.src}
              alt={plato.portada.alt}
              fill
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 50vw"
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </span>
        </button>

        {/*
          El corazon va arriba a la derecha y el "+" abajo: separados, para que
          nadie guarde un plato creyendo que lo estaba pidiendo.
        */}
        <button
          type="button"
          onClick={() => alternarFavorito(plato.id)}
          aria-pressed={esFavorito}
          aria-label={
            esFavorito
              ? `Quitar ${plato.nombre} de favoritos`
              : `Guardar ${plato.nombre} en favoritos`
          }
          className={`absolute right-2 top-2 grid size-9 place-items-center rounded-full bg-base/90 shadow-lg backdrop-blur-sm transition-all duration-200 active:scale-90 ${
            esFavorito ? "text-acento" : "text-texto hover:text-acento"
          }`}
        >
          <IconoCorazon lleno={esFavorito} className="size-5" />
        </button>

        {!plato.disponible ? (
          <span className="absolute left-2 top-2 rounded-full bg-base/85 px-2.5 py-1 font-display text-[10px] font-semibold uppercase tracking-wider text-texto-suave">
            Agotado
          </span>
        ) : cantidad > 0 ? (
          // Ya en el carrito: el contador reemplaza al "+", como en Uber Eats.
          <button
            type="button"
            onClick={() => abrirDetalle(plato)}
            aria-label={`${plato.nombre}: ${cantidad} en el pedido. Toque para ajustar`}
            className="absolute bottom-2 right-2 grid size-9 place-items-center rounded-full bg-acento font-display text-sm font-bold text-base shadow-lg transition-transform duration-200 active:scale-90"
          >
            {cantidad}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => agregar(plato)}
            aria-label={`Agregar ${plato.nombre} al pedido`}
            className="absolute bottom-2 right-2 grid size-9 place-items-center rounded-full bg-base/90 text-xl leading-none text-texto shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-acento hover:text-base active:scale-90"
          >
            <span aria-hidden="true" className="-mt-0.5">
              +
            </span>
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => abrirDetalle(plato)}
        className="mt-2.5 block w-full text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento"
      >
        <h3 className="font-display text-base font-semibold uppercase italic leading-tight tracking-wide text-texto">
          {plato.nombre}
        </h3>
        <p className="mt-1 font-display text-lg font-bold text-acento">
          {formatoColones(plato.precio)}
        </p>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-texto-suave">
          {plato.descripcion}
        </p>
      </button>
    </article>
  );
}
