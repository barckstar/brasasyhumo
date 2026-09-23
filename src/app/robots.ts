import type { MetadataRoute } from "next";

// El dominio real. Ver la nota completa en layout.tsx.
const SITIO =
  process.env.NEXT_PUBLIC_SITIO_URL ?? "https://brasasyhumo.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITIO}/sitemap.xml`,
  };
}
