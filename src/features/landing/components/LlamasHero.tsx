"use client";

import { useEffect, useRef } from "react";

/**
 * Llamas que suben desde la curva inferior del hero.
 *
 * VIDEO Y NO GIF: un GIF de fuego a este tamano pesa varios MB y no tiene
 * control de carga. Esto son 456 KB en WebM, con MP4 de respaldo.
 *
 * Es un clip de fuego SOBRE NEGRO con `mix-blend-mode: screen`: en modo
 * pantalla el negro no suma nada, asi que desaparece y solo quedan las llamas.
 *
 * `preload="none"` y se arranca en el evento `load`: el hero ya tiene su LCP
 * (la foto de fondo) y este video no debe competirle ancho de banda.
 * Con prefers-reduced-motion no se reproduce: sin `play()` y con
 * `preload="none"` ni siquiera se descarga.
 */
export function LlamasHero() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // `autoplay` ademas de `play()`: el navegador pausa los videos mudos que
    // salen de pantalla o de una pestana oculta, y solo reanuda solo los que
    // tienen `autoplay`. `play()` rechaza si se bloquea el autoplay; no es un
    // error, simplemente no hay llamas.
    const arrancar = () => {
      video.autoplay = true;
      void video.play().catch(() => {});
    };
    if (document.readyState === "complete") {
      arrancar();
      return;
    }
    window.addEventListener("load", arrancar, { once: true });
    return () => window.removeEventListener("load", arrancar);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[34%] mix-blend-screen sm:h-[38%]"
      style={{
        // Las puntas se disuelven hacia arriba: sin esto el borde superior del
        // cuadro cortaba las llamas en seco.
        maskImage: "linear-gradient(to top, #000 45%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to top, #000 45%, transparent 100%)",
      }}
    >
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        className="h-full w-full object-cover object-bottom"
      >
        <source src="/platos/videos/llamas-hero.webm" type="video/webm" />
        <source src="/platos/videos/llamas-hero.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
