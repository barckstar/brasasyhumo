"use client";

import { useState } from "react";
import { negocio } from "@/shared/config/negocio";

/**
 * Botón de compartir.
 *
 * Usa la Web Share API cuando el dispositivo la tiene — en móvil abre la hoja
 * nativa del sistema, la misma de siempre, con WhatsApp, Instagram y todo lo
 * que el usuario tenga instalado. Es gratis y no requiere ningún SDK.
 *
 * En escritorio casi ningún navegador la implementa, así que cae a copiar el
 * enlace al portapapeles y avisar. Nunca queda sin hacer nada.
 */
export function BotonCompartir({
  className,
  children,
  titulo,
  texto,
  url,
}: {
  className?: string;
  children?: React.ReactNode;
  titulo?: string;
  texto?: string;
  url?: string;
}) {
  const [copiado, setCopiado] = useState(false);

  async function compartir() {
    const destino =
      url ?? (typeof window !== "undefined" ? window.location.href : "");
    const datos = {
      title: titulo ?? `${negocio.nombre} — ${negocio.ciudad}`,
      text: texto ?? negocio.tagline,
      url: destino,
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(datos);
        return;
      } catch {
        // El usuario cancela la hoja nativa: no es un error, no se avisa nada.
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(destino);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2200);
    } catch {
      // Portapapeles bloqueado: se abre WhatsApp Web como última salida.
      window.open(
        `https://wa.me/?text=${encodeURIComponent(`${datos.text} ${destino}`)}`,
        "_blank",
        "noopener,noreferrer",
      );
    }
  }

  return (
    <button type="button" onClick={compartir} className={className}>
      {children ?? (
        <>
          <IconoCompartir className="size-5" />
          <span className="sr-only">
            {copiado ? "Enlace copiado" : "Compartir"}
          </span>
        </>
      )}
      {copiado && (
        <span role="status" className="sr-only">
          Enlace copiado al portapapeles
        </span>
      )}
    </button>
  );
}

export function IconoCompartir({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 13.5 15.4 17.5" />
      <path d="M15.4 6.5 8.6 10.5" />
    </svg>
  );
}
