import type { Metadata } from "next";
import { VistaReels } from "@/features/reels/components/VistaReels";
import { menu } from "@/features/menu/data/menu";
import {
  ofertaComoPlato,
  ofertasVigentes,
} from "@/features/ofertas/data/ofertas";
import { negocio } from "@/shared/config/negocio";

export const metadata: Metadata = {
  title: "Menú en video",
  description: `Recorré los platillos de ${negocio.nombre} uno por uno y arme su pedido sin salir de la pantalla.`,
  alternates: { canonical: "/menu/video" },
  openGraph: {
    title: `Menú en video | ${negocio.nombre}`,
    url: "/menu/video",
    images: [{ url: "/marca/og.jpg", width: 1200, height: 630 }],
  },
};

export default function PaginaVideoMenu() {
  return (
    <main className="flex-1">
      {/*
        Las OFERTAS van primero, igual que en la cuadricula del menu: son el
        gancho comercial y el reel se recorre de arriba hacia abajo.
      */}
      <VistaReels
        catalogo={[...ofertasVigentes().map(ofertaComoPlato), ...menu]}
      />
    </main>
  );
}
