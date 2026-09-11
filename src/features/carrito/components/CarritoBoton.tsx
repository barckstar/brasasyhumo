"use client";

import { useCarrito } from "@/shared/lib/carrito";
import { IconoCarrito } from "@/shared/components/ui/Iconos";
import { formatoColones } from "@/shared/lib/formatoColones";

/**
 * Boton flotante del carrito. Solo aparece cuando hay algo adentro: un
 * carrito vacio permanente en pantalla es ruido.
 */
export function CarritoBoton() {
  const { conteo, total, abrir } = useCarrito();
  if (conteo === 0) return null;

  return (
    <button
      type="button"
      onClick={abrir}
      className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full bg-acento px-5 py-3.5 font-display font-semibold uppercase tracking-wide text-base shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-transform duration-200 hover:bg-acento-alt active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento-alt sm:bottom-7"
    >
      <span className="relative">
        <IconoCarrito className="size-5" />
        <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-base text-[11px] font-bold text-acento">
          {conteo}
        </span>
      </span>
      Ver pedido
      <span className="border-l border-base/25 pl-3">
        {formatoColones(total)}
      </span>
    </button>
  );
}
