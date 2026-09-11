import { negocio } from "@/shared/config/negocio";

function Estrellas({ calificacion }: { calificacion: number }) {
  return (
    <div
      className="flex gap-0.5"
      role="img"
      aria-label={`${calificacion} de 5 estrellas en Google`}
    >
      {[1, 2, 3, 4, 5].map((i) => {
        const lleno = calificacion >= i;
        const medio = !lleno && calificacion > i - 1;
        return (
          <svg key={i} viewBox="0 0 24 24" aria-hidden="true" className="size-4">
            <defs>
              <linearGradient id={`media-${i}`}>
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
                    ? `url(#media-${i})`
                    : "var(--color-borde)"
              }
            />
          </svg>
        );
      })}
    </div>
  );
}

/**
 * Prueba social bajo los botones del hero: la calificacion real de Google.
 * Los numeros salen de `negocio.google` — no se escriben aqui.
 */
export function PruebaSocial() {
  const { calificacion, cantidadResenas, cid } = negocio.google;
  if (calificacion === null || cantidadResenas === null) return null;

  return (
    <a
      href={`https://www.google.com/maps?cid=${cid}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-4 rounded-xl border border-borde/80 bg-base-alt/60 px-4 py-3 backdrop-blur-sm transition-colors hover:border-acento/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acento"
    >
      <span className="font-display text-3xl font-bold leading-none text-acento">
        {calificacion.toLocaleString("es-CR", { minimumFractionDigits: 1 })}
      </span>

      <span className="block h-8 w-px bg-borde" aria-hidden="true" />

      <span className="block">
        <Estrellas calificacion={calificacion} />
        <span className="mt-1 block text-sm text-texto-suave">
          {cantidadResenas} reseñas en{" "}
          <span className="font-semibold text-texto group-hover:text-acento-alt">
            Google
          </span>
        </span>
      </span>
    </a>
  );
}
