"""
Optimiza una foto del local para el sitio.

Recorta a 4:5 (la proporcion que usa la seccion "¿Por que 5ta Avenida?"),
redimensiona a 900px de ancho y guarda en WebP. Las fotos de WhatsApp llegan
en 720x1600 y con metadatos de orientacion que hay que aplicar antes de
recortar, o la imagen sale acostada.

Uso:  python scripts/optimizar-foto-local.py "ruta/a/la/foto.jpeg" [nombre]
"""

import os
import sys
from PIL import Image, ImageOps

DESTINO = "public/local"


def main() -> None:
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    origen = sys.argv[1]
    nombre = sys.argv[2] if len(sys.argv) > 2 else "parrilla"

    im = Image.open(origen)
    # Aplica la orientacion EXIF antes de tocar nada, o la foto sale acostada.
    im = ImageOps.exif_transpose(im).convert("RGB")
    print(f"origen: {im.size}")

    # 4:5 centrado, que es lo que espera la seccion.
    im = ImageOps.fit(im, (900, 1125), method=Image.LANCZOS, centering=(0.5, 0.4))

    os.makedirs(DESTINO, exist_ok=True)
    salida = f"{DESTINO}/{nombre}.webp"
    im.save(salida, "WEBP", quality=82, method=6)
    print(f"guardada: {salida} ({round(os.path.getsize(salida) / 1024)} KB)")


if __name__ == "__main__":
    main()
