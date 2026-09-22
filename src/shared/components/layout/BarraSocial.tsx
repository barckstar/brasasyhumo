import {
  IconoFacebook,
  IconoInstagram,
  IconoLinkedIn,
  IconoWhatsApp,
  IconoMapa,
} from "@/shared/components/ui/Iconos";
import {
  enlaceMapa,
  enlaceWhatsApp,
  mensajeConsulta,
  negocio,
} from "@/shared/config/negocio";
import { BotonCompartir, IconoCompartir } from "@/shared/components/ui/BotonCompartir";

/**
 * Barra lateral de redes, pegada al borde derecho.
 *
 * Mismo patron que en mascontractorsllc: encogida y semitransparente en
 * reposo, tamano completo al pasar el cursor por encima de la barra, con
 * `origin-right` para que no se despegue del borde al escalar.
 *
 * OCULTA EN MOVIL. A 375px de ancho un riel fijo a la derecha siempre termina
 * tapando el contenido — se comia el final del subtitulo del hero y parte de
 * las tarjetas. En movil las redes siguen accesibles desde el menu hamburguesa
 * y el pie de pagina, asi que no se pierde nada.
 */
const redes = [
  {
    /*
      En modo muestra el mensaje es de contacto, no un pedido: ver negocio.ts.
      Se usa el mismo texto que el boton del checkout para que quien escriba
      desde aqui o desde alla llegue igual.
    */
    nombre: "WhatsApp",
    href: enlaceWhatsApp(mensajeConsulta()),
    Icono: IconoWhatsApp,
  },
  { nombre: "Instagram", href: negocio.instagram, Icono: IconoInstagram },
  { nombre: "Facebook", href: negocio.facebook, Icono: IconoFacebook },
  { nombre: "LinkedIn", href: negocio.linkedin, Icono: IconoLinkedIn },
  { nombre: "Cómo llegar", href: enlaceMapa(), Icono: IconoMapa },
] as const;

export function BarraSocial() {
  return (
    <div className="barra-social group/barra fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 sm:block">
      <ul className="flex origin-right scale-90 flex-col gap-5 rounded-l-2xl border-y border-l border-acento/20 bg-base/70 p-3 opacity-80 shadow-[0_0_24px_rgba(0,0,0,0.45)] backdrop-blur-md transition-all duration-300 group-hover/barra:scale-100 group-hover/barra:opacity-100 sm:gap-6 sm:p-4">
        {redes.map(({ nombre, href, Icono }) => (
          <li key={nombre}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group/enlace relative block rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acento"
            >
              <span className="sr-only">
                {nombre} de {negocio.nombre}
              </span>
              <span className="icono-social block text-acento">
                <Icono className="size-6 sm:size-7" />
              </span>

              {/* Etiqueta que asoma desde la izquierda al pasar el cursor. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-full top-1/2 mr-4 hidden -translate-y-1/2 translate-x-3 whitespace-nowrap rounded bg-acento px-3 py-1 font-display text-xs font-semibold uppercase tracking-wide text-base opacity-0 shadow-lg transition-all duration-300 group-hover/enlace:translate-x-0 group-hover/enlace:opacity-100 md:block"
              >
                {nombre}
                <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-acento" />
              </span>
            </a>
          </li>
        ))}

        {/* Compartir cierra la barra: no es una red, es una accion. */}
        <li className="border-t border-acento/20 pt-4 sm:pt-5">
          <BotonCompartir className="group/enlace relative block rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acento">
            <span className="sr-only">
              Compartir el sitio de {negocio.nombre}
            </span>
            <span className="icono-social block text-acento">
              <IconoCompartir className="size-6 sm:size-7" />
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-full top-1/2 mr-4 hidden -translate-y-1/2 translate-x-3 whitespace-nowrap rounded bg-acento px-3 py-1 font-display text-xs font-semibold uppercase tracking-wide text-base opacity-0 shadow-lg transition-all duration-300 group-hover/enlace:translate-x-0 group-hover/enlace:opacity-100 md:block"
            >
              Compartir
              <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-acento" />
            </span>
          </BotonCompartir>
        </li>
      </ul>
    </div>
  );
}
