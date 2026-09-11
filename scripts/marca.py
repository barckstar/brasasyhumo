"""
Genera la marca completa de Brasa & Humo: emblema, iconos y tarjeta de Open Graph.

POR QUE UN SCRIPT Y NO ARCHIVOS SUELTOS: si manana cambia el naranja de la
paleta o el nombre, los seis archivos se rehacen con un comando en vez de
editarlos a mano uno por uno y que queden desparejos.

LA LLAMA SE DIBUJA CON POLIGONOS, NO CON CURVAS. A 32px —el tamano del favicon,
que es donde mas se juega— las curvas no se distinguen, y un poligono no se
deforma al escalar hacia abajo. Con curvas el icono se veia como una mancha.

Uso:  python scripts/marca.py
Deja: public/marca/{icon,icon-192,icon-512,apple-icon}.png, logo.jpg, og.jpg
"""

import os

from PIL import Image, ImageDraw, ImageFont

DESTINO = "public/marca"

# Los mismos valores que `@theme` en globals.css. Si cambian alli, cambian aqui.
NEGRO = (5, 5, 5)
SUPERFICIE = (26, 15, 13)
NARANJA = (227, 81, 32)
NARANJA_CLARO = (240, 160, 93)
BLANCO = (255, 253, 252)
TEXTO_SUAVE = (217, 201, 194)

NOMBRE = "BRASA & HUMO"
TAGLINE = "AHUMADO LENTO, A FUEGO DE LEÑA"
CIUDAD = "San José, Costa Rica"

# Impact por su condensada pesada, que es lo mas cercano a la Oswald del sitio
# entre las fuentes que trae Windows.
TITULAR = "C:/Windows/Fonts/impact.ttf"
CUERPO = "C:/Windows/Fonts/arialbd.ttf"

# Todo se dibuja 4 veces mas grande y se reduce al final: es antialiasing de
# pobre, pero funciona y evita depender de una libreria de vectores.
ESCALA = 4


def llama(d: ImageDraw.ImageDraw, cx: float, cy: float, alto: float, color) -> None:
    """Llama estilizada: dos lobulos y una punta, en un solo poligono."""
    a = alto
    d.polygon(
        [
            (cx, cy - a * 0.52),
            (cx + a * 0.16, cy - a * 0.22),
            (cx + a * 0.30, cy - a * 0.30),
            (cx + a * 0.30, cy - a * 0.02),
            (cx + a * 0.34, cy + a * 0.18),
            (cx + a * 0.18, cy + a * 0.40),
            (cx, cy + a * 0.46),
            (cx - a * 0.18, cy + a * 0.40),
            (cx - a * 0.34, cy + a * 0.18),
            (cx - a * 0.30, cy - a * 0.06),
            (cx - a * 0.16, cy - a * 0.28),
        ],
        fill=color,
    )


def emblema(tam: int) -> Image.Image:
    """Disco oscuro, anillo naranja y la llama. El logo y todos los iconos."""
    t = tam * ESCALA
    im = Image.new("RGB", (t, t), NEGRO)
    d = ImageDraw.Draw(im)
    m = t * 0.04
    d.ellipse([m, m, t - m, t - m], fill=SUPERFICIE, outline=NARANJA, width=int(t * 0.055))
    llama(d, t / 2, t * 0.46, t * 0.52, NARANJA)
    # La segunda llama, mas chica y clara, da el corazon de la brasa.
    llama(d, t / 2, t * 0.52, t * 0.30, NARANJA_CLARO)
    return im.resize((tam, tam), Image.LANCZOS)


def open_graph() -> Image.Image:
    """1200x630, que es lo que piden Facebook, WhatsApp y X."""
    e = 2
    w, h = 1200 * e, 630 * e
    im = Image.new("RGB", (w, h), NEGRO)
    d = ImageDraw.Draw(im)
    # Resplandor de brasa subiendo desde abajo, en cuadratica para que el
    # degradado no se vea como una banda recta.
    for y in range(h):
        t = max(0.0, (y - h * 0.45) / (h * 0.55))
        d.line([(0, y), (w, y)], fill=(int(5 + 38 * t * t), int(5 + 13 * t * t), int(5 + 7 * t * t)))
    llama(d, w * 0.155, h * 0.46, h * 0.40, NARANJA)
    llama(d, w * 0.155, h * 0.52, h * 0.23, NARANJA_CLARO)
    d.text((w * 0.285, h * 0.40), NOMBRE, font=ImageFont.truetype(TITULAR, int(h * 0.155)), fill=BLANCO, anchor="lm")
    d.text((w * 0.285, h * 0.56), TAGLINE, font=ImageFont.truetype(TITULAR, int(h * 0.062)), fill=NARANJA, anchor="lm")
    d.text((w * 0.285, h * 0.68), CIUDAD, font=ImageFont.truetype(CUERPO, int(h * 0.045)), fill=TEXTO_SUAVE, anchor="lm")
    return im.resize((1200, 630), Image.LANCZOS)


def favicon() -> None:
    """
    `src/app/favicon.ico` MANDA sobre los iconos del metadata: Next lo sirve
    como `/favicon.ico` y el navegador lo prefiere. Si se olvida, la pestana
    sigue mostrando el icono del proyecto anterior aunque `public/marca/` este
    al dia. Paso de verdad.
    """
    # RGBA OBLIGATORIO: el decodificador de Next rechaza el .ico si los PNG de
    # adentro van en RGB — "The PNG is not in RGBA format!" y el build se cae.
    ims = [emblema(t).convert("RGBA") for t in (16, 32, 48, 64)]
    ims[0].save(
        "src/app/favicon.ico",
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48), (64, 64)],
        append_images=ims[1:],
    )
    print(f"  favicon.ico          {round(os.path.getsize('src/app/favicon.ico') / 1024)} KB")


def main() -> None:
    os.makedirs(DESTINO, exist_ok=True)
    for nombre, tam in [("icon-512", 512), ("icon-192", 192), ("apple-icon", 180), ("icon", 32)]:
        emblema(tam).save(f"{DESTINO}/{nombre}.png")
    emblema(400).save(f"{DESTINO}/logo.jpg", quality=92)
    open_graph().save(f"{DESTINO}/og.jpg", quality=88)
    favicon()
    for f in sorted(os.listdir(DESTINO)):
        print(f"  {f:20s} {round(os.path.getsize(f'{DESTINO}/{f}') / 1024)} KB")


if __name__ == "__main__":
    main()
