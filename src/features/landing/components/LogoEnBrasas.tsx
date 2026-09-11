import Image from "next/image";
import { negocio } from "@/shared/config/negocio";

/**
 * El logo dentro de un fuego vivo.
 *
 * Tres capas, cada una con su propio ritmo:
 *   1. Ondas de calor que crecen hacia afuera y se apagan, desfasadas entre si
 *   2. Un resplandor que parpadea con pasos irregulares, como llama real
 *   3. Un temblor lento del conjunto, el aire caliente sobre la parrilla
 *
 * Solo se anima transform, opacity y filter: todo va por GPU. El bloque global
 * de prefers-reduced-motion lo detiene por completo.
 */
export function LogoEnBrasas() {
  return (
    <div className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center">
      {/* 1. Ondas de calor. Desfasadas para que nunca coincidan. */}
      {[
        { retraso: "0s", duracion: "4.5s" },
        { retraso: "1.5s", duracion: "4.5s" },
        { retraso: "3s", duracion: "4.5s" },
      ].map((onda, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="absolute inset-[8%] rounded-full ring-2 ring-acento/45 will-change-transform"
          style={{
            animation: `onda-calor ${onda.duracion} ease-out ${onda.retraso} infinite`,
          }}
        />
      ))}

      {/* 2. Resplandor que parpadea como llama. */}
      <div
        aria-hidden="true"
        className="absolute inset-[4%] rounded-full will-change-transform"
        style={{
          background:
            "radial-gradient(circle at 50% 58%, rgba(240,160,93,0.55) 0%, rgba(227,81,32,0.42) 38%, rgba(160,16,16,0.18) 62%, transparent 78%)",
          animation: "llama-parpadeo 3.1s ease-in-out infinite",
        }}
      />

      {/* Brasa profunda, mas lenta, para dar fondo al parpadeo. */}
      <div
        aria-hidden="true"
        className="absolute inset-[16%] rounded-full will-change-transform"
        style={{
          background:
            "radial-gradient(circle at 50% 55%, rgba(232,119,31,0.5) 0%, rgba(160,16,16,0.28) 55%, transparent 76%)",
          animation: "llama-parpadeo 5.7s ease-in-out 0.8s infinite",
        }}
      />

      {/* 3. El logo, con el temblor del aire caliente. */}
      <div
        className="relative w-[58%] will-change-transform"
        style={{ animation: "temblor-calor 7s ease-in-out infinite" }}
      >
        <Image
          src="/marca/logo.jpg"
          alt={`Logo de ${negocio.nombre}, parrilla en ${negocio.ciudad}`}
          width={340}
          height={340}
          className="w-full rounded-full shadow-[0_0_50px_rgba(227,81,32,0.45)]"
        />
      </div>
    </div>
  );
}
