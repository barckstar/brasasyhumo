import type { MetadataRoute } from "next";

// `brasa-y-humo.vercel.app` ya es de otro restaurante: sin
// `NEXT_PUBLIC_SITIO_URL` en Vercel esto no debe apuntar ahi (ver layout.tsx).
const SITIO = process.env.NEXT_PUBLIC_SITIO_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITIO}/sitemap.xml`,
  };
}
