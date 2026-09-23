import Image from "next/image";
import { Contenedor } from "@/shared/components/ui/Contenedor";
import { BotonEnlace } from "@/shared/components/ui/Boton";
import { negocio } from "@/shared/config/negocio";
import { IconoCarrito } from "@/shared/components/ui/Iconos";
import { CurvaInferior } from "@/shared/components/ui/CurvaInferior";
import { Brasas } from "@/shared/components/ui/Brasas";
import { PruebaSocial } from "./PruebaSocial";
import { LlamasHero } from "./LlamasHero";
import { Revelar } from "@/shared/components/ui/Revelar";

/*
  Orden en el eje Z, de atras hacia adelante:
    -z-20  resplandor de fondo
    -z-10  la parrilla a opacidad plena, el velo del texto y las llamas
     z-0   las brasas, que asi parecen subir SOBRE el plato
     z-10  el texto y los botones, siempre por encima de todo
*/
export function Hero() {
  return (
    <section className="relative isolate flex min-h-[88svh] items-center overflow-hidden bg-base pb-24 pt-16 sm:pb-28">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-20 h-2/3"
        style={{
          background:
            "radial-gradient(ellipse 80% 100% at 30% 120%, rgba(227,81,32,0.26) 0%, rgba(160,16,16,0.10) 42%, transparent 74%)",
        }}
      />

      {/*
        Fondo de producto, a OPACIDAD PLENA: la carne tiene que verse y dar
        hambre. Lo que protege al texto es el velo de mas abajo, no una foto
        apagada. La mascara funde los bordes con el fondo negro.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          // Caida larga y gradual. Con un corte tardio se veia el borde recto
          // del recorte justo donde termina la tabla de madera.
          maskImage:
            "radial-gradient(ellipse 95% 62% at 50% 42%, #000 0%, rgba(0,0,0,0.9) 28%, rgba(0,0,0,0.45) 55%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 95% 62% at 50% 42%, #000 0%, rgba(0,0,0,0.9) 28%, rgba(0,0,0,0.45) 55%, transparent 80%)",
        }}
      >
        {/*
          ANTES era una version de 400px desenfocada (16 KB), pensada para
          verse al 17% de opacidad. A opacidad plena eso se ve borroso, asi que
          el origen es de 1600px y Next sirve el ancho justo por `sizes`.

          CON `priority`, y aqui hay una leccion.

          Primero la puse en lazy esperando que el LCP pasara a ser el titulo.
          No funciono: esta imagen cubre el viewport, asi que ES el elemento
          mas grande pase lo que pase, y en lazy simplemente cargaba de ultima
          — el LCP empeoro de 4,8 a 5,0 s.

          Si un elemento va a ser el LCP igual, la unica salida es que llegue
          rapido: `priority` para que se precargue y calidad 60, que es donde
          la foto oscura deja de mostrar bloques.

          `quality` debe estar en `images.qualities` de next.config.ts, o Next
          lo ignora y sirve a 75.
        */}
        <Image
          src="/platos/hero-fondo.webp"
          alt=""
          fill
          priority
          quality={60}
          sizes="100vw"
          /*
            `fill` y no width/height: con alto automatico el navegador no sabe
            cuanto espacio reservar hasta que la imagen carga, y al llegar
            empujaba el contenido. Lighthouse lo marcaba como el unico layout
            shift de la pagina (CLS 0,111). Con `fill` el hueco queda reservado
            desde el primer pintado.

            Si se cambia la foto, su opacidad, el velo o el color de acento,
            VOLVER A MEDIR el contraste pixel a pixel (ver el velo).
          */
          className="object-cover"
        />
      </div>

      {/*
        Disuelve el borde recto donde la tabla toca el limite del recorte.
        Va despues de la imagen y al mismo nivel de z, asi que la cubre.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-1/4 bg-gradient-to-t from-base via-base/75 to-transparent sm:h-2/5"
      />

      {/*
        VELO SOLO DETRAS DEL TEXTO. Con la foto a opacidad plena, medido pixel
        a pixel en 375x812: la bajada caia sobre la carne iluminada a 1.87:1 y
        el antetitulo a 3.12:1, con 4.5 de minimo. Un velo parejo de 0.5 lo
        resuelve pero apaga la foto entera, que es lo que se quiso evitar.
        En movil el texto ocupa todo el ancho: el velo baja desde arriba y se
        va antes de las llamas. Desde `sm` el texto vive a la izquierda y la
        carne queda al centro-derecha, sin velo.
        Con velo, peor pixel: movil antetitulo 4.55, bajada 5.74; 1440x900
        antetitulo 5.21, bajada 6.85, "HUMO" 3.85 (texto grande, pide 3).
      */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(5,5,5,0.62)_0%,rgba(5,5,5,0.5)_62%,transparent_88%)] sm:bg-[linear-gradient(90deg,rgba(5,5,5,0.7)_0%,rgba(5,5,5,0.5)_32%,transparent_62%)]"
      />

      <LlamasHero />

      <Brasas />

      {/*
        `inmediato` y no `unaVez`: esto esta SOBRE EL PLIEGUE. El observador
        de revelado corre en un `useEffect`, o sea despues de hidratar; si el
        titular dependiera de el se quedaria invisible hasta que llegue el
        JavaScript, que es justo el render delay que se vino a eliminar.
        `inmediato` lo anima con una @keyframes desde el primer pintado.
      */}
      <Contenedor className="relative z-10 py-16 sm:py-20">
        <div className="max-w-2xl">
          <Revelar direccion="izquierda" inmediato>
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-acento" aria-hidden="true" />
            {/*
              SOMBRA PROPIA, no decorativa. Este antetitulo es naranja a 12px
              —texto normal, necesita 4.5:1— y el naranja de la paleta parte de
              5.30:1 sobre el fondo plano: encima de una foto el margen se agota
              en cuanto la imagen aclara. Con sombra el texto se separa de
              cualquier fondo y el encuadre vuelve a ser una decision de diseno.
            */}
            <span className="font-display text-xs font-semibold uppercase tracking-[0.32em] text-acento drop-shadow-[0_1px_4px_rgba(5,5,5,0.95)]">
              {negocio.ciudad} · {negocio.provincia}
            </span>
          </div>
          </Revelar>

          <Revelar retraso={0.1} inmediato>
          <h1 className="mt-6 font-display text-[3.25rem] font-bold uppercase italic leading-[0.86] tracking-[-0.02em] text-texto sm:text-7xl lg:text-8xl">
            {negocio.nombreHero.linea1}
            <span className="block text-acento">{negocio.nombreHero.linea2}</span>
          </h1>
          </Revelar>

          <Revelar retraso={0.2} inmediato>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-texto-suave drop-shadow-[0_1px_4px_rgba(5,5,5,0.9)] sm:text-xl">
              {negocio.tagline}
            </p>
          </Revelar>

          <Revelar retraso={0.3} inmediato>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <BotonEnlace href="/menu" tamano="lg">
              <IconoCarrito />
              Ordenar
            </BotonEnlace>
            <BotonEnlace href="/menu" variante="contorno" tamano="lg">
              Ver el menú
            </BotonEnlace>
          </div>
          </Revelar>

          <Revelar retraso={0.4} inmediato className="mt-8">
            <PruebaSocial />
          </Revelar>
        </div>
      </Contenedor>

      <CurvaInferior className="text-base-alt" />
    </section>
  );
}
