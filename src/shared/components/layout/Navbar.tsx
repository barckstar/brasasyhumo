"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Contenedor } from "@/shared/components/ui/Contenedor";
import { BotonEnlace } from "@/shared/components/ui/Boton";
import { useNavbarOculto } from "@/shared/lib/useNavbarOculto";
import { negocio, enlaceWhatsApp } from "@/shared/config/negocio";
import { SwitchVista } from "./SwitchVista";

const enlaces = [
  { href: "/menu", texto: "Menú" },
  { href: "/#ofertas", texto: "Ofertas" },
  { href: "/#nosotros", texto: "Nosotros" },
  { href: "/#resenas", texto: "Reseñas" },
  { href: "/#ubicacion", texto: "Ubicación" },
] as const;

export function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const oculto = useNavbarOculto(menuAbierto);
  const ruta = usePathname();

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 border-b border-superficie/40 bg-base/80 backdrop-blur-md transition-transform duration-300 ${
        oculto ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <Contenedor>
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acento-alt"
            onClick={() => setMenuAbierto(false)}
          >
            <Image
              src="/marca/logo.jpg"
              alt={`Logo de ${negocio.nombre} en ${negocio.ciudad}`}
              width={40}
              height={40}
              priority
              className="rounded-full"
            />
            <span className="font-display text-lg font-semibold uppercase tracking-wide text-texto">
              {negocio.nombre}
            </span>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {enlaces.map((e) => {
              const activo = e.href === ruta;
              return (
                <Link
                  key={e.href}
                  href={e.href}
                  aria-current={activo ? "page" : undefined}
                  // py-2.5 no es decorativo: Lighthouse marcaba estos enlaces
                  // por area tactil insuficiente. El texto se ve igual.
                  className={`inline-flex items-center px-1 py-2.5 font-display text-sm font-medium uppercase tracking-wide transition-colors ${
                    activo
                      ? "text-acento-alt"
                      : "text-texto-suave hover:text-acento-alt"
                  }`}
                >
                  {e.texto}
                </Link>
              );
            })}
            {/*
              El alternador de vista solo se dibuja dentro del menu.

              Aqui habia un boton "Ordenar" que se quito: dentro del menu no
              hacia nada porque ya estabas ahi, y en el inicio duplicaba el
              enlace "Menu" de al lado. Para ver el pedido esta el boton
              flotante, que ademas solo aparece cuando hay algo.
            */}
            <SwitchVista />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <SwitchVista />
            <button
            type="button"
            onClick={() => setMenuAbierto((v) => !v)}
            aria-expanded={menuAbierto}
            aria-controls="menu-movil"
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            className="rounded-lg p-2 text-texto transition-colors hover:text-acento-alt focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento-alt md:hidden"
          >
            <span className="relative block h-4 w-6" aria-hidden="true">
              <span
                className={`absolute left-0 h-0.5 w-6 bg-current transition-transform duration-300 ${
                  menuAbierto ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 h-0.5 w-6 bg-current transition-opacity duration-200 ${
                  menuAbierto ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 h-0.5 w-6 bg-current transition-transform duration-300 ${
                  menuAbierto ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
            </button>
          </div>
        </div>
      </Contenedor>

      <div
        id="menu-movil"
        className={`overflow-hidden border-t border-superficie/40 bg-base/95 transition-all duration-300 md:hidden ${
          menuAbierto ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <Contenedor className="flex flex-col gap-1 py-4">
          {enlaces.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              onClick={() => setMenuAbierto(false)}
              className="rounded-lg px-2 py-3 font-display text-base uppercase tracking-wide text-texto-suave transition-colors hover:text-acento-alt"
            >
              {e.texto}
            </Link>
          ))}
          <BotonEnlace
            href={enlaceWhatsApp(`Hola ${negocio.nombre}, tengo una consulta.`)}
            variante="contorno"
            tamano="lg"
            className="mt-2 w-full"
            onClick={() => setMenuAbierto(false)}
          >
            Escribinos al {negocio.whatsappVisible}
          </BotonEnlace>
        </Contenedor>
      </div>
    </nav>
  );
}
