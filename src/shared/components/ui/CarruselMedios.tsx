"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Media } from "@/shared/types/menu";

/** Cuanto se queda una FOTO antes de pasar sola, en ms. */
const DURACION_FOTO = 4000;

/**
 * La galeria de un plato dentro del reel, al estilo de las historias de
 * Instagram: barra de segmentos arriba, avance automatico, y deslizar o tocar
 * a los lados para moverse a mano.
 *
 * Es el carrusel horizontal metido dentro del reel vertical: el carril de
 * afuera (VistaReels) hace `snap-y` entre platos y este hace `snap-x` entre
 * medios del mismo plato. Funciona porque este carril NO desborda en vertical,
 * asi que un deslizamiento hacia arriba pasa de largo hasta el padre.
 *
 * VIVE EN `shared` y no en `features/reels` porque la usan DOS features: el
 * menu en video y la hoja de detalle del plato. La regla dura del proyecto es
 * que una feature nunca importa de otra, asi que lo compartido sube.
 *
 * LA BARRA REEMPLAZO A LOS PUNTITOS Y TAMBIEN AL GUINO. Antes el carril se
 * corria 26px la primera vez para ensenar el gesto; con una barra que avanza
 * sola eso sobra, porque el propio movimiento ya dice que hay mas de un medio.
 *
 * CONTROL DE PESO, que es lo que decide si /menu/video pasa de 95 en
 * Lighthouse:
 *   - Todo video arranca en `preload="none"`: hasta que no se reproduce no baja
 *     un solo byte. Lo que se ve mientras tanto es el poster.
 *   - Corre UN video en todo el sitio: el de la lamina activa, y solo si su
 *     plato esta en pantalla.
 *   - La barra se pinta escribiendo una `transform` en el DOM desde un
 *     `requestAnimationFrame`, NO con estado de React. A 60 cuadros por
 *     segundo, un `setState` por cuadro haria re-renderizar el reel entero
 *     sesenta veces por segundo.
 */
