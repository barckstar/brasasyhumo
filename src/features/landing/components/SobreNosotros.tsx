import { Contenedor } from "@/shared/components/ui/Contenedor";
import { IconoCheck } from "@/shared/components/ui/IconoCheck";
import { sobreNosotros } from "../data/landing";
import { LogoEnBrasas } from "./LogoEnBrasas";
import { Revelar, RevelarCascada, ItemCascada } from "@/shared/components/ui/Revelar";

export function SobreNosotros() {
  return (
    <section id="nosotros" className="scroll-mt-20 py-20 sm:py-28">
      <Contenedor>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <LogoEnBrasas />

          <Revelar direccion="derecha">
            <span className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-acento">
              {sobreNosotros.antetitulo}
            </span>

            <h2 className="mt-4 font-display text-4xl font-bold uppercase italic leading-[0.92] tracking-tight text-texto sm:text-5xl">
              {sobreNosotros.tituloLinea1}
              <span className="block text-acento">
                {sobreNosotros.tituloLinea2}
              </span>
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-texto-suave">
              {sobreNosotros.parrafo}
            </p>

            <RevelarCascada className="mt-8 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {sobreNosotros.puntos.map((punto) => (
                <ItemCascada key={punto}>
                  <div className="flex items-start gap-3">
                    <IconoCheck className="mt-0.5 size-5" />
                    <span className="text-texto">{punto}</span>
                  </div>
                </ItemCascada>
              ))}
            </RevelarCascada>
          </Revelar>
        </div>
      </Contenedor>
    </section>
  );
}
