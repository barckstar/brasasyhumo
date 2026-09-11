"use client";

import { useState } from "react";
import { CarritoBoton } from "@/features/carrito/components/CarritoBoton";
import { CarritoDrawer } from "@/features/carrito/components/CarritoDrawer";
import { CheckoutDrawer } from "@/features/checkout/components/CheckoutDrawer";
import { useCarrito } from "@/shared/lib/carrito";
import type { Plato } from "@/shared/types/menu";

/**
 * Une el boton flotante, el carrito y el checkout. Vive en el layout para que
 * el pedido sobreviva al navegar entre el inicio y el menu.
 *
 * VIVE EN `app/` y no dentro de una feature porque COMPONE DOS: el carrito y
 * el checkout. Una feature no importa de otra; la composicion se hace aqui,
 * que es el punto que la arquitectura designa para eso.
 */
export function CarritoUI({ sugerencias = [] }: { sugerencias?: Plato[] }) {
  const { cerrar, abierto } = useCarrito();
  const [checkoutAbierto, setCheckoutAbierto] = useState(false);

  return (
    <>
      {/*
        El boton flotante desaparece mientras hay un drawer abierto. Ofrecer
        "Ver pedido" con el pedido ya en pantalla no aporta nada, y encima se
        montaba sobre el propio drawer: se veian dos y hasta tres pastillas
        naranjas apiladas en el borde inferior.
      */}
      {!abierto && !checkoutAbierto && <CarritoBoton />}
      <CarritoDrawer
        sugerencias={sugerencias}
        onIrAlCheckout={() => {
          cerrar();
          setCheckoutAbierto(true);
        }}
      />
      <CheckoutDrawer
        abierto={checkoutAbierto}
        onCerrar={() => setCheckoutAbierto(false)}
      />
    </>
  );
}
