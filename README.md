# Brasa & Humo

Sitio de **Brasa & Humo**, parrilla y ahumados en San José, Costa Rica.

> **Este negocio no existe.** Es una muestra para enseñar el producto, con una
> marca inventada. Los datos de contacto son deliberadamente inválidos: el
> teléfono empieza por 0, que no es un prefijo válido en Costa Rica, para que
> nadie reciba llamadas por error. Ver `CLAUDE.md`.

Menú virtual con pedido en línea que se finaliza por WhatsApp. Sin backend, sin
base de datos y sin pasarela de pago: el sitio es estático y el cobro lo haría
el restaurante.

## Arrancar

```bash
npm install
npm run dev
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm start` | Sirve el build |
| `npm test` | Pruebas (Vitest) |
| `npm run lint` | ESLint |
| `npm run typecheck` | Tipos, sin emitir |

## Stack

**Núcleo**
Next.js 16 (App Router, Turbopack) · React 19 · TypeScript estricto (sin `any`,
sin `.jsx`) · Tailwind CSS 4 (config CSS-first con `@theme`) · Zod (valida todo
el contenido al importar el módulo, así que un dato mal escrito rompe el build
y no la página en producción) · `schema-dts` (tipa el JSON-LD para que el
compilador atrape una propiedad mal escrita, que en JSON-LD sin tipos Google
ignora en silencio) · Vitest · ESLint · Vercel.

Sin librería de animación: todo es CSS, y el revelado al hacer scroll lo dispara
un único `IntersectionObserver`.

**Funciones**
Carrito y checkout como *drawers* (nunca páginas) · pedido armado y enviado por
WhatsApp, sin backend ni pasarela de pago · ubicación del cliente por
geolocalización del navegador con 1 toque · sugerencias dentro del carrito ·
favoritos guardados en el dispositivo (`useSyncExternalStore`, sin desajuste de
hidratación) · ofertas que se desactivan solas al vencer · vista de reels a
pantalla completa por plato.

**SEO / AEO**
JSON-LD tipado (`Restaurant` + `Menu`, schema.org): horario, calificación,
rango de precios y el menú completo con precios, para que un buscador —o una
IA que responda con una cita— lo lea sin entrar al sitio · `sitemap.xml` y
`robots.ts` generados por Next · metadatos completos con Open Graph ·
`sameAs` enlaza el negocio con sus perfiles reales.

## Estructura

Arquitectura **Feature-Based**. Regla dura: *una feature nunca importa de otra,
y `shared/` nunca importa una feature*. Lo compartido sube a `shared/`; cuando
hay que unir dos features, la composición ocurre en `app/`.

```
src/
  app/        rutas y composición entre features
  features/   landing, menu, ofertas, carrito, checkout, reels
  shared/     components, lib, types, data, config
```

## Dónde vive el contenido

| Qué | Dónde |
|---|---|
| Datos del negocio | `src/shared/config/negocio.ts` |
| Platos y precios | `src/features/menu/data/menu.json` |
| Promociones | `src/features/ofertas/data/ofertas.json` |
| Fotos y videos de cada plato | `src/shared/data/galerias.json` |
| Reseñas y textos del inicio | `src/features/landing/data/` |
| Paleta y animaciones | `src/app/globals.css` |

**Toda lista va en `.json`, validada con Zod al cargar.** El esquema corre
durante `next build`: un precio como texto o una categoría mal escrita rompen el
build, no la página. Ver `src/shared/data/LEEME.md`.

## Recetas reproducibles

```bash
python scripts/marca.py                          # logo, iconos y tarjeta de OG
python scripts/optimizar-hero.py <foto>          # fondo del hero
python scripts/optimizar-video-reel.py <clip> <nombre>   # video de reel
python scripts/bajar-fotos-pexels.py <plato> <id>...     # fotos verticales 9:16
```

## Variables de entorno

Una sola, opcional en desarrollo:

| Variable | Para qué | Sin ella |
|---|---|---|
| `NEXT_PUBLIC_SITIO_URL` | Dominio del sitio: lo usan `sitemap.ts`, `robots.ts`, el JSON-LD, los metadatos y el mensaje de WhatsApp | Cae en `http://localhost:3000`, que rompe de forma visible en producción en vez de apuntar en silencio al dominio de otro sitio |

Ver `.env.example`.

## Estado

| Categoría Lighthouse | Puntaje |
|---|---|
| Rendimiento | 92 |
| Accesibilidad | 100 |
| Prácticas recomendadas | 100 |
| SEO | 100 |

LCP 3,2 s · CLS 0 · TBT 110 ms. Medido antes del hero del 2026-09-23 (foto de
fondo a opacidad plena, de 16 KiB a ~89 KiB): **falta remedir en producción**.

## Antes de desplegar

1. **`NEXT_PUBLIC_SITIO_URL`** en Vercel con el dominio real de este sitio, no
   el de otro proyecto. `.env.example` debe apuntar aquí también.
2. Las fotos y los videos son **relleno de Pexels** (licencia comercial, sin
   atribución obligatoria). Origen de cada archivo en los `LICENCIAS.json` de
   `public/platos/`.
