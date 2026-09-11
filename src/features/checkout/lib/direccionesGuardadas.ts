import { leerCrudo, escribirCrudo } from "@/shared/lib/almacenLocal";

/**
 * Direcciones que el cliente ya uso, guardadas en el propio dispositivo.
 *
 * Es el patron de las apps de delivery pero sin nada del costo: `localStorage`
 * es gratis, no hay servidor, no hay cuenta y no hay base de datos. Los datos
 * nunca salen del telefono de quien pide — que ademas es lo correcto en
 * privacidad: son direcciones de casa.
 */

export const CLAVE_DIRECCIONES = "brasa-humo-direcciones";
const MAXIMO = 4;

type DireccionGuardada = {
  texto: string;
  lat?: number;
  lng?: number;
  /** Marca de tiempo, para ordenar de la mas reciente a la mas vieja. */
  usadaEn: number;
};

export function leerDirecciones(): DireccionGuardada[] {
  const crudo = leerCrudo(CLAVE_DIRECCIONES);
  if (!crudo) return [];
  try {
    const dato = JSON.parse(crudo);
    if (!Array.isArray(dato)) return [];
    return (dato as DireccionGuardada[])
      .filter((d) => typeof d?.texto === "string" && d.texto.length > 0)
      .sort((a, b) => (b.usadaEn ?? 0) - (a.usadaEn ?? 0))
      .slice(0, MAXIMO);
  } catch {
    return [];
  }
}

/**
 * Guarda una direccion, o actualiza la existente si el texto coincide.
 * Se comparan normalizadas (sin mayusculas ni espacios de mas) para no
 * terminar con tres versiones de la misma casa.
 */
export function guardarDireccion(nueva: DireccionGuardada): void {
  const normalizar = (t: string) => t.trim().toLowerCase().replace(/\s+/g, " ");
  const clave = normalizar(nueva.texto);
  if (!clave) return;

  const previas = leerDirecciones().filter(
    (d) => normalizar(d.texto) !== clave,
  );
  const lista = [nueva, ...previas].slice(0, MAXIMO);
  escribirCrudo(CLAVE_DIRECCIONES, JSON.stringify(lista));
}

export function olvidarDireccion(texto: string): void {
  const normalizar = (t: string) => t.trim().toLowerCase().replace(/\s+/g, " ");
  const clave = normalizar(texto);
  const lista = leerDirecciones().filter((d) => normalizar(d.texto) !== clave);
  escribirCrudo(CLAVE_DIRECCIONES, JSON.stringify(lista));
}

/** Enlace de Google Maps al punto exacto, para pegarlo en el mensaje. */
export function enlaceUbicacion(lat: number, lng: number): string {
  return `https://maps.google.com/?q=${lat.toFixed(6)},${lng.toFixed(6)}`;
}
