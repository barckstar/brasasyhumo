# CLAUDE.md — Brasa & Humo

Sitio de **Brasa & Humo**, parrilla y ahumados en San José, Costa Rica.

## ESTE NEGOCIO NO EXISTE

Es una **muestra** para enseñar el producto a clientes potenciales. Marca, menú,
precios, horarios y reseñas son inventados.

Hay decisiones que parecen descuidos y no lo son:

- **El teléfono empieza por 0**, que no es un prefijo válido en Costa Rica. Un
  número verosímil en una demo que circula termina haciendo sonar el teléfono de
  un desconocido.
- **Las redes apuntan a la raíz** de cada plataforma, sin usuario: un `@` inventado
  puede ser de alguien.
- **No hay ficha de Google.** El mapa se embebe por coordenadas, no por ficha;
  pegar el enlace de un local real mandaría gente al negocio de otro.
- **Las reseñas se llaman "Cliente de muestra".** Un nombre y apellido verosímil
  se lee como testimonio verdadero.

**Nada de esto se hereda al usar esta base para un cliente real.** Ahí los datos
son los suyos y las reseñas se transcriben literales de su ficha de Google.

## Stack

- **Next.js 16 (App Router) + React 19**
- **TypeScript estricto** — sin `.jsx`, sin `any`
- **Tailwind CSS v4** — config CSS-first con `@theme` en `globals.css`
- **Turbopack**
- **Animación en CSS puro** — transiciones y `@keyframes`. El revelado al hacer
  scroll lo dispara UN solo `IntersectionObserver` (`ObservadorRevelado`, montado
  una vez en el layout). **Sin librería de animación.**
- Zod para validar los datos y los formularios
- `schema-dts` para tipar el JSON-LD
- Deploy en **Vercel**

## Navegación — SOLO 2 PÁGINAS

- **`/`** — toda la información del negocio como secciones ancladas.
- **`/menu`** — cuadrícula, con el carrito.
- **`/menu/video`** — recorrido a pantalla completa tipo Shorts. Feature aparte:
  cada ruta carga solo su JavaScript.

El carrito y el checkout son drawers, nunca páginas.

## Datos en JSON, validados al cargar

**Regla dura.** Toda LISTA de contenido vive en un `.json`. El único TypeScript
que queda es el esquema de Zod que la valida.

Se llama *separación de contenido y código*; la validación en la frontera es
*"parse, don't validate"*.

| Va en JSON | Se queda en TS |
|---|---|
| Platos, ofertas, reseñas, textos, categorías | El esquema de Zod |
| Fotos y videos (`shared/data/galerias.json`) | Funciones y componentes |
| Cualquier lista que crezca con el negocio | Config con explicaciones (`negocio.ts`) |

`parse` corre **al importar el módulo**, o sea durante `next build`: un precio
como texto, una categoría mal escrita o un id repetido **rompen el build**, que
es donde uno quiere enterarse — no con el menú en blanco en un teléfono.

## Arquitectura — Feature-Based

```
src/
  app/            # rutas y COMPOSICIÓN entre features
  features/       # <feature>/{components,data,lib}
  shared/         # components, lib, types, data, config
```

**Regla dura: una feature nunca importa de otra, y `shared/` nunca importa una
feature.** Cuando dos features necesitan lo mismo, sube a `shared/`. Cuando hay
que unirlas, la composición se hace en `app/` y los componentes **reciben** sus
datos por props.

Verificado en cero violaciones:

```bash
grep -rn "@/features/" src/features/ | grep -vE "src/features/([a-z]+)/.*@/features//"
grep -rn "@/features/" src/shared/
```

## Rendimiento

Lighthouse sobre producción: **Rendimiento 92, Accesibilidad 100, Prácticas 100,
SEO 100.** LCP 3,2 s · CLS 0 · TBT 110 ms.

Lo que queda para pasar de 95: **85 KiB de JavaScript sin usar (~450 ms)**.

### Reglas que costaron caro

- **Nada de `"use client"` en `shared/components/ui/Revelar.tsx`.** Lo usan todas
  las secciones del inicio, que son de servidor: ese `"use client"` arrastraba la
  landing entera a la hidratación y costaba 4,4 s de render delay.
- **Sobre el pliegue no se usa el observador.** Vive en un `useEffect`, o sea
  después de hidratar. El hero usa `inmediato`, que es una `@keyframes`.
- **El estado oculto va en `@media (scripting: enabled)`.** Sin JavaScript el
  contenido se ve, quieto. Nunca una página en blanco esperando un observador.
- **`threshold: 0`, nunca una fracción.** Un bloque más alto que la pantalla
  nunca cumple el 20%.
- **Nada de leer `localStorage` con `typeof window` durante el render.** Durante
  la hidratación el cliente YA tiene `window`, así que no distingue nada y el
  servidor y el cliente pintan distinto. Se usa `useSyncExternalStore` **y su
  valor de retorno**: ver `shared/lib/favoritos.ts`.

## Paleta — reparto 70/30/10

| Franja | Uso | Color |
|---|---|---|
| 70% | Fondos | `#050505` / `#17100E` — negro real |
| 30% | Tarjetas y superficies | `#1A0F0D` / `#2A1512` |
| 10% | CTAs, precios, badges, estado activo | `#E35120` / `#E8771F` |

El naranja **nunca** es fondo de sección.

Contraste medido sobre `#050505`: acento 5,30:1, acento-alt 6,88:1, blanco
20,1:1. El rojo brasa `#A01010` queda en 2,50:1: **decorativo, nunca texto**.

**Sobre foto, el contraste se mide, no se estima.** El antetítulo del hero es
naranja a 12px —texto normal, necesita 4,5:1— y con el encuadre al 75% caía
sobre el pan y daba 4,44:1. Está al 65% por eso.

## Medios

- **Todo medio del reel se produce en 9:16 nativo.** Recortar un 16:9 a vertical
  tira el 65% de la imagen.
- **La portada es siempre una FOTO, nunca un cuadro de video.** El tipo `Foto` lo
  impide; la razón es que un fotograma congelado no dice qué plato es.
- **Recetas en `scripts/`, no en comentarios**: `marca.py`, `optimizar-hero.py`,
  `optimizar-video-reel.py` (con tope de peso), `bajar-fotos-pexels.py`.
- **El stock se mira uno por uno.** De 70 fotos, 11 traían marca ajena legible
  —una con el nombre de otro restaurante— y ninguna se detecta por el título.

## Pendiente

- [ ] 85 KiB de JavaScript sin usar: identificar el chunk
- [ ] Fotos y videos son **relleno de Pexels**, anotados en los `LICENCIAS.json`
- [ ] `NEXT_PUBLIC_SITIO_URL` en Vercel antes de desplegar
- [ ] ¿Bilingüe ES/EN?
