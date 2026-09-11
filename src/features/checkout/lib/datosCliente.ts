import { leerCrudo, escribirCrudo } from "@/shared/lib/almacenLocal";

/**
 * Nombre y teléfono de quien pide, guardados en su propio dispositivo.
 *
 * Es el mismo patrón que ya usan las direcciones: `localStorage`, sin servidor,
 * sin cuenta y sin base de datos. Los datos nunca salen del teléfono de quien
 * pide, que además es lo correcto en privacidad.
 *
 * No son cookies. Una cookie viaja al servidor en cada petición; esto se queda
 * en el aparato y nadie más lo ve. Para el cliente el efecto es el que pidió:
 * la segunda vez el formulario ya viene lleno.
 *
 * Se guarda al enviar y no mientras se escribe: así solo se recuerdan datos que
 * el cliente ya dio por buenos, no un nombre a medio teclear.
 */

export const CLAVE_CLIENTE = "brasa-humo-cliente";

type DatosCliente = {
  nombre: string;
  telefono: string;
};

export function leerCliente(): DatosCliente | null {
  const crudo = leerCrudo(CLAVE_CLIENTE);
  if (!crudo) return null;
  try {
    const dato = JSON.parse(crudo) as Partial<DatosCliente>;
    if (typeof dato?.nombre !== "string" || typeof dato?.telefono !== "string") {
      return null;
    }
    return { nombre: dato.nombre, telefono: dato.telefono };
  } catch {
    return null;
  }
}

export function guardarCliente(datos: DatosCliente): void {
  if (!datos.nombre.trim() || !datos.telefono.trim()) return;
  escribirCrudo(
    CLAVE_CLIENTE,
    JSON.stringify({
      nombre: datos.nombre.trim(),
      telefono: datos.telefono.trim(),
    }),
  );
}

