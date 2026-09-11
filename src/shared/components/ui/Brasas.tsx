/**
 * Brasas de fondo. CSS puro: sin JavaScript, sin librerias, sin costo de carga.
 *
 * Vive en `shared` y no en una feature porque la usan el hero y el menu, y una
 * feature nunca importa de otra.
 * Solo anima transform y opacity, asi que corre en GPU. El bloque global de
 * prefers-reduced-motion en globals.css la detiene por completo.
 *
 * La gama va del amarillo incandescente al rojo profundo, que es como se
 * enfria una chispa al subir. Con un solo color se veian puntos naranjas
 * flotando; con la gama se leen como fuego.
 */

/** Del nucleo mas caliente al rescoldo. */
const GAMA = [
  { color: "#FFD9A0", brillo: "rgba(255,217,160,0.85)" }, // amarillo incandescente
  { color: "#F0A05D", brillo: "rgba(240,160,93,0.8)" }, // naranja claro
  { color: "#E8771F", brillo: "rgba(232,119,31,0.75)" }, // ambar
  { color: "#E35120", brillo: "rgba(227,81,32,0.7)" }, // naranja fuego
  { color: "#C03018", brillo: "rgba(192,48,24,0.6)" }, // rojo brasa
  { color: "#A01010", brillo: "rgba(160,16,16,0.5)" }, // rescoldo
];

/**
 * Posiciones generadas con una secuencia fija, no con Math.random: un valor
 * aleatorio daria distinto en el servidor y en el cliente, y React marcaria
 * desajuste de hidratacion.
 */
const BRASAS = Array.from({ length: 26 }, (_, i) => {
  const g = GAMA[i % GAMA.length];
  // Numeros primos distintos para que los ciclos no caigan en fase.
  return {
    izq: `${(i * 97) % 100}%`,
    tam: 2 + ((i * 7) % 5),
    retraso: `${((i * 13) % 90) / 10}s`,
    duracion: `${7 + ((i * 11) % 60) / 10}s`,
    deriva: `${((i * 17) % 60) - 30}px`,
    ...g,
  };
});

export function Brasas({
  densidad = 1,
  className,
}: {
  /** Fraccion de particulas a dibujar. 0.5 = la mitad. */
  densidad?: number;
  className?: string;
}) {
  /*
    Se toma una de cada N y NO un tramo contiguo con slice: las posiciones del
    arreglo siguen una secuencia, asi que cortar los primeros dejaba todas las
    brasas amontonadas en un costado de la pantalla.
  */
  const paso = Math.max(1, Math.round(1 / Math.min(1, Math.max(0.05, densidad))));
  const visibles = BRASAS.filter((_, i) => i % paso === 0);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className ?? ""}`}
    >
      {visibles.map((b, i) => (
        <span
          key={i}
          className="absolute bottom-0 rounded-full"
          style={{
            left: b.izq,
            width: b.tam,
            height: b.tam,
            backgroundColor: b.color,
            opacity: 0,
            // El resplandor es lo que las hace leer como brasa y no como punto.
            boxShadow: `0 0 ${b.tam * 2.5}px ${b.tam / 2}px ${b.brillo}`,
            animation: `brasa-subir ${b.duracion} ease-out ${b.retraso} infinite`,
            ["--deriva" as string]: b.deriva,
          }}
        />
      ))}
    </div>
  );
}
