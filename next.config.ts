import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 60 lo usa el fondo del hero (Hero.tsx); 75 es el valor por defecto de Next.
    qualities: [60, 75],
  },
};

export default nextConfig;
