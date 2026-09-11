import Link from "next/link";
import Image from "next/image";
import { Contenedor } from "@/shared/components/ui/Contenedor";
import { negocio, enlaceWhatsApp } from "@/shared/config/negocio";
import { BotonEnlace } from "@/shared/components/ui/Boton";
import { IconoCarrito } from "@/shared/components/ui/Iconos";
import { BotonCompartir, IconoCompartir } from "@/shared/components/ui/BotonCompartir";

export function Footer() {
  return (
    <footer id="contacto" className="border-t border-superficie/40 bg-base-alt">
      <Contenedor className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/marca/logo.jpg"
                alt={`Logo de ${negocio.nombre}`}
                width={56}
                height={56}
                className="rounded-full"
              />
              <p className="font-display text-lg font-bold uppercase italic leading-tight tracking-wide text-texto">
                {negocio.nombreHero.linea1}
                <span className="block text-acento">{negocio.nombreHero.linea2}</span>
              </p>
            </div>
            <p className="mt-4 max-w-xs text-sm text-texto-suave">
              {negocio.tagline}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <BotonEnlace href="/menu" tamano="md">
                <IconoCarrito className="size-4" />
                Hacer pedido
              </BotonEnlace>
              <BotonEnlace href="/menu" variante="contorno" tamano="md">
                Ver el menú
              </BotonEnlace>
            </div>
          </div>

          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-acento-alt">
              Dónde estamos
            </h2>
            <address className="mt-3 not-italic text-sm leading-relaxed text-texto-suave">
              {negocio.direccion}
              <br />
              {negocio.ciudad}, {negocio.provincia}
            </address>
            <a
              href={enlaceWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-semibold text-acento-alt hover:underline"
            >
              WhatsApp {negocio.whatsappVisible}
            </a>
          </div>

          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-acento-alt">
              Horario
            </h2>
            <ul className="mt-3 space-y-1.5 text-sm text-texto-suave">
              {negocio.horarios.map((h) => (
                <li key={h.dias} className="flex justify-between gap-4">
                  <span>{h.dias}</span>
                  <span className="text-texto">
                    {h.apertura && h.cierre
                      ? `${h.apertura} – ${h.cierre}`
                      : "Cerrado"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-superficie/40 pt-6 text-xs text-texto-suave sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {negocio.nombre}. {negocio.ciudad},{" "}
            {negocio.provincia}, Costa Rica.
          </p>
          <div className="flex gap-5">
            <a
              href={negocio.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-acento-alt"
            >
              Instagram
            </a>
            <a
              href={negocio.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-acento-alt"
            >
              Facebook
            </a>
            <BotonCompartir className="inline-flex items-center gap-1.5 transition-colors hover:text-acento-alt">
              <IconoCompartir className="size-4" />
              Compartir
            </BotonCompartir>
            <Link href="/menu" className="hover:text-acento-alt">
              Menú
            </Link>
          </div>
        </div>
      </Contenedor>
    </footer>
  );
}
