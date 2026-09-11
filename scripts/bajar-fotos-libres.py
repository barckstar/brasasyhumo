"""
Baja fotos de comida de Wikimedia Commons para la muestra.

Por que Commons y no Unsplash/Pexels: Unsplash cerro su endpoint publico
(source.unsplash.com da 503) y bloquea el scraping; Pexels y Unsplash exigen
llave de API. Commons no pide llave y, sobre todo, publica la licencia de cada
archivo, que es lo que se necesita para poder afirmar que las fotos son libres.

Reglas que aplica:
  - Solo dominio publico y CC0. Se descartan CC BY y CC BY-SA para no arrastrar
    obligaciones de atribucion en un sitio comercial.
  - Se descartan archivos cuyo titulo mencione una marca: poner una foto de
    Big Mac o Burger King en el sitio de un competidor local seria un error.
  - Se guarda un manifiesto con archivo, licencia y autor, para poder rendir
    cuentas de cada imagen.

ESTAS FOTOS SON PROVISIONALES. No son la comida del cliente. Reemplazarlas por
fotos reales del local antes de publicar.
"""

import json
import os
import re
import time
import urllib.parse
import urllib.request

API = "https://commons.wikimedia.org/w/api.php"
UA = "5taAvenidaGrill-demo/1.0 (contacto: barckstar.lml@gmail.com)"
DESTINO = "public/platos/fotos"

LICENCIAS_OK = {"cc0", "public domain", "pd", "cc pd", "no restrictions"}

MARCAS = re.compile(
    r"mcdonald|burger king|kfc|wendy|subway|domino|pizza hut|taco bell|"
    r"starbucks|carl'?s jr|five guys|in-?n-?out|popeyes|arby|hardee|quiznos|"
    r"whopper|big mac|mcchicken|coca[- ]cola|pepsi",
    re.I,
)

# plato -> termino de busqueda en Commons
BUSQUEDAS = {
    "angus": "beef burger homemade",
    "pulled-pork": "pulled pork sandwich",
    "costilla-burger": "barbecue burger",
    "doble-torta": "double patty burger",
    "cheeseburger": "cheeseburger homemade",
    "de-pollo": "chicken burger sandwich",
    "tradicional": "hamburger plate",
    "economica": "simple hamburger",
    "surtida-grande": "meat platter grill",
    "surtida-pequena": "mixed grill plate",
    "taco-birria": "birria tacos",
    "costilla-cerdo": "pork ribs barbecue",
    "papas-mixtas": "loaded fries",
    "nachos-mixtos": "nachos cheese",
    "nachos": "nachos tortilla chips",
    "nuggets": "chicken nuggets",
    "alitas": "chicken wings",
    "papas-especiales": "french fries plate",
    "pinchos": "meat skewers grill",
    "canasta-chicharron": "chicharron pork",
    "cartucho": "fried food basket",
    "salchipapas": "salchipapas",
    "taco-tico": "taco",
    "empanada-arreglada": "empanada",
    "choripan": "choripan sausage sandwich",
    "empanada": "empanadas",
    "papas-gajos": "potato wedges",
    "papas-pequenas": "french fries",
}


def pedir(url):
    return urllib.request.urlopen(
        urllib.request.Request(url, headers={"User-Agent": UA}), timeout=30
    )


def buscar(termino, intentos=8):
    q = urllib.parse.urlencode(
        {
            "action": "query",
            "generator": "search",
            "gsrsearch": f"filetype:bitmap {termino}",
            "gsrnamespace": "6",
            "gsrlimit": str(intentos),
            "prop": "imageinfo",
            "iiprop": "url|extmetadata",
            "iiurlwidth": "1000",
            "format": "json",
        }
    )
    datos = json.load(pedir(f"{API}?{q}"))
    paginas = (datos.get("query") or {}).get("pages", {})
    salida = []
    for p in paginas.values():
        info = p.get("imageinfo", [{}])[0]
        meta = info.get("extmetadata", {})
        lic = (meta.get("LicenseShortName", {}).get("value") or "").strip()
        autor = re.sub(
            r"<[^>]+>", "", meta.get("Artist", {}).get("value") or ""
        ).strip()
        salida.append(
            {
                "titulo": p.get("title", ""),
                "licencia": lic,
                "autor": autor[:80],
                "url": info.get("thumburl") or info.get("url"),
            }
        )
    return salida


def aceptable(c):
    if not c["url"]:
        return False
    if MARCAS.search(c["titulo"]):
        return False
    return c["licencia"].lower().strip(". ") in LICENCIAS_OK


def main():
    os.makedirs(DESTINO, exist_ok=True)
    manifiesto = []
    sin_foto = []

    for plato, termino in BUSQUEDAS.items():
        try:
            candidatos = buscar(termino)
        except Exception as e:
            print(f"  {plato:22s} ERROR de busqueda: {e}")
            sin_foto.append(plato)
            continue

        elegido = next((c for c in candidatos if aceptable(c)), None)
        if not elegido:
            licencias = {c["licencia"] for c in candidatos}
            print(f"  {plato:22s} sin candidato libre. Vistas: {licencias}")
            sin_foto.append(plato)
            time.sleep(0.4)
            continue

        ruta = f"{DESTINO}/{plato}.jpg"
        try:
            with pedir(elegido["url"]) as r, open(ruta, "wb") as f:
                f.write(r.read())
        except Exception as e:
            print(f"  {plato:22s} ERROR al bajar: {e}")
            sin_foto.append(plato)
            time.sleep(0.4)
            continue

        kb = round(os.path.getsize(ruta) / 1024)
        print(f"  {plato:22s} OK {kb:>5} KB  [{elegido['licencia']}]")
        manifiesto.append({"plato": plato, **elegido})
        time.sleep(0.4)

    with open(f"{DESTINO}/LICENCIAS.json", "w", encoding="utf-8") as f:
        json.dump(manifiesto, f, ensure_ascii=False, indent=2)

    print(f"\nBajadas: {len(manifiesto)} | Sin foto: {len(sin_foto)}")
    if sin_foto:
        print("Sin foto:", ", ".join(sin_foto))


if __name__ == "__main__":
    main()
