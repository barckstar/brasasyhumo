import { Seccion } from "@/shared/components/ui/Seccion";
import { BotonEnlace } from "@/shared/components/ui/Boton";
import { IconoWhatsApp, IconoCarrito } from "@/shared/components/ui/Iconos";
import { negocio, enlaceWhatsApp } from "@/shared/config/negocio";
import { MapaLocal } from "./MapaLocal";

export function Ubicacion() {
  return (
    <Seccion
      id="ubicacion"
      antetitulo="Dónde estamos"
      titulo="Visítenos en el local o pida a domicilio"
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr]">
        <div className="space-y-8">
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-acento">
              Dirección
            </h3>
            <address className="mt-3 not-italic text-lg leading-relaxed text-texto">
              {negocio.direccion}
            </address>
            <p className="mt-1 text-texto-suave">
              {negocio.ciudad}, {negocio.provincia}
            </p>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-acento">
              Horario
            </h3>
            <ul className="mt-3 space-y-2">
              {negocio.horarios.map((h) => (
                <li
                  key={h.dias}
                  className="flex items-baseline justify-between gap-6 border-b border-borde pb-2 text-sm"
                >
                  <span className="text-texto-suave">{h.dias}</span>
                  <span className="font-display tracking-wide text-texto">
                    {h.apertura && h.cierre
                      ? `${h.apertura} – ${h.cierre}`
                      : "Cerrado"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-3">
            <BotonEnlace href="/menu" tamano="lg">
              <IconoCarrito className="size-4" />
              Hacer pedido
            </BotonEnlace>
            <BotonEnlace
              href={enlaceWhatsApp(`Hola ${negocio.nombre}, tengo una consulta.`)}
              variante="contorno"
              tamano="lg"
            >
              <IconoWhatsApp className="size-4" />
              Escribinos al {negocio.whatsappVisible}
            </BotonEnlace>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl ring-1 ring-borde">
          <MapaLocal />
        </div>
      </div>
    </Seccion>
  );
}
