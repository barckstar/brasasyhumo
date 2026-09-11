"""
Genera el fondo del hero a partir de una foto grande.

LA RECETA NO ES ARBITRARIA. La imagen se muestra al 17% de opacidad y bajo una
mascara que le difumina los bordes (ver Hero.tsx): a esa opacidad el detalle no
se percibe, asi que servir el original de ~1670px es regalar bytes que nadie ve.

Y esta imagen ES el LCP de la pagina — cubre el viewport entero, asi que va a
ser el elemento mas grande pase lo que pase. Ya se probo ponerla en lazy
esperando que el LCP pasara al titular: no funciono, empeoro de 4,8 a 5,0 s.
La unica salida es que llegue rapido.

De ahi los tres numeros: 400px de ancho, calidad 40 y desenfoque leve. El
desenfoque no es estetico — suaviza el ruido y hace que WebP comprima mejor a
calidad baja, sin que se note bajo la mascara.

OJO: mantener el resultado en el orden de los 16 KB. Si sube mucho se pierde
el trabajo de LCP que costo la sesion del 2026-09-01.

Uso:  python scripts/optimizar-hero.py "ruta/a/la/foto.png"
"""

import os
import sys

from PIL import Image, ImageEnhance, ImageFilter, ImageOps

SALIDA = "public/platos/hero-fondo.webp"
ANCHO = 400
CALIDAD = 40
DESENFOQUE = 0.6
# EL FONDO SE OSCURECE. Encima va el titular y un antetitulo naranja de 12px
# —texto normal, necesita 4.5:1— y una foto bien iluminada se come el margen
# aunque se muestre al 17% de opacidad. Medido sobre la foto de brisket: sin
# oscurecer daba 3.94:1 en la franja del antetitulo.
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
    im = im.filter(ImageFilter.GaussianBlur(DESENFOQUE))
    im = ImageEnhance.Brightness(im).enhance(OSCURECER)

    im.save(SALIDA, "WEBP", quality=CALIDAD, method=6)
    print(f"salida:  {im.size}  {round(os.path.getsize(SALIDA) / 1024)} KB  -> {SALIDA}")


if __name__ == "__main__":
    main()
