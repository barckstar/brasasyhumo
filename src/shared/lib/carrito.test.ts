import { describe, it, expect } from "vitest";
import { carritoReducer, total, conteo } from "@/shared/lib/carrito";
import type { Plato } from "@/shared/types/menu";

function plato(id: string, precio = 8500): Plato {
  return {
    id,
    nombre: `Plato ${id}`,
    descripcion: "",
    ingredientes: [],
    precio,
    categoria: "ahumadas",
    portada: { src: "/x.jpg", alt: "x" },
      medios: [{ tipo: "imagen", src: "/x.jpg", alt: "x" }],
    disponible: true,
  };
}

describe("carritoReducer", () => {
  it("agrega un plato nuevo con cantidad 1", () => {
    const r = carritoReducer([], { tipo: "agregar", plato: plato("a") });
    expect(r).toHaveLength(1);
    expect(r[0].cantidad).toBe(1);
  });

  it("incrementa en vez de duplicar la linea", () => {
    let r = carritoReducer([], { tipo: "agregar", plato: plato("a") });
    r = carritoReducer(r, { tipo: "agregar", plato: plato("a") });
    expect(r).toHaveLength(1);
    expect(r[0].cantidad).toBe(2);
  });

  it("elimina la linea cuando la cantidad baja a cero", () => {
    let r = carritoReducer([], { tipo: "agregar", plato: plato("a") });
    r = carritoReducer(r, { tipo: "cambiarCantidad", id: "a", cantidad: 0 });
    expect(r).toHaveLength(0);
  });

  it("nunca deja cantidades negativas", () => {
    let r = carritoReducer([], { tipo: "agregar", plato: plato("a") });
    r = carritoReducer(r, { tipo: "cambiarCantidad", id: "a", cantidad: -3 });
    expect(r).toHaveLength(0);
  });

  it("quitar una linea no afecta a las demas", () => {
    let r = carritoReducer([], { tipo: "agregar", plato: plato("a") });
    r = carritoReducer(r, { tipo: "agregar", plato: plato("b") });
    r = carritoReducer(r, { tipo: "quitar", id: "a" });
    expect(r).toHaveLength(1);
    expect(r[0].plato.id).toBe("b");
  });

  it("conserva la nota al cambiar la cantidad", () => {
    let r = carritoReducer([], { tipo: "agregar", plato: plato("a") });
    r = carritoReducer(r, { tipo: "ponerNota", id: "a", nota: "sin cebolla" });
    r = carritoReducer(r, { tipo: "cambiarCantidad", id: "a", cantidad: 3 });
    expect(r[0].nota).toBe("sin cebolla");
    expect(r[0].cantidad).toBe(3);
  });

  it("vaciar deja el carrito sin lineas", () => {
    let r = carritoReducer([], { tipo: "agregar", plato: plato("a") });
    r = carritoReducer(r, { tipo: "vaciar" });
    expect(r).toHaveLength(0);
  });

  it("no agrega platos no disponibles", () => {
    const agotado = { ...plato("z"), disponible: false };
    const r = carritoReducer([], { tipo: "agregar", plato: agotado });
    expect(r).toHaveLength(0);
  });
});

describe("total y conteo", () => {
  it("total multiplica precio por cantidad y suma", () => {
    let r = carritoReducer([], { tipo: "agregar", plato: plato("a", 8500) });
    r = carritoReducer(r, { tipo: "cambiarCantidad", id: "a", cantidad: 2 });
    r = carritoReducer(r, { tipo: "agregar", plato: plato("b", 9500) });
    expect(total(r)).toBe(8500 * 2 + 9500);
  });

  it("conteo suma unidades, no lineas", () => {
    let r = carritoReducer([], { tipo: "agregar", plato: plato("a") });
    r = carritoReducer(r, { tipo: "cambiarCantidad", id: "a", cantidad: 4 });
    r = carritoReducer(r, { tipo: "agregar", plato: plato("b") });
    expect(conteo(r)).toBe(5);
  });

  it("el carrito vacio suma cero", () => {
    expect(total([])).toBe(0);
    expect(conteo([])).toBe(0);
  });
});
