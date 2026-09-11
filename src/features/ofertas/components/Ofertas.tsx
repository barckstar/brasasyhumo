import { Seccion } from "@/shared/components/ui/Seccion";
import { BotonEnlace } from "@/shared/components/ui/Boton";
import { IconoCarrito } from "@/shared/components/ui/Iconos";
import {
  RevelarCascada,
  ItemCascada,
  Revelar,
} from "@/shared/components/ui/Revelar";
import { ofertasVigentes } from "../data/ofertas";
import { TarjetaOferta } from "./TarjetaOferta";

/**
 * Ofertas del local.
 *
 * Los precios y las restricciones salen tal cual de las publicaciones de su
 * Instagram, letra chica incluida: si el arte dice "no incluye papas", el sitio
 * lo dice también. Prometer de más en el sitio y aclararlo en el mostrador es
 * la forma más rápida de perder al cliente que llegó por la promoción.
 */
export function Ofertas() {
  const vigentes = ofertasVigentes();
  if (vigentes.length === 0) return null;

  return (
    <Seccion
      id="ofertas"
      antetitulo="Promociones"
      titulo="Ofertas de esta temporada"
      className="bg-base-alt"
    >
      <RevelarCascada className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {vigentes.map((o) => (
          <ItemCascada key={o.id} className="h-full">
            <TarjetaOferta oferta={o} />
          </ItemCascada>
        ))}
      </RevelarCascada>

      <Revelar retraso={0.1}>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <BotonEnlace href="/menu" tamano="lg">
            <IconoCarrito />
            Hacer mi pedido
          </BotonEnlace>
          <BotonEnlace href="/menu" variante="contorno" tamano="lg">
            Ver el menú completo
          </BotonEnlace>
        </div>
        <p className="mt-4 text-xs text-texto-suave">
          Promociones por tiempo limitado. Imágenes con fines ilustrativos.
        </p>
      </Revelar>
    </Seccion>
  );
}
