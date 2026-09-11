import type { ReactNode } from "react";
import { Contenedor } from "./Contenedor";
import { Revelar } from "./Revelar";

/**
 * Seccion anclada del inicio. El `id` es el destino de las anclas del navbar.
 * `scroll-mt-20` compensa el navbar fijo para que el titulo no quede tapado.
 *
 * El antetitulo, el titulo y el contenido entran escalonados al hacer scroll.
 */
export function Seccion({
  id,
  titulo,
  antetitulo,
  children,
  className,
}: {
  id: string;
  titulo: string;
  antetitulo?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={["scroll-mt-20 py-20 sm:py-28", className].filter(Boolean).join(" ")}
    >
      <Contenedor>
        {antetitulo && (
          <Revelar direccion="izquierda">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-acento" aria-hidden="true" />
              <span className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-acento">
                {antetitulo}
              </span>
            </div>
          </Revelar>
        )}

        <Revelar retraso={0.08}>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold uppercase italic leading-[0.95] tracking-tight text-texto sm:text-5xl">
            {titulo}
          </h2>
        </Revelar>

        <Revelar retraso={0.16} className="mt-10">
          {children}
        </Revelar>
      </Contenedor>
    </section>
  );
}
