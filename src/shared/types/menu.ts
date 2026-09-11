/**
 * Tipos del dominio: lo que el local vende.
 *
 * Viven en `shared` y no dentro de `menu` porque los usan CINCO features
 * —menu, ofertas, reels, carrito y checkout— y la regla del proyecto es que
 * una feature nunca importa de otra. Mientras estuvieron en
 * `features/menu/types`, las otras cuatro tenian que romper esa regla solo
 * para poder hablar de un plato.
 */

/**
 * Los ids de categoria, como lista y no como union suelta: asi el esquema que
 * valida `menu.json` los usa sin repetirlos. Una union escrita dos veces se
 * desincroniza el dia que alguien agrega una categoria.
 */
export const ID_CATEGORIAS = [
  "ofertas",
  "ahumadas",
  "delmar",
  "parrilla",
  "acompanamientos",
] as const;

export type CategoriaId = (typeof ID_CATEGORIAS)[number];

/**
 * Union discriminada a proposito. La vista Reels funciona HOY con imagenes y
 * acepta video cuando el cliente los grabe, sin reescribir componentes.
 */
export type Media =
  | { tipo: "video"; src: string; poster: string; alt: string }
  | { tipo: "imagen"; src: string; alt: string };

/**
 * Una foto, sin la union de `Media`.
 *
 * La PORTADA es de este tipo y no de `Media` a proposito: asi el compilador
 * impide poner un video de portada. Un fotograma de video no dice que plato es
 * —la Costilla Burger mostraba la esquina de una plancha— y eso se veia en la
 * cuadricula del menu, en el carrito y en los destacados.
 */
type Foto = { src: string; alt: string };

export type Plato = {
  id: string;
  nombre: string;
  descripcion: string;
  /** Vacio cuando el menu del cliente no detalla la composicion. */
  ingredientes: string[];
  /** Colones enteros. Precio final al publico, tal como lo publica el local. */
  precio: number;
  categoria: CategoriaId;
  /**
   * La foto de portada: cuadricula del menu, carrito, sugerencias, destacados
   * y encabezado de la hoja de detalle. SIEMPRE una foto, nunca un video.
   */
  portada: Foto;
  /**
   * La galeria ordenada del plato: lo que recorren el menu en video y la hoja
   * de detalle. Aqui SI puede haber video, y suele ir primero.
   *
   * Ni la portada ni los medios se escriben en `menu.ts`: viven en
   * `features/menu/data/galerias.json`, que se valida al cargar.
   */
  medios: Media[];
  destacado?: boolean;
  disponible: boolean;
};

export type Categoria = {
  id: CategoriaId;
  nombre: string;
  /**
   * Etiqueta para el carril de circulos de los reels, donde cada rotulo
   * dispone de unos 64px. "Menu Grill" se cortaba a "Menu Gri..."; el prefijo
   * "Menu" no distingue nada porque lo comparten dos categorias.
   */
  corto?: string;
};

/**
 * Lo que se puede tener seleccionado en un carril de filtros: una categoria,
 * todo, o los favoritos del aparato. El menu y los reels filtran igual, asi
 * que comparten el tipo en vez de declarar dos identicos.
 */
export type FiltroCatalogo = CategoriaId | "todas" | "favoritos";
