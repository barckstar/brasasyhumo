"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { DetallePlato } from "@/shared/components/ui/DetallePlato";
import type { Plato } from "@/shared/types/menu";

/**
 * La hoja de detalle del plato, montada UNA sola vez para todo el sitio.
 *
 * Antes vivia dentro del menú con su propio estado local, así que solo se
 * abría ahí: en el inicio, tocar un destacado o una oferta llevaba a /menu y el
 * cliente tenía que buscar el plato otra vez.
 *
 * Se resuelve con un contexto en el layout, igual que el carrito, y no
 * repitiendo la hoja en cada sección: una sola instancia, un solo estado, y
 * cualquier tarjeta la abre con `abrirDetalle(plato)`. La hoja usa el carrito,
 * así que este proveedor va por dentro del de carrito.
 */

type Contexto = {
  abrirDetalle: (plato: Plato) => void;
  cerrarDetalle: () => void;
};

const ContextoDetalle = createContext<Contexto | null>(null);

export function DetallePlatoProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [plato, setPlato] = useState<Plato | null>(null);

  const cerrarDetalle = useCallback(() => setPlato(null), []);
  const valor = useMemo(
    () => ({ abrirDetalle: (p: Plato) => setPlato(p), cerrarDetalle }),
    [cerrarDetalle],
  );

  return (
    <ContextoDetalle.Provider value={valor}>
      {children}
      <DetallePlato plato={plato} onCerrar={cerrarDetalle} />
    </ContextoDetalle.Provider>
  );
}

export function useDetallePlato(): Contexto {
  const ctx = useContext(ContextoDetalle);
  if (!ctx) {
    throw new Error(
      "useDetallePlato necesita estar dentro de <DetallePlatoProvider>.",
    );
  }
  return ctx;
}
