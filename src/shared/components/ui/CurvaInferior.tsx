/**
 * Divisor curvo para el borde inferior de una seccion, al estilo de la
 * referencia del cliente. Se pinta con el color de la seccion QUE SIGUE,
 * de modo que parezca que la de abajo sube y muerde a la de arriba.
 *
 * `aria-hidden` porque es puramente decorativo.
 */
export function CurvaInferior({
  className = "text-base-alt",
  conBrillo = true,
}: {
  /** Usar una clase de color de texto: el path hereda con currentColor. */
  className?: string;
  /** Luz de brasa que respira sobre la linea de la curva. */
  conBrillo?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 leading-[0] ${className}`}
    >
      {conBrillo && (
        <>
          {/*
            Dos capas desfasadas: una ancha y tenue que da el ambiente, y una
            angosta y caliente pegada a la linea. Al respirar en ciclos
            distintos la luz nunca se siente mecanica.
          */}
          <div
            className="absolute inset-x-0 bottom-0 h-[190px] origin-bottom will-change-transform sm:h-[260px]"
            style={{
              background:
                "radial-gradient(ellipse 70% 100% at 50% 100%, rgba(227,81,32,0.34) 0%, rgba(160,16,16,0.14) 45%, transparent 75%)",
              animation: "respiro-brasa 7s ease-in-out infinite",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-[90px] origin-bottom will-change-transform sm:h-[120px]"
            style={{
              background:
                "radial-gradient(ellipse 45% 100% at 50% 100%, rgba(240,160,93,0.30) 0%, rgba(232,119,31,0.12) 50%, transparent 78%)",
              animation: "respiro-brasa 4.6s ease-in-out 1.3s infinite",
            }}
          />
        </>
      )}

      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="relative block h-[60px] w-full sm:h-[90px]"
      >
        <path
          fill="currentColor"
          d="M0,120 L0,64 C240,112 480,120 720,96 C960,72 1200,16 1440,40 L1440,120 Z"
        />
        {/* Filo tenue de acento: define la curva sin gritar. */}
        <path
          fill="none"
          stroke="#E35120"
          strokeOpacity="0.5"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          d="M0,64 C240,112 480,120 720,96 C960,72 1200,16 1440,40"
        />
      </svg>
    </div>
  );
}
