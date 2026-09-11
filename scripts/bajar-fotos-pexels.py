"""
Baja fotos VERTICALES de Pexels y las deja listas para la galeria del reel.

POR QUE VERTICALES, que es la razon de que este script exista: el medio del
reel es 9:16. Las fotos que teniamos son 800x600 horizontales, y `object-cover`
en ese marco las amplia 1,35x y muestra solo el 35% central de su ancho. Por eso
los reels se veian apagados: no era la luz, era el recorte.

Licencia Pexels: uso comercial, sin atribucion obligatoria. Prohibe revender
copias sin alterar. Verificada el 2026-09-09 en https://www.pexels.com/license/
Aun asi, anotar cada foto en LICENCIAS.json: si manana hay que reemplazarlas
por las del cliente, hace falta saber cual era cual.

Uso:  python scripts/bajar-fotos-pexels.py <plato> [--desde N] <id> [<id> ...]
Deja: public/platos/galeria/<plato>-1.webp, -2.webp, ...

`--desde` sirve para AMPLIAR una galeria sin pisar lo que ya hay: con
`--desde 3` el primer archivo sale como `<plato>-3.webp`.
"""

import os
import sys
import urllib.request

from PIL import Image, ImageOps

DESTINO = "public/platos/galeria"
ANCHO, ALTO = 720, 1280
CALIDAD = 78
# `h=1600` pide el lado largo a 1600px: suficiente para recortar a 1280 sin
# ampliar, y sin bajar el original de varios megas.
CDN = "https://images.pexels.com/photos/{id}/pexels-photo-{id}.jpeg?auto=compress&cs=tinysrgb&h=1600"


def main() -> None:
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)

    plato, resto = sys.argv[1], sys.argv[2:]
    desde = 1
    if resto and resto[0] == "--desde":
        desde = int(resto[1])
        resto = resto[2:]
    ids = resto
    os.makedirs(DESTINO, exist_ok=True)

    for n, ident in enumerate(ids, start=desde):
        pedido = urllib.request.Request(
            CDN.format(id=ident), headers={"User-Agent": "Mozilla/5.0"}
        )
        # Un id retirado del catalogo devuelve 404. Se avisa y se sigue con los
        # demas: que una foto caida aborte la descarga entera de un lote de
        # treinta y cuatro es peor que la foto que falta.
        try:
            with urllib.request.urlopen(pedido) as r:
                crudo = r.read()
        except urllib.error.HTTPError as e:
            print(f"  !! {plato}-{n}: pexels {ident} devolvio {e.code}, se omite")
            continue

        tmp = f"{DESTINO}/.tmp-{ident}.jpg"
        with open(tmp, "wb") as f:
            f.write(crudo)

        im = ImageOps.exif_transpose(Image.open(tmp)).convert("RGB")
        origen = im.size
        # Recorte 9:16 centrado. `fit` recorta lo que sobra en vez de deformar.
        im = ImageOps.fit(im, (ANCHO, ALTO), method=Image.LANCZOS)

        salida = f"{DESTINO}/{plato}-{n}.webp"
        im.save(salida, "WEBP", quality=CALIDAD, method=6)
        os.remove(tmp)
        print(
            f"  {plato}-{n}.webp  {origen[0]}x{origen[1]} -> {ANCHO}x{ALTO}  "
            f"{round(os.path.getsize(salida) / 1024)} KB  (pexels {ident})"
        )


if __name__ == "__main__":
    main()
