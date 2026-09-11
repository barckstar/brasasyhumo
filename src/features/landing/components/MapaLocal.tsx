import { negocio } from "@/shared/config/negocio";

/**
 * Mapa del local: embed oficial de Google Maps.
 *
 * Se intento Leaflet para poder meter el logo dentro del pin — el embed de
 * Google no admite marcadores personalizados. No prospero: las teselas oscuras
 * de CartoDB pasaron a exigir llave de API y salian marcadas con
 * "API KEY REQUIRED" sobre todo el mapa.
 *
 * EMBED POR COORDENADAS, no por ficha de negocio.
 *
 * El embed con `!1s0x...` que da Google al compartir un lugar apunta a UNA
 * FICHA concreta y pinta su marcador con el nombre. Brasa & Humo no existe, y
 * pegar el enlace de otro local seria mandar a la gente al negocio de alguien
 * mas. La forma `?q=<lat>,<lng>&output=embed` cae en el punto sin afirmar que
 * ahi hay nada.
 *
 * Al usar esta base para un cliente real: reemplazar por el enlace de su
 * ficha, que ademas muestra horario y resenas dentro del propio mapa.
 */
const EMBED =
  `https://maps.google.com/maps?q=${negocio.coordenadas.lat},${negocio.coordenadas.lng}` +
  "&z=15&output=embed";

export function MapaLocal() {
  return (
    <iframe
      title={`Mapa con la ubicación de ${negocio.nombre} en ${negocio.ciudad}, ${negocio.provincia}`}
      src={EMBED}
      loading="lazy"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
      className="h-80 w-full border-0 lg:h-full lg:min-h-[26rem]"
    />
  );
}
