"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconoVideo, IconoCuadros } from "@/shared/components/ui/Iconos";

/**
 * Alternador entre las dos presentaciones del menú.
 *
 * Vive en el NAVBAR y no dentro del menú, y navega entre dos rutas en vez de
 * cambiar un estado. La razón es arquitectónica: las dos vistas dejaron de ser
 * dos modos de un componente para volverse dos experiencias distintas —los
 * reels tienen proporciones, controles y navegación propios— así que cada una
 * se desarrolla y se optimiza por separado sin estorbarle a la otra.
 *
 * Solo se muestra estando dentro del menú: en el inicio no tendría sentido.
 */
export function SwitchVista({ className }: { className?: string }) {
  const ruta = usePathname();
  const enMenu = ruta?.startsWith("/menu") ?? false;
  if (!enMenu) return null;

  const enVideo = ruta === "/menu/video";

  return (
    <div
      role="group"
      aria-label="Forma de ver el menú"
      className={`relative inline-flex shrink-0 rounded-full border border-borde bg-superficie p-1 ${className ?? ""}`}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-1 w-9 rounded-full bg-acento transition-transform duration-300 ${
          enVideo ? "translate-x-9" : "translate-x-0"
        }`}
        style={{ left: "0.25rem" }}
      />

      <Link
        href="/menu"
        aria-current={!enVideo ? "page" : undefined}
        aria-label="Ver el menú en cuadrícula"
        className={`relative z-10 grid size-9 place-items-center rounded-full transition-colors ${
          !enVideo ? "text-base" : "text-texto-suave hover:text-acento-alt"
        }`}
      >
        <IconoCuadros className="size-[18px]" />
      </Link>

      <Link
        href="/menu/video"
        aria-current={enVideo ? "page" : undefined}
        aria-label="Ver el menú en video"
        className={`relative z-10 grid size-9 place-items-center rounded-full transition-colors ${
          enVideo ? "text-base" : "text-texto-suave hover:text-acento-alt"
        }`}
      >
        <IconoVideo className="size-[18px]" />
      </Link>
    </div>
  );
}
