"use client";

import Image from "next/image";
import { formatoColones } from "@/shared/lib/formatoColones";
import { useCarrito } from "@/shared/lib/carrito";
import { useDetallePlato } from "@/shared/lib/detallePlato";
import { ofertaComoPlato, type Oferta } from "../data/ofertas";
import { negocio } from "@/shared/config/negocio";

/**
 * Tarjeta de oferta con botón para sumarla al pedido.
 *
 * La foto viene recortada del arte original del cliente, sin su texto quemado:
 * el precio, el gancho y las restricciones los pone la tarjeta, y duplicarlos
 * dentro de la imagen se veía sucio.
 *
 * La restricción se muestra siempre que exista. Si el arte dice "no incluye
 * papas", la tarjeta lo dice: prometer de más aquí y aclararlo en el mostrador
 * es la forma más rápida de perder al cliente que llegó por la promoción.
 */
export function TarjetaOferta({ oferta }: { oferta: Oferta }) {
  const { agregar, cambiarCantidad, cantidadDe } = useCarrito();
  const { abrirDetalle } = useDetallePlato();
  const plato = ofertaComoPlato(oferta);
  const cantidad = cantidadDe(plato.id);

  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-borde bg-superficie transition-colors duration-300 hover:border-acento/50">
      <div className="relative aspect-4/3 bg-base-alt">
        <Image
          src={plato.portada.src}
          alt={`${oferta.titulo} en ${negocio.nombre}, ${negocio.ciudad}`}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          className="object-cover"
        />

        {oferta.gancho && (
          <span className="absolute left-3 top-3 rounded-full bg-acento px-3 py-1 font-display text-xs font-bold uppercase tracking-wide text-base shadow-lg">
            {oferta.gancho}
          </span>
        )}

        {cantidad === 0 ? (
          <button
            type="button"
            onClick={() => agregar(plato)}
            aria-label={`Agregar ${oferta.titulo} al pedido`}
            className="absolute bottom-3 right-3 z-10 grid size-11 place-items-center rounded-full bg-acento text-2xl leading-none text-base shadow-lg transition-transform duration-200 active:scale-90"
          >
            <span aria-hidden="true" className="-mt-0.5">
              +
            </span>
          </button>
        ) : (
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 rounded-full bg-acento px-1.5 py-1 text-base shadow-lg">
            <button
              type="button"
              onClick={() => cambiarCantidad(plato.id, cantidad - 1)}
              aria-label={`Quitar una unidad de ${oferta.titulo}`}
              className="grid size-8 place-items-center rounded-full text-lg font-bold transition-colors hover:bg-base/15"
            >
              −
            </button>
            <span className="min-w-5 text-center font-display font-bold">
              {cantidad}
            </span>
            <button
              type="button"
              onClick={() => cambiarCantidad(plato.id, cantidad + 1)}
              aria-label={`Agregar otra unidad de ${oferta.titulo}`}
              className="grid size-8 place-items-center rounded-full text-lg font-bold transition-colors hover:bg-base/15"
            >
              +
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold uppercase italic leading-tight text-texto">
          {oferta.titulo}
        </h3>
        {oferta.detalle && (
          <p className="mt-1 text-sm text-texto-suave">{oferta.detalle}</p>
        )}

        <p className="mt-3 font-display text-3xl font-bold text-acento">
          {formatoColones(oferta.precio)}
        </p>
        <p className="text-xs text-texto-suave">Impuestos incluidos</p>

        {oferta.restriccion && (
          <p className="mt-auto pt-4 text-xs leading-relaxed text-texto-suave/80">
            {oferta.restriccion}
          </p>
        )}
      </div>

      {/*
        Tocar la tarjeta abre la hoja de detalle, igual que en el menu. El
        boton va SUPERPUESTO y no envolviendo la tarjeta: un `<h3>` dentro de
        un `<button>` es HTML invalido. El "+" queda por encima con `z-10`,
        para que agregar directo siga funcionando.
      */}
      <button
        type="button"
        onClick={() => abrirDetalle(plato)}
        aria-label={`Ver ${oferta.titulo}`}
        className="absolute inset-0 rounded-2xl focus:outline-none"
      />
    </article>
  );
}
