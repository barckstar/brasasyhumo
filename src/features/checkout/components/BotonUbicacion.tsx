"use client";

import { useState } from "react";
import { IconoMapa } from "@/shared/components/ui/Iconos";

type Estado = "inicial" | "buscando" | "listo" | "error";

/**
 * Captura la ubicacion del cliente con `navigator.geolocation`.
 *
 * Es API del navegador: no cuesta nada, no pide llave y no suma dependencias.
 * Lo unico que exige es HTTPS — funciona en localhost y en Vercel.
 *
 * NO se hace geocodificacion inversa (coordenadas a nombre de calle) porque eso
 * si requiere una API de pago. Tampoco hace falta: en Costa Rica las
 * direcciones son descriptivas, asi que el texto que escribe el cliente mas el
 * punto exacto es mejor combinacion que un nombre de calle.
 */
export function BotonUbicacion({
  onUbicacion,
  tieneUbicacion,
  onLimpiar,
}: {
  onUbicacion: (lat: number, lng: number) => void;
  tieneUbicacion: boolean;
  onLimpiar: () => void;
}) {
  const [estado, setEstado] = useState<Estado>("inicial");
  const [mensaje, setMensaje] = useState<string | null>(null);

  function pedirUbicacion() {
    if (!("geolocation" in navigator)) {
      setEstado("error");
      setMensaje("Tu navegador no permite compartir la ubicación.");
      return;
    }

    setEstado("buscando");
    setMensaje(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onUbicacion(pos.coords.latitude, pos.coords.longitude);
        setEstado("listo");
        setMensaje(null);
      },
      (err) => {
        setEstado("error");
        // Cada motivo necesita una salida distinta para el usuario.
        setMensaje(
          err.code === err.PERMISSION_DENIED
            ? "No se otorgó el permiso. Puede escribir las señas a mano."
            : err.code === err.TIMEOUT
              ? "La búsqueda tardó demasiado. Intente de nuevo o escriba las señas."
              : "No se pudo obtener la ubicación. Escriba las señas, por favor.",
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }

  if (tieneUbicacion) {
    return (
      <div className="mt-2 flex items-center gap-2 rounded-xl border border-acento/50 bg-acento/10 px-3 py-2.5">
        <IconoMapa className="size-4 shrink-0 text-acento" />
        <p className="flex-1 text-xs text-texto">
          Ubicación exacta lista. Se envía como enlace de mapa.
        </p>
        <button
          type="button"
          onClick={() => {
            onLimpiar();
            setEstado("inicial");
          }}
          className="shrink-0 text-xs text-texto-suave underline transition-colors hover:text-acento"
        >
          Quitar
        </button>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={pedirUbicacion}
        disabled={estado === "buscando"}
        className="inline-flex items-center gap-2 rounded-xl border border-borde px-3 py-2.5 text-xs text-texto transition-colors hover:border-acento/60 hover:text-acento disabled:opacity-60"
      >
        <IconoMapa className="size-4" />
        {estado === "buscando" ? "Buscando…" : "Usar mi ubicación exacta"}
      </button>

      {mensaje && (
        <p role="status" className="mt-2 text-xs text-texto-suave">
          {mensaje}
        </p>
      )}
    </div>
  );
}
