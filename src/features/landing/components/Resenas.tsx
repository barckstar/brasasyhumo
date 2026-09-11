import { Seccion } from "@/shared/components/ui/Seccion";
import { BotonEnlace } from "@/shared/components/ui/Boton";
import { negocio } from "@/shared/config/negocio";
import { resenas, enlaceResena, enlaceFichaGoogle } from "../data/resenas";
import {
  Revelar,
  RevelarCascada,
  ItemCascada,
} from "@/shared/components/ui/Revelar";

function Estrellas({
  cantidad,
  className = "size-4",
  id,
}: {
  cantidad: number;
  className?: string;
  id: string;
}) {
  return (
    <div
      className="flex gap-0.5"
      role="img"
      aria-label={`${cantidad} de 5 estrellas`}
    >
      {[1, 2, 3, 4, 5].map((i) => {
        const lleno = cantidad >= i;
        const medio = !lleno && cantidad > i - 1;
        return (
          <svg key={i} viewBox="0 0 24 24" aria-hidden="true" className={className}>
            <defs>
              <linearGradient id={`${id}-media-${i}`}>
                <stop offset="50%" stopColor="var(--color-acento-alt)" />
                <stop offset="50%" stopColor="var(--color-borde)" />
              </linearGradient>
            </defs>
            <path
              d="m12 2 2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z"
              fill={
                lleno
                  ? "var(--color-acento-alt)"
                  : medio
                    ? `url(#${id}-media-${i})`
                    : "var(--color-borde)"
              }
            />
          </svg>
        );
      })}
    </div>
  );
}

function EtiquetaGoogle() {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-texto-suave">
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
        <path fill="#4285F4" d="M23.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.86c2.26-2.09 3.57-5.17 3.57-8.87Z" />
        <path fill="#34A853" d="M12 24c3.24 0 5.96-1.08 7.94-2.91l-3.87-3a7.2 7.2 0 0 1-10.72-3.78h-4v3.09A12 12 0 0 0 12 24Z" />
        <path fill="#FBBC05" d="M5.35 14.3a7.1 7.1 0 0 1 0-4.6V6.61h-4a12 12 0 0 0 0 10.78l4-3.09Z" />
        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42A11.5 11.5 0 0 0 12 0 12 12 0 0 0 1.35 6.61l4 3.09A7.15 7.15 0 0 1 12 4.75Z" />
      </svg>
      Google
    </span>
  );
}

/** Insignia resumen con los numeros reales de la ficha de Google. */
function ResumenCalificacion() {
  const { calificacion, cantidadResenas } = negocio.google;
  if (calificacion === null || cantidadResenas === null) return null;

  return (
    <div className="mx-auto flex w-fit flex-wrap items-center justify-center gap-x-8 gap-y-4 rounded-2xl border border-borde bg-gradient-to-b from-superficie to-base-alt px-8 py-5 shadow-[0_0_40px_rgba(227,81,32,0.12)]">
      <div className="text-center">
        <p className="font-display text-5xl font-bold leading-none text-acento">
          {calificacion.toLocaleString("es-CR", { minimumFractionDigits: 1 })}
        </p>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-texto-suave">
          de 5
        </p>
      </div>

      <div className="border-borde sm:border-l sm:pl-8">
        <Estrellas cantidad={calificacion} className="size-5" id="resumen" />
        <p className="mt-2 text-sm text-texto-suave">
          Basado en{" "}
          <span className="font-semibold text-texto">{cantidadResenas}</span>{" "}
          reseñas
        </p>
      </div>

      <div className="border-borde sm:border-l sm:pl-8">
        <EtiquetaGoogle />
        <p className="mt-2 text-xs text-texto-suave">
          {negocio.rangoPreciosTexto}
        </p>
      </div>
    </div>
  );
}

export function Resenas() {
  return (
    <Seccion
      id="resenas"
      antetitulo="Reseñas verificadas"
      titulo="Lo que dice la gente de San Ramón"
      className="bg-base-alt"
    >
      <Revelar direccion="escala">
        <ResumenCalificacion />
      </Revelar>

      <RevelarCascada className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {resenas.map((r, i) => (
          <ItemCascada key={r.autor + i} className="h-full">
            <article className="group flex h-full flex-col rounded-2xl border border-borde bg-superficie p-6 transition-colors duration-300 hover:border-acento/45">
              <div className="flex items-center justify-between gap-3">
                <Estrellas cantidad={r.estrellas} id={`r${i}`} />
                <EtiquetaGoogle />
              </div>

              <div className="mt-4 flex flex-1 gap-2">
                <span
                  aria-hidden="true"
                  className="font-display text-4xl leading-[0.6] text-acento/45"
                >
                  &ldquo;
                </span>
                <p className="leading-relaxed text-texto-suave">{r.texto}</p>
              </div>

              <div className="mt-6 border-t border-borde pt-4">
                <p className="font-display text-sm font-semibold uppercase tracking-wide text-texto">
                  {r.autor}
                </p>
                <div className="mt-0.5 flex flex-wrap items-center justify-between gap-x-3 text-xs text-texto-suave">
                  {r.credencial && <span>{r.credencial}</span>}
                  <span>{r.fecha}</span>
                </div>
              </div>
            </article>
          </ItemCascada>
        ))}
      </RevelarCascada>

      <Revelar retraso={0.1}>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <BotonEnlace href={enlaceResena()} tamano="lg">
            Dejar una reseña
          </BotonEnlace>
          <BotonEnlace href={enlaceFichaGoogle()} variante="contorno" tamano="lg">
            Ver las {negocio.google.cantidadResenas} reseñas
          </BotonEnlace>
        </div>
      </Revelar>
    </Seccion>
  );
}
