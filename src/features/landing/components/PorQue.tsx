import Image from "next/image";
import { Seccion } from "@/shared/components/ui/Seccion";
import { porQue } from "../data/landing";
import {
  Revelar,
  RevelarCascada,
  ItemCascada,
} from "@/shared/components/ui/Revelar";

export function PorQue() {
  return (
    <Seccion id="porque" antetitulo={porQue.antetitulo} titulo={porQue.titulo}>
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Barras apiladas con borde de acento a la izquierda. */}
        <RevelarCascada className="space-y-4">
          {porQue.razones.map((r) => (
            <ItemCascada key={r.titulo}>
              <div className="border-l-4 border-acento bg-superficie px-6 py-5 transition-transform duration-300 hover:translate-x-1">
                <h3 className="font-display text-lg font-semibold uppercase italic tracking-wide text-texto">
                  {r.titulo}
                </h3>
                <p className="mt-2 leading-relaxed text-texto-suave">
                  {r.texto}
                </p>
              </div>
            </ItemCascada>
          ))}
        </RevelarCascada>

        {/*
          FOTO REAL DEL LOCAL: la parrilla con el rotulo de madera de la marca.
          Sostiene literalmente lo que dice la columna de al lado —"fuego real,
          sin atajos"— cosa que una foto de producto no puede hacer.

          Recortada del arte de "¡Ya abrimos!" de su Instagram, quitando el
          banner naranja y la franja de contacto.
        */}
        <Revelar direccion="derecha" className="relative mx-auto w-full max-w-md">
          <div className="relative aspect-4/5 overflow-hidden rounded-2xl border border-borde bg-superficie">
            <Image
              src="/local/parrilla.webp"
              alt="La parrilla de leña de Brasa & Humo en su local de San José"
              fill
              sizes="(min-width: 1024px) 28rem, 90vw"
              className="object-cover"
            />
            {/* Velo inferior para asentar la foto en el fondo negro. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-base/70 via-transparent to-transparent"
            />
          </div>
        </Revelar>
      </div>
    </Seccion>
  );
}
