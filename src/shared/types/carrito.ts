import type { Plato } from "@/shared/types/menu";

export type LineaCarrito = {
  plato: Plato;
  cantidad: number;
  nota?: string;
};

export type AccionCarrito =
  | { tipo: "agregar"; plato: Plato }
  | { tipo: "cambiarCantidad"; id: string; cantidad: number }
  | { tipo: "quitar"; id: string }
  | { tipo: "ponerNota"; id: string; nota: string }
  | { tipo: "vaciar" }
  | { tipo: "hidratar"; lineas: LineaCarrito[] };
