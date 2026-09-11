import type { Metadata } from "next";
import { Contenedor } from "@/shared/components/ui/Contenedor";
import { MenuView } from "@/features/menu/components/MenuView";
import { menu } from "@/features/menu/data/menu";
import {
  ofertaComoPlato,
  ofertasVigentes,
} from "@/features/ofertas/data/ofertas";
import { negocio } from "@/shared/config/negocio";
import { EtiquetaJsonLd, jsonLdMenu } from "@/shared/lib/jsonLd";

export const metadata: Metadata = {
  title: "Menú",
  description: `Hamburguesas, costillas y alitas a la parrilla en ${negocio.ciudad}. Pedí en línea y coordinamos por WhatsApp ${negocio.whatsappVisible}.`,
  alternates: { canonical: "/menu" },
  openGraph: {
    title: `Menú | ${negocio.nombre}`,
    description: `La carta completa de ${negocio.nombre} en ${negocio.ciudad}: hamburguesas, parrilla y menú infantil. Pida en línea.`,
    url: "/menu",
    images: [
      {
        url: "/marca/og.jpg",
        width: 1200,
        height: 630,
        alt: `Menú de ${negocio.nombre}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Menú | ${negocio.nombre}`,
    images: ["/marca/og.jpg"],
  },
};

export default function PaginaMenu() {
  return (
    <main className="flex-1 pt-16">
      {/* El menu como structured data: Google puede mostrar platos y precios. */}
      <EtiquetaJsonLd datos={jsonLdMenu(menu)} />
      <Contenedor className="pb-2 pt-10">
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-acento" aria-hidden="true" />
          <span className="font-display text-xs font-semibold uppercase tracking-[0.32em] text-acento">
            Menú
          </span>
        </div>
        <h1 className="mt-5 font-display text-4xl font-bold uppercase italic leading-[0.9] tracking-tight text-texto sm:text-6xl">
          Todo pasa por
          <span className="block text-acento">la parrilla</span>
        </h1>
        <p className="mt-4 max-w-lg text-texto-suave">
          Arme su pedido y lo finalizamos por WhatsApp. Precios finales, sin
          sorpresas.
        </p>
      </Contenedor>

      {/* Ofertas primero, igual que en el menu en video. */}
      <MenuView
        catalogo={[...ofertasVigentes().map(ofertaComoPlato), ...menu]}
      />
    </main>
  );
}
