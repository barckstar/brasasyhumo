/**
 * ============================================================================
 * BRASA & HUMO — negocio de MUESTRA
 * ============================================================================
 * ESTE RESTAURANTE NO EXISTE. Es una marca inventada para enseñar el producto
 * a clientes potenciales, sin usar los datos de ningun negocio real.
 *
 * Por eso hay decisiones que parecen descuidos y no lo son:
 *
 *   - EL TELEFONO ES INVALIDO A PROPOSITO. En Costa Rica ningun numero
 *     empieza por 0, asi que `00000000` no puede sonarle a nadie. Un numero
 *     "verosimil" en una demo que circula termina haciendo sonar el telefono
 *     de un desconocido, y eso es peor que un enlace que no abre.
 *
 *   - LAS REDES APUNTAN A LA RAIZ de cada plataforma, sin usuario. Un
 *     @brasayhumo inventado puede pertenecer a alguien.
 *
 *   - NO HAY FICHA DE GOOGLE. Un negocio inventado no tiene CID ni Place ID;
 *     inventarlos apuntaria a la ficha de otro local. Los enlaces de resenas
 *     van a una busqueda en Maps por nombre.
 *
 * TODO lo de aqui se reemplaza al usar esta base para un cliente real.
 * ============================================================================
 */

export type Horario = {
  /** Etiqueta legible, ej. "Martes a jueves" */
  dias: string;
  /** Codigos de dia para el JSON-LD (schema.org) */
  diasSchema: string[];
  /** Formato 24h "HH:MM". null en ambos = cerrado */
  apertura: string | null;
  cierre: string | null;
};

export const negocio = {
  nombre: "Brasa & Humo",
  nombreFacebook: "Brasa & Humo",
  tagline: "Ahumado lento, a fuego de leña.",

  /**
   * El nombre partido en dos lineas para el titular del hero y el pie.
   * La segunda va en naranja. Se guarda partido y no se calcula porque donde
   * cae el corte es decision de diseno: "Brasa &" / "Humo" respira, y
   * "Brasa" / "& Humo" deja un ampersand huerfano abriendo linea.
   */
  nombreHero: { linea1: "Brasa &", linea2: "Humo" },

  /**
   * INVALIDO A PROPOSITO: en Costa Rica no hay numeros que empiecen por 0.
   * El enlace de WhatsApp se arma igual y el flujo completo se puede enseñar,
   * pero no le suena el telefono a nadie.
   */
  whatsapp: "50600000000",
  whatsappVisible: "0000-0000",

  direccion: "Dirección de muestra, San José, Costa Rica",
  ciudad: "San José",
  provincia: "San José",
  pais: "CR",

  /** Sin usuario: un @ inventado puede ser de otra persona. */
  facebook: "https://www.facebook.com/",
  instagram: "https://www.instagram.com/",
  instagramHandle: "@brasayhumo",

  /** Punto generico del centro de San Jose. No es la direccion de nadie. */
  coordenadas: { lat: 9.9333, lng: -84.0833 },

  /**
   * Un negocio inventado no tiene ficha de Google. `cid` en null hace que los
   * enlaces de resenas caigan en una busqueda por nombre en vez de apuntar a
   * la ficha de otro local.
   */
  google: {
    cid: null as string | null,
    kgId: null as string | null,
    /** DEMO. No hay resenas reales porque no hay negocio. */
    calificacion: 4.8 as number | null,
    cantidadResenas: 127 as number | null,
  },

  /** DEMO. */
  seguidoresFacebook: 2840,

  rangoPrecios: "₡₡₡",
  rangoPreciosTexto: "₡8.000 – ₡15.000 por persona",
  /** Del acompañamiento mas barato al plato mas caro del menu. */
  rangoMenu: { min: 1500, max: 22000 },
  categoriaGoogle: "Restaurante de parrilla y ahumados",
  plusCode: null as string | null,
  servicios: ["Consumo en el lugar", "Para llevar", "Entrega a domicilio"],

  /**
   * Se muestran en el checkout como informacion: el cobro lo hace el
   * restaurante por WhatsApp, el sitio no procesa pagos.
   */
  metodosPago: ["Sinpe Móvil", "Efectivo", "Tarjeta"],

  /**
   * DEMO. Un ahumadero cierra lunes: el brisket y la costilla necesitan entre
   * diez y catorce horas de ahumador, asi que el lunes es dia de preparacion.
   * Ese detalle es lo que hace creible un horario inventado.
   */
  horarios: [
    {
      dias: "Lunes",
      diasSchema: ["Monday"],
      apertura: null,
      cierre: null,
    },
    {
      dias: "Martes a jueves",
      diasSchema: ["Tuesday", "Wednesday", "Thursday"],
      apertura: "12:00",
      cierre: "22:00",
    },
    {
      dias: "Viernes y sábado",
      diasSchema: ["Friday", "Saturday"],
      apertura: "12:00",
      cierre: "23:00",
    },
    {
      dias: "Domingo",
      diasSchema: ["Sunday"],
      apertura: "12:00",
      cierre: "21:00",
    },
  ] satisfies Horario[],
} as const;

/** Construye el enlace de WhatsApp con un mensaje opcional ya codificado. */
export function enlaceWhatsApp(mensaje?: string): string {
  const base = `https://wa.me/${negocio.whatsapp}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}

/**
 * Enlace a la ubicacion en Google Maps.
 *
 * Con `cid` va directo a la ficha del negocio, que es lo que se quiere en un
 * cliente real. SIN `cid` —como en esta muestra— cae en una busqueda por
 * nombre y ciudad. Antes se interpolaba el campo a secas y con el valor en
 * null salia `maps?cid=null`, un enlace roto que nadie notaba hasta hacer clic.
 */
export function enlaceMapa(): string {
  if (negocio.google.cid) {
    return `https://www.google.com/maps?cid=${negocio.google.cid}`;
  }
  const consulta = encodeURIComponent(`${negocio.nombre} ${negocio.ciudad}`);
  return `https://www.google.com/maps/search/?api=1&query=${consulta}`;
}
