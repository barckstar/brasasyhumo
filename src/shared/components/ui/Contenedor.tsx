import type { ReactNode } from "react";

export function Contenedor({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={["mx-auto w-full max-w-6xl px-5 sm:px-8", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
