import type { ReactNode } from "react";

/**
 * Superficie del 30% del reparto. Nunca lleva el color de acento como fondo.
 */
export function Tarjeta({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "overflow-hidden rounded-2xl bg-base-alt ring-1 ring-superficie/60",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
