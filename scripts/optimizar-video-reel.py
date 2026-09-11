"""
Convierte un clip de stock en un video de reel listo para el sitio.

POR QUE NO SE SUBE EL ORIGINAL: los clips de Pexels vienen en 1080x1920 o
2160x3840 y pesan entre 2 y 106 MB. El estandar del proyecto es Lighthouse >95
tambien en /menu/reels; un solo clip de 22 MB lo tumba solo.

La receta:
  - RECORTE a 6 s. Un reel es un bucle: mas de eso no se ve, solo pesa.
  - 720x1280. El medio nunca se muestra mas grande (ver `.reel-medio` en
    globals.css), asi que 4K es regalar bytes.
  - `crop` y no `scale` a secas: hay clips en 3:4 que hay que llevar a 9:16.
  - SIN AUDIO. El <video> del reel va `muted` de todos modos.
  - `+faststart` para que empiece sin esperar a bajar el archivo entero.
  - POSTER en WebP: es lo que se ve mientras el video no arranca, y con
    `preload="none"` eso es siempre hasta que el plato entra en pantalla.

TOPE DE TAMANO, y aqui hay una leccion. La primera version usaba CRF fijo, que
es calidad constante y por tanto TAMANO VARIABLE. Un clip quieto salia en
280 KB y uno de papas friendose —aceite burbujeando, ruido en cada cuadro—
salio en 5.375 KB, casi cuatro veces el presupuesto entero de la pagina.
Ahora se reencoda subiendo el CRF hasta entrar en TOPE_KB.

Uso:  python scripts/optimizar-video-reel.py origen.mp4 nombre [segundo-inicial]
"""

import os
import subprocess
import sys

DESTINO = "public/platos/videos"
ANCHO, ALTO = 720, 1280
SEGUNDOS = 6
CRF = 30
CRF_MAX = 44
TOPE_KB = 900
FPS = 24

ENCUADRE = (
    f"scale={ANCHO}:{ALTO}:force_original_aspect_ratio=increase,"
    f"crop={ANCHO}:{ALTO}"
)


def correr(args: list[str]) -> None:
    subprocess.run(args, check=True, capture_output=True)


def main() -> None:
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)

    origen, nombre = sys.argv[1], sys.argv[2]
    inicio = sys.argv[3] if len(sys.argv) > 3 else "0"

    os.makedirs(DESTINO, exist_ok=True)
    video = f"{DESTINO}/{nombre}.mp4"
    poster = f"{DESTINO}/{nombre}-poster.webp"

    crf = CRF
    while True:
        correr([
            "ffmpeg", "-y", "-ss", inicio, "-t", str(SEGUNDOS), "-i", origen,
            "-vf", f"{ENCUADRE},fps={FPS}",
            "-an", "-c:v", "libx264", "-profile:v", "main", "-crf", str(crf),
            "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
            video,
        ])
        kb_actual = os.path.getsize(video) / 1024
        if kb_actual <= TOPE_KB or crf >= CRF_MAX:
            break
        crf += 4
        print(f"    {kb_actual:.0f} KB pasa el tope, reintentando con crf {crf}")
    # El poster medio segundo despues del corte: el primer cuadro de un clip
    # suele venir oscuro o con el movimiento a medias.
    correr([
        "ffmpeg", "-y", "-ss", str(float(inicio) + 0.5), "-i", origen,
        "-vframes", "1", "-vf", ENCUADRE, "-quality", "78", poster,
    ])

    kb = lambda p: round(os.path.getsize(p) / 1024)
    print(f"  {nombre:20s} video {kb(video):5d} KB (crf {crf})   poster {kb(poster):4d} KB")


if __name__ == "__main__":
    main()
