"use client";

import Image from "next/image";
import { formatoColones } from "@/shared/lib/formatoColones";
import { useDetallePlato } from "@/shared/lib/detallePlato";
import type { Plato } from "@/shared/types/menu";

/**
 * Tarjeta de plato destacado del inicio.
 *
 * Antes era un enlace a /menu: tocar la foto de la costilla llevaba a la
 * cuadrícula completa y el cliente tenía que volver a buscar la costilla entre
 * treinta y cinco platos. Ahora abre la misma hoja de detalle del menú, con su
 * cantidad, su nota para la cocina y su botón de agregar.
 *
 * Es un componente cliente aparte porque `Destacados` es de servidor y no puede
 * llevar un `onClick`. Se extrae solo la tarjeta, no la sección entera: así el
 * título, el antetítulo y el enlace al menú siguen siendo HTML del servidor.
 *
 * El botón va SUPERPUESTO sobre la tarjeta y no envolviéndola: un `<h3>` dentro
 * de un `<button>` es HTML inválido —el botón solo admite contenido de frase— y
 * el nombre del plato tiene que seguir siendo un encabezado.
 */
export function TarjetaDestacado({ plato }: { plato: Plato }) {
  const { abrirDetalle } = useDetallePlato();

  return (
    <article className="group relative h-full overflow-hidden rounded-2xl bg-superficie ring-1 ring-borde transition-transform duration-300 hover:-translate-y-1 focus-within:ring-acento">
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={plato.portada.src}
          alt={plato.portada.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl font-semibold uppercase tracking-wide text-texto">
          {plato.nombre}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-texto-suave">
          {plato.descripcion}
        </p>
        <p className="mt-4 font-display text-2xl font-bold text-acento">
          {formatoColones(plato.precio)}
        </p>
      </div>

      <button
        type="button"
        onClick={() => abrirDetalle(plato)}
        aria-label={`Ver ${plato.nombre}`}
        className="absolute inset-0 rounded-2xl focus:outline-none"
      />
    </article>
  );
}
