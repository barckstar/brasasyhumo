"use client";

import { useEffect, useRef, useState } from "react";
import { CarruselMedios } from "@/shared/components/ui/CarruselMedios";
import { formatoColones } from "@/shared/lib/formatoColones";
import { useCarrito } from "@/shared/lib/carrito";
import { IconoCarrito, IconoCorazon } from "@/shared/components/ui/Iconos";
import { BotonCompartir, IconoCompartir } from "@/shared/components/ui/BotonCompartir";

import { alternarFavorito, useFavoritos } from "@/shared/lib/favoritos";
import type { Plato } from "@/shared/types/menu";
import { negocio } from "@/shared/config/negocio";

/**
 * Un plato en formato reel, con la estructura de YouTube Shorts: el medio en
 * proporcion vertical al centro, el riel de acciones pegado a su costado y la
 * informacion abajo a la izquierda.
 *
 * En escritorio el espacio sobrante de los lados deja de desperdiciarse: el
 * riel de acciones se sale del medio y respira aparte, como en Shorts.
 *
 * El medio puede ser uno o varios: `CarruselMedios` los desliza en horizontal
 * dentro del reel y se encarga del control de peso (nunca corre mas de un
 * video en todo el sitio).
 */
export function ReelPlato({ plato }: { plato: Plato }) {
  const seccion = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const { agregar, cambiarCantidad, cantidadDe, abrir } = useCarrito();
  const cantidad = cantidadDe(plato.id);

  // Favoritos del dispositivo. Se leen del almacen externo, igual que el
  // carrito, para no hidratar con setState dentro de un efecto.
  const esFavorito = useFavoritos().includes(plato.id);

  useEffect(() => {
    const nodo = seccion.current;
    if (!nodo) return;
    const obs = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { threshold: 0.6 },
    );
    obs.observe(nodo);
    return () => obs.disconnect();
  }, []);

  return (
    /*
      `lg:pt-20` y no `lg:py-4`: el navbar es `fixed` y termina en los 65px.
      Con 1rem de relleno la tarjeta nacia en y=32, o sea DEBAJO del navbar, y
      se comia los primeros 33px del medio junto con la barra de progreso
      entera. Medido, no estimado. En movil no pasa: ahi el medio es de
      pantalla completa a proposito y la barra va debajo del carril.
    */
    <section
      ref={seccion}
      className="relative flex h-[100dvh] w-full snap-start snap-always items-center justify-center lg:px-6 lg:pb-4 lg:pt-20"
      aria-label={plato.nombre}
    >
      <div className="flex h-full w-full items-end justify-center lg:gap-4">
        {/* El medio, en proporcion vertical de reel */}
        {/* Las dos maquetas del medio viven en `.reel-medio`, en globals.css. */}
        {/*
          Redondeado SOLO ARRIBA. Con las cuatro esquinas redondeadas el borde
          inferior se leia como un corte: la tarjeta terminaba a la vista y
          debajo quedaba el negro de la pagina. Con el canto recto, el medio se
          funde con el fondo y parece continuar.
        */}
        <div className="reel-medio relative overflow-hidden bg-superficie lg:rounded-t-2xl">
          <div className="relative size-full">
            {/*
              La galeria completa, en el orden que define galerias.json. Un
              plato con un solo medio no muestra puntos ni desliza.
            */}
            <CarruselMedios
              medios={plato.medios}
              reproducir={visible}
              nombre={plato.nombre}
            />

            {/*
              Velo para que el texto se lea sobre cualquier foto.

              `pointer-events-none`: es decorativo y cubre el medio entero, asi
              que sin esto se traga el toque a los lados que pasa de lamina.
            */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-base via-base/40 to-transparent"
            />

            {/* Informacion abajo a la izquierda, como en Shorts */}
            {/*
              `pb-24` deja libre la franja inferior donde flota el boton de
              "Ver pedido": antes se montaba encima del precio y la descripcion.
            */}
            <div className="absolute inset-x-0 bottom-0 p-4 pb-24 pr-16 sm:p-5 sm:pb-24 lg:pr-5">
              <p className="precio-contorneado font-display text-3xl font-bold text-acento sm:text-4xl">
                {formatoColones(plato.precio)}
              </p>
              <h2 className="mt-1 font-display text-xl font-bold uppercase italic leading-tight text-texto drop-shadow-[0_2px_6px_rgba(5,5,5,0.85)] sm:text-2xl">
                {plato.nombre}
              </h2>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-texto-suave drop-shadow-[0_1px_4px_rgba(5,5,5,0.9)]">
                {plato.descripcion}
              </p>
              {!plato.disponible && (
                <p className="mt-2 inline-block rounded-full bg-base/80 px-3 py-1 text-xs uppercase tracking-wider text-texto-suave">
                  Agotado por hoy
                </p>
              )}
            </div>
          </div>
        </div>

        {/*
          RIEL DE ACCIONES, al estilo de TikTok: iconos de trazo sueltos sobre
          el video, con su rotulo debajo. Nada de discos de fondo —cada uno era
          un circulo relleno y seis circulos apilados tapaban la comida, que es
          lo unico que la pagina tiene que vender—. La legibilidad la da la
          sombra del icono, no una caja.

          En movil flota sobre el medio, pegado a la derecha y por encima del
          boton de "Ver pedido". Desde `lg` sale del medio y respira aparte.
        */}
        <div className="absolute bottom-28 right-4 z-10 flex shrink-0 flex-col items-center gap-6 lg:static lg:pb-4">
          {plato.disponible ? (
            cantidad === 0 ? (
              <AccionRiel etiqueta="Agregar" onClick={() => agregar(plato)} activa>
                <IconoMas className="size-9" />
              </AccionRiel>
            ) : (
              /* Con unidades en el pedido, el "+" conserva su sitio y la
                 cantidad ocupa el lugar del rotulo, igual que un contador de
                 me gusta. El "−" cuelga debajo, mas discreto. */
              <div className="flex flex-col items-center gap-1 drop-shadow-[0_2px_6px_rgba(5,5,5,0.9)]">
                <button
                  type="button"
                  onClick={() => cambiarCantidad(plato.id, cantidad + 1)}
                  aria-label={`Agregar otra unidad de ${plato.nombre}`}
                  className="text-acento transition-transform active:scale-90"
                >
                  <IconoMas className="size-9" />
                </button>
                <span className="font-display text-sm font-bold text-texto">
                  {cantidad}
                </span>
                <button
                  type="button"
                  onClick={() => cambiarCantidad(plato.id, cantidad - 1)}
                  aria-label={`Quitar una unidad de ${plato.nombre}`}
                  className="mt-1 text-texto-suave transition-colors hover:text-acento"
                >
                  <IconoMenos className="size-6" />
                </button>
              </div>
            )
          ) : null}

          <AccionRiel
            etiqueta={esFavorito ? "Guardado" : "Guardar"}
            onClick={() => alternarFavorito(plato.id)}
            activa={esFavorito}
          >
            <IconoCorazon lleno={esFavorito} className="size-8" />
          </AccionRiel>

          <AccionRiel etiqueta="Pedido" onClick={abrir}>
            <IconoCarrito className="size-8" />
          </AccionRiel>

          <BotonCompartir
            titulo={`${plato.nombre} — ${negocio.nombre}`}
            texto={plato.descripcion}
            className="grid place-items-center text-texto drop-shadow-[0_2px_6px_rgba(5,5,5,0.9)]"
          >
            <IconoCompartir className="size-8" />
            <span className="sr-only">Compartir</span>
          </BotonCompartir>
        </div>
      </div>
    </section>
  );
}

function AccionRiel({
  etiqueta,
  onClick,
  activa,
  children,
}: {
  etiqueta: string;
  onClick: () => void;
  activa?: boolean;
  children: React.ReactNode;
}) {
  return (
    /*
      El rotulo va en `aria-label` y no debajo del icono. Visualmente sobra
      —un corazon y un carrito no necesitan pie de foto— pero el boton sigue
      necesitando nombre accesible: sin el, un lector de pantalla anuncia
      "boton" y nada mas.
    */
    <button
      type="button"
      onClick={onClick}
      aria-label={etiqueta}
      className={`grid place-items-center drop-shadow-[0_2px_6px_rgba(5,5,5,0.9)] transition-transform active:scale-90 ${
        activa ? "text-acento" : "text-texto"
      }`}
    >
      {children}
    </button>
  );
}

/** Un "+" de trazo, para que combine con los demas iconos del riel. */
function IconoMas({ className = "size-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

/** El "−" del contador, con el mismo trazo que el "+". */
function IconoMenos({ className = "size-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 12h14" />
    </svg>
  );
}
