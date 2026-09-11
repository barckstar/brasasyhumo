import type { MetadataRoute } from "next";

const SITIO =
  process.env.NEXT_PUBLIC_SITIO_URL ?? "https://brasa-y-humo.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITIO}/sitemap.xml`,
  };
}