export function CarruselMedios({
  medios,
  reproducir,
  nombre,
  variante = "reel",
}: {
  medios: Media[];
  /** true mientras el plato esta a la vista en el carril vertical. */
  reproducir: boolean;
  nombre: string;
  /**
   * `reel` pasa de lamina sola, como una historia.
   *
   * `detalle` NO: en la hoja de detalle la gente esta leyendo la descripcion y
   * decidiendo si pide, no mirando un recorrido. Que la foto cambie sola
   * mientras se lee estorba. Ahi la barra queda de indicador de posicion y se
   * avanza deslizando, tocando un segmento o tocando a los lados.
   *
   * El VIDEO si corre en las dos: verlo es justamente el punto.
   */
  variante?: "reel" | "detalle";
}) {
  const carril = useRef<HTMLDivElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const rellenos = useRef<(HTMLSpanElement | null)[]>([]);
  const [activo, setActivo] = useState(0);

  const varios = medios.length > 1;

  const irA = useCallback(
    (i: number) => {
      const nodo = carril.current;
      if (!nodo) return;
      const destino = Math.max(0, Math.min(medios.length - 1, i));
      nodo.scrollTo({ left: nodo.clientWidth * destino, behavior: "smooth" });
    },
    [medios.length],
  );

  // Que lamina esta a la vista. El observador usa el carril como raiz, no el
  // viewport: lo que importa es la posicion dentro del carrusel.
  useEffect(() => {
    const nodo = carril.current;
    if (!nodo || !varios) return;
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          const i = Number((e.target as HTMLElement).dataset.indice);
          if (!Number.isNaN(i)) setActivo(i);
        }
      },
      { root: nodo, threshold: 0.6 },
    );
    for (const hijo of nodo.children) obs.observe(hijo);
    return () => obs.disconnect();
  }, [varios]);

  // Un solo video corriendo: el de la lamina activa, y solo si el plato esta
  // en pantalla. Al salir de una lamina su video vuelve a cero, para que la
  // proxima vez arranque desde el principio como en una historia.
  useEffect(() => {
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (reproducir && i === activo) {
        v.play().catch(() => {
          // El navegador puede bloquear la reproduccion automatica; queda el
          // poster, asi que no hay nada que reparar.
        });
      } else {
        v.pause();
        if (i !== activo) v.currentTime = 0;
      }
    });
  }, [reproducir, activo]);

  // La barra: pinta el avance y pasa sola de lamina.
  useEffect(() => {
    if (!varios) return;

    const pintar = (i: number, p: number) => {
      const el = rellenos.current[i];
      if (el) el.style.transform = `scaleX(${p})`;
    };
    // Las ya vistas llenas, las que faltan vacias.
    medios.forEach((_, i) => pintar(i, i < activo ? 1 : 0));

    // En la hoja de detalle la barra solo dice donde se esta.
    if (variante === "detalle") {
      pintar(activo, 1);
      return;
    }

    if (!reproducir) return;

    /*
      Con movimiento reducido NO se avanza solo. Mover la pantalla sin que
      nadie la toque es justo lo que esa preferencia pide evitar; la barra
      queda como indicador de posicion y los segmentos siguen siendo botones.
    */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      pintar(activo, 1);
      return;
    }

    const v = videos.current[activo];
    const inicio = performance.now();
    let cuadro = 0;

    const paso = (ahora: number) => {
      let p: number;
      /*
        Un video manda su propio ritmo. Si todavia no sabe cuanto dura
        —lleva `preload="none"` y aun no bajo los metadatos— se usa el reloj,
        para no dejar la barra congelada en NaN.
      */
      if (v && Number.isFinite(v.duration) && v.duration > 0) {
        p = v.currentTime / v.duration;
      } else {
        p = (ahora - inicio) / DURACION_FOTO;
      }
      p = Math.min(1, Math.max(0, p));
      pintar(activo, p);
      if (p >= 0.999) {
        // La ultima no salta de plato: el carril vertical es el eje principal
        // y avanzar solo hasta el siguiente plato seria decidir por quien mira.
        if (activo < medios.length - 1) irA(activo + 1);
        return;
      }
      cuadro = requestAnimationFrame(paso);
    };
    cuadro = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(cuadro);
  }, [activo, reproducir, medios, varios, irA, variante]);

  /*
    Tocar a los lados, como en una historia.

    NO se ponen botones encima del carril: un elemento por arriba se comeria el
    gesto de deslizar, porque en tactil el toque llega al elemento superior y
    no al contenedor de scroll que esta debajo. Escuchando el clic en el propio
    carril, deslizar sigue funcionando y un toque sin arrastre dispara esto.
  */
  const tocar = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!varios) return;
    if ((e.target as HTMLElement).closest("button")) return;
    const caja = e.currentTarget.getBoundingClientRect();
    const enLaMitadIzquierda = e.clientX - caja.left < caja.width / 2;
    irA(enLaMitadIzquierda ? activo - 1 : activo + 1);
  };

  return (
    <>
      <div
        ref={carril}
        onClick={tocar}
        {...(varios
          ? {
              role: "group" as const,
              "aria-label": `Fotos y videos de ${nombre}`,
            }
          : {})}
        className="absolute inset-0 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {medios.map((m, i) => (
          <div
            key={m.src}
            data-indice={i}
            className="relative h-full w-full shrink-0 snap-center snap-always"
            {...(varios
              ? {
                  role: "group" as const,
                  "aria-label": `${i + 1} de ${medios.length}`,
                }
              : {})}
          >
            {m.tipo === "video" ? (
              <video
                ref={(el) => {
                  videos.current[i] = el;
                }}
                src={m.src}
                poster={m.poster}
                muted
                /*
                  Repite SOLO si es el unico medio. Con galeria, que el video
                  termine es justamente lo que hace pasar a la siguiente lamina.
                */
                loop={!varios}
                playsInline
                preload="none"
                aria-hidden="true"
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              <Image
                src={m.src}
                alt={m.alt}
                fill
                sizes="(min-width: 1024px) 48vh, 100vw"
                className="object-cover"
              />
            )}
          </div>
        ))}
      </div>

      {varios && (
        /*
          EN MOVIL la barra va ENTRE EL NAVBAR Y EL CARRIL de categorias.

          Esa franja no existia: el navbar termina en los 66px y el carril
          arrancaba en 64, pegados. Se bajo el carril a `top-24` (96px) para
          abrirla. Los dos numeros van juntos: si el carril vuelve a subir, la
          barra queda tapada.

          Desde `lg` el carril se va al costado y la tarjeta ya arranca debajo
          del navbar (ver el `lg:pt-20` de ReelPlato), asi que ahi va arriba
          del todo.

          Cada segmento se ve de 3px pero su boton mide 24 de alto: un blanco
          de toque del tamano de la linea reprueba en Lighthouse y es inusable
          con el pulgar.

          En la hoja de detalle no hay carril de categorias, asi que la barra
          va arriba del todo — pero SANGRADA a los costados: en las esquinas
          superiores estan la X de cerrar y el corazon de favoritos, y una
          barra a todo el ancho les pasaria por encima.
        */
        <div
          className={`pointer-events-none absolute z-10 flex gap-1 drop-shadow-[0_1px_4px_rgba(5,5,5,0.95)] ${
            variante === "detalle"
              ? "left-14 right-14 top-3"
              : "inset-x-0 top-[4.25rem] px-3 lg:top-3"
          }`}
        >
          {medios.map((m, i) => (
            <button
              key={m.src}
              type="button"
              onClick={() => irA(i)}
              aria-label={`Ver medio ${i + 1} de ${medios.length}`}
              aria-current={i === activo}
              className="pointer-events-auto grid h-6 flex-1 items-center"
            >
              {/*
                La sombra va en el CONTENEDOR de la barra, no aqui: aplicada a
                cada pista se recortaba con el `overflow-hidden` y no separaba
                nada. Sobre una foto clara, una linea blanca al 35% sin sombra
                desaparece.
              */}
              <span className="block h-[3px] w-full overflow-hidden rounded-full bg-texto/35">
                <span
                  ref={(el) => {
                    rellenos.current[i] = el;
                  }}
                  className="block h-full origin-left rounded-full bg-texto"
                  style={{ transform: `scaleX(${i < activo ? 1 : 0})` }}
                />
              </span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
