import type { MetadataRoute } from "next";

// El dominio real. Ver la nota completa en layout.tsx.
const SITIO =
  process.env.NEXT_PUBLIC_SITIO_URL ?? "https://brasasyhumo.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const ahora = new Date();
  return [
    { url: SITIO, lastModified: ahora, changeFrequency: "monthly", priority: 1 },
    {
      url: `${SITIO}/menu`,
      lastModified: ahora,
      // El menu cambia mas seguido que el resto del sitio.
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      /*
        La segunda vista del menu. Se listaba solo /menu y esta ruta quedaba
        fuera del sitemap: existe, es indexable —robots permite todo— y muestra
        el mismo catalogo, asi que no habia razon para esconderla.

        Prioridad por debajo de /menu a proposito: es la MISMA informacion en
        otro formato, y no conviene competir contra la cuadricula por la misma
        busqueda.
      */
      url: `${SITIO}/menu/video`,
      lastModified: ahora,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];
}
