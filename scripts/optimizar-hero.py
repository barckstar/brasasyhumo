"""
Genera el fondo del hero a partir de una foto grande.

La foto se muestra a OPACIDAD PLENA (ver Hero.tsx): la carne tiene que verse.
Hasta el 2026-09-22 se mostraba al 17% y esta receta la reducia a 400px con
desenfoque (16 KB); a opacidad plena eso se ve borroso.

Y esta imagen ES el LCP de la pagina: cubre el viewport entero, asi que va a
ser el elemento mas grande pase lo que pase. Ya se probo ponerla en lazy
esperando que el LCP pasara al titular: no funciono, empeoro de 4,8 a 5,0 s.

Por eso el ORIGEN es de 1600px a calidad 80 y el peso lo controla Next: sirve
el ancho justo por `sizes` y a `quality={60}`. Aqui no se desenfoca.

Uso:  python scripts/optimizar-hero.py "ruta/a/la/foto.jpg"
"""

import os
import sys

from PIL import Image, ImageEnhance, ImageOps

SALIDA = "public/platos/hero-fondo.webp"
ANCHO = 1600
CALIDAD = 80
# EL FONDO SE OSCURECE. Encima va el titular y un antetitulo naranja de 12px
# —texto normal, necesita 4.5:1— y una foto bien iluminada se come el margen.
# Aun oscurecida hace falta el velo de Hero.tsx, medido pixel a pixel.
OSCURECER = 0.75


def main() -> None:
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    im = Image.open(sys.argv[1])
    # Orientacion EXIF antes de tocar nada, o una foto de telefono sale acostada.
    im = ImageOps.exif_transpose(im).convert("RGB")
    print(f"origen:  {im.size}  {round(os.path.getsize(sys.argv[1]) / 1024)} KB")

    alto = round(ANCHO * im.height / im.width)
    im = im.resize((ANCHO, alto), Image.LANCZOS)
    im = ImageEnhance.Brightness(im).enhance(OSCURECER)

    im.save(SALIDA, "WEBP", quality=CALIDAD, method=6)
    print(f"salida:  {im.size}  {round(os.path.getsize(SALIDA) / 1024)} KB  -> {SALIDA}")


if __name__ == "__main__":
    main()
