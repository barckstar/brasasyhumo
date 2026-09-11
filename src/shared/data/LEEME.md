# Fotos y videos de los platos

Todo lo visual vive en **`galerias.json`**: los platos del menú y también las
ofertas. Ni `menu.ts` ni `ofertas.ts` llevan una sola ruta de imagen — ahí van
los nombres, las descripciones y los precios.

Vive en `shared/` y no dentro de una feature porque lo usan dos: el menú y las
ofertas.

Las ofertas van bajo la clave **`oferta-<id>`**. Como una oferta es un combo de
platos que ya tienen galería, detrás de su arte se reutilizan las fotos —y el
video— de esos platos: no hay nada duplicado, y el día que lleguen las fotos
reales del local se cambian en un solo sitio.

## Cómo se ve una entrada

```json
"brasa-humo": {
  "portada": {
    "src": "/platos/galeria/brasa-humo-1.webp",
    "alt": "Hamburguesa de res a la parrilla en primer plano, Brasa & Humo, San José"
  },
  "medios": [
    { "tipo": "video",  "src": "/platos/videos/burger-fuego.mp4",
      "poster": "/platos/videos/burger-fuego-poster.webp", "alt": "..." },
    { "tipo": "imagen", "src": "/platos/galeria/brasa-humo-1.webp", "alt": "..." }
  ]
}
```

| Campo | Qué es | Dónde se ve |
|---|---|---|
| `portada` | **La mejor foto del plato.** Siempre foto, nunca un cuadro de video | Cuadrícula del menú, carrito, destacados y encabezado del detalle |
| `medios` | La galería completa, en orden | Menú en video y galería de la hoja de detalle |

## Reglas

1. **La portada es una foto, nunca un video.** El tipo lo impide, pero la razón
   es visual: un cuadro congelado de un video no dice qué plato es.
2. **Las rutas arrancan con `/`** y apuntan a `public/`.
3. **Todo `alt` va lleno**, con el patrón *Qué + Dónde*.
4. **Todo video lleva `poster`.** El video se carga con `preload="none"`: hasta
   que no entra en pantalla, el póster es lo único que se ve.
5. **El primer medio es el que abre el reel.** Si hay video, va primero.

Si algo de esto no se cumple, **`next build` falla** con el nombre del plato y
el campo. La validación está en `galerias.ts`.

## Para agregar fotos

```bash
python scripts/bajar-fotos-pexels.py <plato> <id-de-pexels> [<id> ...]
```

Deja los archivos en `public/platos/galeria/` ya recortados a 9:16. Después hay
que agregarlos a mano en `galerias.json` y anotar el origen en
`public/platos/galeria/LICENCIAS.json`.

## Al borrar archivos sin usar, no olvidar los pósters

Un medio de tipo `video` apunta a **dos** archivos: `src` y `poster`. Un script
de limpieza que recorra solo los `src` borra los pósters creyéndolos huérfanos,
y el fallo no se ve hasta que un video queda en negro mientras carga —que con
`preload="none"` es siempre, hasta que entra en pantalla.

Pasó de verdad: se borraron los 13 pósters de una sentada.

