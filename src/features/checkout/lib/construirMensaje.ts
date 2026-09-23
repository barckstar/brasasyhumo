import { formatoColones } from "@/shared/lib/formatoColones";
import { negocio } from "@/shared/config/negocio";
import type { LineaCarrito } from "@/shared/types/carrito";
import { etiquetaMetodoPago } from "../schema";
import type { DatosPedido } from "../schema";
import { enlaceUbicacion } from "./direccionesGuardadas";

/**
 * Margen seguro para el texto YA CODIFICADO que viaja dentro de la URL de
 * wa.me. Los navegadores aceptan mas, pero WhatsApp en iOS trunca antes y lo
 * hace en silencio: el pedido llega incompleto y nadie se entera.
 */
export const LIMITE_SEGURO = 1500;

type MensajePedido = {
  texto: string;
  largoCodificado: number;
  excedeLimite: boolean;
};

/**
 * El sitio donde vive esta muestra. Va dentro del mensaje de contacto para que
 * quien lo reciba sepa de cual de sus paginas vino.
 */
// `brasa-y-humo.vercel.app` ya es de otro restaurante: sin
// `NEXT_PUBLIC_SITIO_URL` en Vercel esto no debe apuntar ahi (ver layout.tsx).
const SITIO = process.env.NEXT_PUBLIC_SITIO_URL ?? "http://localhost:3000";

function medir(texto: string): MensajePedido {
  const largoCodificado = encodeURIComponent(texto).length;
  return { texto, largoCodificado, excedeLimite: largoCodificado > LIMITE_SEGURO };
}

/**
 * El mensaje de una MUESTRA: contacto comercial, no un pedido.
 *
 * Brasa & Humo no existe, asi que no hay cocina que reciba nada. Quien pulse
 * el boton le escribe al estudio que hizo la pagina, que es para lo que sirve
 * esta demo.
 */
function construirMensajeContacto(): MensajePedido {
  return medir(`${negocio.mensajeContacto}

${SITIO}`);
}

/**
 * El pedido de verdad.
 *
 * Vive en su PROPIA funcion exportada y no detras de un `if`, porque asi sus
 * pruebas lo ejercitan SIEMPRE, encendido o apagado el modo muestra. Metido
 * dentro del `if` las siete pruebas del pedido pasaban a medir el mensaje de
 * contacto y dejaban de cubrir nada — paso de verdad al primer intento.
 */
export function construirMensajePedido(
  lineas: LineaCarrito[],
  datos: DatosPedido,
  totalPedido: number,
): MensajePedido {
  const partes: string[] = [`*PEDIDO — ${negocio.nombre}*`, ""];

  for (const l of lineas) {
    partes.push(
      `${l.cantidad}x ${l.plato.nombre}  ${formatoColones(l.plato.precio * l.cantidad)}`,
    );
    if (l.nota) partes.push(`   ${l.nota}`);
  }

  partes.push("", `*TOTAL: ${formatoColones(totalPedido)}*`, "");

  const modalidad = datos.modalidad === "express" ? "Express" : "Retiro";
  partes.push(`${modalidad} · ${datos.nombre} · ${datos.telefono}`);

  if (datos.modalidad === "express" && datos.direccion) {
    partes.push(datos.direccion);
    /*
      El enlace de Maps con las coordenadas exactas.

      WhatsApp no permite adjuntar un pin de ubicacion desde un enlace wa.me,
      asi que se manda el enlace: el mensajero lo toca y le abre la ruta. En
      la practica resuelve lo mismo y no cuesta nada — las coordenadas salen
      de navigator.geolocation, que es del navegador y no pide llave.
    */
    if (typeof datos.lat === "number" && typeof datos.lng === "number") {
      partes.push(`Ubicación: ${enlaceUbicacion(datos.lat, datos.lng)}`);
    }
  }

  partes.push(`Pago: ${etiquetaMetodoPago[datos.metodoPago]}`);

  if (datos.notas) partes.push(`Nota: ${datos.notas}`);

  if (datos.modalidad === "express") {
    // El costo del express lo cobra el mensajero al llegar, no el
    // restaurante. Decirlo en el mensaje evita el malentendido de que el
    // total del pedido ya lo incluye.
    partes.push("El costo del express se coordina con el mensajero.");
  }

  const texto = partes.join("\n");
  const largoCodificado = encodeURIComponent(texto).length;

  return {
    texto,
    largoCodificado,
    excedeLimite: largoCodificado > LIMITE_SEGURO,
  };
}

/** Abre WhatsApp con el pedido ya escrito. */
export function enviarPorWhatsApp(texto: string): void {
  const url = `https://wa.me/${negocio.whatsapp}?text=${encodeURIComponent(texto)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

/**
 * Lo que usa el checkout. Elige segun `negocio.modoMuestra`: en una muestra,
 * contacto; en el sitio de un cliente real, el pedido completo.
 */
export function construirMensaje(
  lineas: LineaCarrito[],
  datos: DatosPedido,
  totalPedido: number,
): MensajePedido {
  return negocio.modoMuestra
    ? construirMensajeContacto()
    : construirMensajePedido(lineas, datos, totalPedido);
}
