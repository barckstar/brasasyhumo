"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { Plato } from "@/shared/types/menu";
import type { AccionCarrito, LineaCarrito } from "@/shared/types/carrito";
import { leerCrudo, escribirCrudo, suscribir } from "@/shared/lib/almacenLocal";

const CLAVE = "brasa-humo-carrito";

/**
 * Reducer puro, exportado aparte para probarlo sin React.
 * Nunca muta: siempre devuelve un arreglo nuevo.
 */
export function carritoReducer(
  estado: LineaCarrito[],
  accion: AccionCarrito,
): LineaCarrito[] {
  switch (accion.tipo) {
    case "agregar": {
      // Un plato agotado no entra al carrito, aunque se fuerce la accion.
      if (!accion.plato.disponible) return estado;

      const existe = estado.find((l) => l.plato.id === accion.plato.id);
      if (existe) {
        return estado.map((l) =>
          l.plato.id === accion.plato.id ? { ...l, cantidad: l.cantidad + 1 } : l,
        );
      }
      return [...estado, { plato: accion.plato, cantidad: 1 }];
    }

    case "cambiarCantidad": {
      // Cero o menos elimina la linea: evita cantidades negativas.
      if (accion.cantidad <= 0) {
        return estado.filter((l) => l.plato.id !== accion.id);
      }
      return estado.map((l) =>
        l.plato.id === accion.id ? { ...l, cantidad: accion.cantidad } : l,
      );
    }

    case "quitar":
      return estado.filter((l) => l.plato.id !== accion.id);

    case "ponerNota":
      return estado.map((l) =>
        l.plato.id === accion.id
          ? { ...l, nota: accion.nota.trim() || undefined }
          : l,
      );

    case "vaciar":
      return [];

    case "hidratar":
      return accion.lineas;
  }
}

export function total(lineas: LineaCarrito[]): number {
  return lineas.reduce((suma, l) => suma + l.plato.precio * l.cantidad, 0);
}

export function conteo(lineas: LineaCarrito[]): number {
  return lineas.reduce((suma, l) => suma + l.cantidad, 0);
}

const VACIO: LineaCarrito[] = [];

/**
 * Lee el carrito guardado y DESCARTA los platos que ya no existen en el menu.
 *
 * Sin esto, un carrito viejo en localStorage sobrevive a un cambio de carta y
 * el cliente podria terminar enviando por WhatsApp un pedido de algo que el
 * restaurante ya no vende. Paso de verdad al reemplazar el menu de muestra por
 * el real.
 */
function parsear(crudo: string | null, idsValidos?: Set<string>): LineaCarrito[] {
  if (!crudo) return VACIO;
  try {
    const dato = JSON.parse(crudo);
    if (!Array.isArray(dato)) return VACIO;
    const lineas = dato as LineaCarrito[];
    if (!idsValidos) return lineas;
    const vigentes = lineas.filter((l) => idsValidos.has(l.plato?.id));
    return vigentes.length === lineas.length ? lineas : vigentes;
  } catch {
    return VACIO;
  }
}

type ValorCarrito = {
  lineas: LineaCarrito[];
  agregar: (plato: Plato) => void;
  cambiarCantidad: (id: string, cantidad: number) => void;
  quitar: (id: string) => void;
  ponerNota: (id: string, nota: string) => void;
  vaciar: () => void;
  cantidadDe: (id: string) => number;
  total: number;
  conteo: number;
  abierto: boolean;
  abrir: () => void;
  cerrar: () => void;
};

const CarritoContexto = createContext<ValorCarrito | null>(null);

export function CarritoProvider({
  children,
  idsDelMenu,
}: {
  children: ReactNode;
  /**
   * Ids de los platos vigentes. Se inyecta desde el layout para no acoplar la
   * feature del carrito con la del menu: una feature nunca importa de otra.
   */
  idsDelMenu?: string[];
}) {
  const [abierto, setAbierto] = useState(false);
  const idsValidos = useMemo(
    () => (idsDelMenu ? new Set(idsDelMenu) : undefined),
    [idsDelMenu],
  );

  /*
    localStorage es el almacen real y se lee con useSyncExternalStore. Asi no
    hace falta hidratar con un setState dentro de un efecto (patron que React 19
    marca por provocar renders en cascada) y el desajuste servidor/cliente lo
    resuelve React: en el servidor devuelve el snapshot vacio y en el cliente el
    guardado.
  */
  const crudo = useSyncExternalStore(
    useCallback((f) => suscribir(CLAVE, f), []),
    () => leerCrudo(CLAVE),
    () => null, // snapshot del servidor: carrito vacio
  );

  const lineas = useMemo(() => parsear(crudo, idsValidos), [crudo, idsValidos]);

  const despachar = useCallback(
    (accion: AccionCarrito) => {
      const siguiente = carritoReducer(
        parsear(leerCrudo(CLAVE), idsValidos),
        accion,
      );
      escribirCrudo(CLAVE, JSON.stringify(siguiente));
    },
    [idsValidos],
  );

  const valor = useMemo<ValorCarrito>(
    () => ({
      lineas,
      agregar: (plato) => despachar({ tipo: "agregar", plato }),
      cambiarCantidad: (id, cantidad) =>
        despachar({ tipo: "cambiarCantidad", id, cantidad }),
      quitar: (id) => despachar({ tipo: "quitar", id }),
      ponerNota: (id, nota) => despachar({ tipo: "ponerNota", id, nota }),
      vaciar: () => despachar({ tipo: "vaciar" }),
      cantidadDe: (id) => lineas.find((l) => l.plato.id === id)?.cantidad ?? 0,
      total: total(lineas),
      conteo: conteo(lineas),
      abierto,
      abrir: () => setAbierto(true),
      cerrar: () => setAbierto(false),
    }),
    [lineas, despachar, abierto],
  );

  return (
    <CarritoContexto.Provider value={valor}>{children}</CarritoContexto.Provider>
  );
}

export function useCarrito(): ValorCarrito {
  const ctx = useContext(CarritoContexto);
  if (!ctx) {
    throw new Error("useCarrito debe usarse dentro de <CarritoProvider>");
  }
  return ctx;
}
