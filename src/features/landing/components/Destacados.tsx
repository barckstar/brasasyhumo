import { Seccion } from "@/shared/components/ui/Seccion";
import { BotonEnlace } from "@/shared/components/ui/Boton";
import { RevelarCascada, ItemCascada } from "@/shared/components/ui/Revelar";
import { TarjetaDestacado } from "./TarjetaDestacado";
import type { Plato } from "@/shared/types/menu";

/** Recibe los platos: importarlos seria leer de la feature del menu. */
export function Destacados({ platos }: { platos: Plato[] }) {
  return (
    <Seccion
      id="destacados"
      antetitulo="Lo más pedido"
      titulo="Los que no fallan"
      className="bg-base-alt"
    >
      <RevelarCascada className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {platos.map((plato) => (
          <ItemCascada key={plato.id} className="h-full">
            <TarjetaDestacado plato={plato} />
          </ItemCascada>
        ))}
      </RevelarCascada>

      <div className="mt-10">
        <BotonEnlace href="/menu" variante="contorno" tamano="lg">
          Ver el menú completo
        </BotonEnlace>
      </div>
    </Seccion>
  );
}
