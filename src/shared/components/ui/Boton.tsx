import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

type Variante = "acento" | "contorno" | "fantasma";
type Tamano = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold uppercase tracking-wide " +
  "transition-transform duration-200 active:scale-95 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento-alt " +
  "disabled:opacity-50 disabled:pointer-events-none";

/*
  Contraste. `acento` pone texto casi negro sobre naranja: 4.88:1, la
  combinacion mas legible de la paleta.

  `contorno` lleva el BORDE naranja pero el TEXTO blanco, no naranja. El motivo
  es medido: estos botones se usan sobre el degradado del hero, que pasa por
  #963316 y #5B260D, y ahi acento-alt cae a 2.55:1 y 4.10:1 — ilegible. El
  blanco se mantiene en 7.44:1 y 11.98:1 sobre esos mismos fondos.

  Regla general: sobre superficies del 30% o sobre degradados, el texto es
  blanco. El naranja como texto solo se usa sobre el fondo base plano.
*/
const variantes: Record<Variante, string> = {
  acento: "bg-acento text-base hover:bg-acento-alt",
  contorno:
    "border-2 border-acento text-texto hover:bg-acento hover:text-base",
  fantasma: "text-texto hover:text-acento-alt",
};

const tamanos: Record<Tamano, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

function clases(variante: Variante, tamano: Tamano, extra?: string) {
  return [base, variantes[variante], tamanos[tamano], extra]
    .filter(Boolean)
    .join(" ");
}

type BotonProps = {
  variante?: Variante;
  tamano?: Tamano;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Boton({
  variante = "acento",
  tamano = "md",
  className,
  children,
  ...props
}: BotonProps) {
  return (
    <button className={clases(variante, tamano, className)} {...props}>
      {children}
    </button>
  );
}

type BotonEnlaceProps = {
  href: string;
  variante?: Variante;
  tamano?: Tamano;
  children: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

/** Misma apariencia que Boton, pero navega. Usar para enlaces reales. */
export function BotonEnlace({
  href,
  variante = "acento",
  tamano = "md",
  className,
  children,
  ...props
}: BotonEnlaceProps) {
  const externo = href.startsWith("http");
  const clase = clases(variante, tamano, className);

  if (externo) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={clase}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={clase} {...props}>
      {children}
    </Link>
  );
}
