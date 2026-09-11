import Image from "next/image";
import { Contenedor } from "@/shared/components/ui/Contenedor";
import { BotonEnlace } from "@/shared/components/ui/Boton";
import { negocio } from "@/shared/config/negocio";
import { IconoCarrito } from "@/shared/components/ui/Iconos";
import { CurvaInferior } from "@/shared/components/ui/CurvaInferior";
import { Brasas } from "@/shared/components/ui/Brasas";
import { PruebaSocial } from "./PruebaSocial";
import { Revelar } from "@/shared/components/ui/Revelar";

/*
  Orden en el eje Z, de atras hacia adelante:
    -z-20  resplandor de fondo
    -z-10  la hamburguesa, a pantalla completa y muy atenuada
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
        Fondo de producto. Va detras de todo y muy transparente para que el
        texto siga siendo lo que manda. El recorte original tiene un borde
        recto donde la tabla toca el limite del lienzo, asi que se desvanece
        con una mascara en los cuatro lados.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.17]"
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
          Version LIVIANA a proposito. Esta imagen se muestra al 17% de opacidad
          y bajo una mascara que le difumina los bordes: a esa opacidad el
          detalle no se percibe, asi que servir el original de 1672px era
          regalar bytes que nadie ve.

          CON `priority`, y aqui hay una leccion.

          Primero la puse en lazy esperando que el LCP pasara a ser el titulo.
          No funciono: esta imagen cubre el viewport, asi que ES el elemento
          mas grande pase lo que pase, y en lazy simplemente cargaba de ultima
          — el LCP empeoro de 4,8 a 5,0 s.

          Si un elemento va a ser el LCP igual, la unica salida es que llegue
          rapido. Por eso: 400px, calidad 40 y desenfoque leve (16 KB en vez de
          382), mas `priority` para que se precargue. A 17% de opacidad y bajo
          la mascara, la diferencia visual con el original es nula.

          `quality` explicito porque el optimizador de Next reprocesa la imagen:
          sin esto volveria a subir la calidad y se perderia la ganancia.
        */}
        <Image
          src="/platos/hero-fondo.webp"
          alt=""
          fill
          priority
          quality={40}
          sizes="(max-width: 640px) 100vw, 800px"
          /*
            `fill` y no width/height: con alto automatico el navegador no sabe
            cuanto espacio reservar hasta que la imagen carga, y al llegar
            empujaba el contenido. Lighthouse lo marcaba como el unico layout
            shift de la pagina (CLS 0,111). Con `fill` el hueco queda reservado
            desde el primer pintado.

            ENCUADRE CENTRADO, y esto ANTES NO SE PODIA.

            Con el acento naranja el antetitulo —ambar a 12px, o sea texto
            normal, que necesita 4.5:1— caia por debajo del minimo en cuanto la
            foto aclaraba, y habia que correr el encuadre al 65% para meterlo
            sobre una zona oscura.

            Con el ambar de la paleta nueva el peor pixel de TODA la foto da
            7.21:1. Ya no hay que esquivar nada: el encuadre se elige por como
            se ve, no para salvar el contraste.

            Si se cambia la foto del hero o el color de acento, VOLVER A MEDIR.
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
