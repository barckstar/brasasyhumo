import type { DayOfWeek, Restaurant, WithContext } from "schema-dts";
import { negocio } from "@/shared/config/negocio";
import type { Plato } from "@/shared/types/menu";

/**
 * JSON-LD del negocio.
 *
 * Es la pieza de SEO que mas rinde para un local: es lo que le permite a Google
 * mostrar horarios, calificacion y rango de precios directamente en el
 * resultado de busqueda, sin que nadie entre al sitio.
 *
 * TODOS los datos de aqui son REALES y verificados con el cliente. No se
 * inventa nada: un dato falso en structured data es motivo de penalizacion
 * manual de Google, y ademas seria mentirle a quien busca.
 *
 * Se tipa con `schema-dts` para que el compilador atrape una propiedad mal
 * escrita — en JSON-LD un error tipografico no falla, simplemente se ignora en
 * silencio y el dato nunca aparece.
 */

const SITIO =
  process.env.NEXT_PUBLIC_SITIO_URL ?? "https://brasa-y-humo.vercel.app";

/** "24:00" no es hora valida en schema.org; el cierre de medianoche es "23:59". */
function horaSchema(h: string): string {
  return h === "24:00" ? "23:59" : h;
}

export function jsonLdRestaurante(): WithContext<Restaurant> {
  const abiertos = negocio.horarios.filter((h) => h.apertura && h.cierre);

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${SITIO}#restaurante`,
    name: negocio.nombre,
    description: negocio.tagline,
    url: SITIO,
    telephone: `+506${negocio.whatsapp.slice(3)}`,
    image: `${SITIO}/marca/logo.jpg`,
    logo: `${SITIO}/marca/logo.jpg`,
    servesCuisine: ["Parrilla", "Hamburguesas", "Comida rápida"],
    priceRange: `₡${negocio.rangoMenu.min} - ₡${negocio.rangoMenu.max}`,
    currenciesAccepted: "CRC",
    paymentAccepted: negocio.metodosPago.join(", "),

    address: {
      "@type": "PostalAddress",
      streetAddress: negocio.direccion,
      addressLocality: negocio.ciudad,
      addressRegion: negocio.provincia,
      addressCountry: negocio.pais,
    },

    geo: {
      "@type": "GeoCoordinates",
      latitude: negocio.coordenadas.lat,
      longitude: negocio.coordenadas.lng,
    },

    openingHoursSpecification: abiertos.map((h) => ({
      "@type": "OpeningHoursSpecification" as const,
      // schema-dts exige el tipo DayOfWeek, no un string suelto: fue justo lo
      // que atrapo el compilador. Sin tipos, un dia mal escrito se habria ido a
      // produccion y Google lo habria ignorado en silencio.
      dayOfWeek: h.diasSchema.map(
        (d) => `https://schema.org/${d}` as DayOfWeek,
      ),
      opens: horaSchema(h.apertura as string),
      closes: horaSchema(h.cierre as string),
    })),

    aggregateRating:
      negocio.google.calificacion !== null &&
      negocio.google.cantidadResenas !== null
        ? {
            "@type": "AggregateRating",
            ratingValue: negocio.google.calificacion,
            reviewCount: negocio.google.cantidadResenas,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,

    sameAs: [negocio.facebook, negocio.instagram],

    /*
      `hasDeliveryMethod` NO existe en Restaurant — lo atrapo el compilador.
      En JSON-LD sin tipos habria pasado desapercibido: Google ignora en
      silencio las propiedades que no reconoce y nunca te avisa.
      Lo correcto es enlazar el menu, que ademas es lo que Google usa para
      mostrar platos y precios en el resultado.
    */
    hasMenu: `${SITIO}/menu`,
    acceptsReservations: "False",
  };
}

/**
 * El menu como structured data. Permite que Google muestre platos y precios
 * en el resultado, que para un restaurante es de lo mas util que hay.
 */
export function jsonLdMenu(menu: Plato[]) {
  const porCategoria = new Map<string, Plato[]>();
  for (const plato of menu) {
    const lista = porCategoria.get(plato.categoria) ?? [];
    lista.push(plato);
    porCategoria.set(plato.categoria, lista);
  }

  const NOMBRES: Record<string, string> = {
    hamburguesas: "Hamburguesas",
    grill: "Menú Grill",
    infantil: "Menú Infantil",
    adicionales: "Adicionales",
  };

  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": `${SITIO}/menu#menu`,
    name: `Menú de ${negocio.nombre}`,
    inLanguage: "es-CR",
    hasMenuSection: [...porCategoria.entries()].map(([id, platos]) => ({
      "@type": "MenuSection",
      name: NOMBRES[id] ?? id,
      hasMenuItem: platos.map((p) => ({
        "@type": "MenuItem",
        name: p.nombre,
        description: p.descripcion,
        offers: {
          "@type": "Offer",
          price: p.precio,
          priceCurrency: "CRC",
          availability: p.disponible
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        },
      })),
    })),
  };
}

/** Etiqueta lista para insertar. El JSON va sin escapar HTML: es application/ld+json. */
export function EtiquetaJsonLd({ datos }: { datos: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(datos) }}
    />
  );
}
