import { describe, it, expect } from "vitest";
import { construirMensaje, LIMITE_SEGURO } from "./construirMensaje";
import type { LineaCarrito } from "@/shared/types/carrito";
import type { DatosPedido } from "../schema";

function linea(id: string, cantidad: number, precio = 8500): LineaCarrito {
  return {
    plato: {
      id,
      nombre: `Plato ${id}`,
      descripcion: "",
      ingredientes: [],
      precio,
      categoria: "parrilla",
      portada: { src: "/x.jpg", alt: "x" },
      medios: [{ tipo: "imagen", src: "/x.jpg", alt: "x" }],
      disponible: true,
    },
    cantidad,
  };
}

const retiro: DatosPedido = {
  nombre: "Ana",
  telefono: "8888-8888",
  modalidad: "retiro",
  metodoPago: "efectivo",
};

const express: DatosPedido = {
  ...retiro,
  modalidad: "express",
  direccion: "Barrio Los Ángeles, casa azul",
};

describe("construirMensaje", () => {
  it("incluye cada linea con su cantidad", () => {
    const { texto } = construirMensaje([linea("a", 2)], retiro, 17000);
    expect(texto).toContain("2x Plato a");
  });

  it("incluye el total formateado en colones", () => {
    const { texto } = construirMensaje([linea("a", 2)], retiro, 17000);
    expect(texto).toContain("₡17.000");
  });

  it("incluye la nota de una linea cuando existe", () => {
    const conNota: LineaCarrito = { ...linea("a", 1), nota: "sin cebolla" };
    const { texto } = construirMensaje([conNota], retiro, 8500);
    expect(texto).toContain("sin cebolla");
  });

  it("omite la direccion cuando es retiro", () => {
    const { texto } = construirMensaje([linea("a", 1)], retiro, 8500);
    expect(texto).not.toContain("Barrio");
  });

  it("incluye la direccion cuando es express", () => {
    const { texto } = construirMensaje([linea("a", 1)], express, 8500);
    expect(texto).toContain("Barrio Los Ángeles, casa azul");
  });

  it("mide el largo YA CODIFICADO, no el crudo", () => {
    // Los acentos y el simbolo de colon se expanden al codificar; si se midiera
    // texto.length se subestimaria el tamano real de la URL.
    const { texto, largoCodificado } = construirMensaje(
      [linea("a", 1)],
      express,
      8500,
    );
    expect(largoCodificado).toBe(encodeURIComponent(texto).length);
    expect(largoCodificado).toBeGreaterThan(texto.length);
  });

  it("marca excedeLimite en un pedido enorme", () => {
    const muchas = Array.from({ length: 40 }, (_, i) =>
      linea(`plato-numero-${i}`, 3),
    );
    const { excedeLimite, largoCodificado } = construirMensaje(
      muchas,
      express,
      999000,
    );
    expect(largoCodificado).toBeGreaterThan(LIMITE_SEGURO);
    expect(excedeLimite).toBe(true);
  });

  it("incluye el metodo de pago elegido", () => {
    const conSinpe: DatosPedido = { ...retiro, metodoPago: "sinpe" };
    const { texto } = construirMensaje([linea("a", 1)], conSinpe, 8500);
    expect(texto).toContain("Pago: Sinpe Móvil");
  });

  it("incluye el enlace de Maps cuando hay coordenadas", () => {
    const conUbicacion: DatosPedido = {
      ...express,
      lat: 10.0898297,
      lng: -84.4743896,
    };
    const { texto } = construirMensaje([linea("a", 1)], conUbicacion, 8500);
    expect(texto).toContain("maps.google.com/?q=10.089830,-84.474390");
  });

  it("no incluye enlace de ubicacion si no hay coordenadas", () => {
    const { texto } = construirMensaje([linea("a", 1)], express, 8500);
    expect(texto).not.toContain("maps.google.com");
  });

  it("no manda la ubicacion en un pedido de retiro", () => {
    // En retiro el cliente pasa recogiendo: su ubicacion no le sirve a nadie
    // y es un dato personal que no hay razon de enviar.
    const retiroConCoords: DatosPedido = {
      ...retiro,
      lat: 10.08,
      lng: -84.47,
    };
    const { texto } = construirMensaje([linea("a", 1)], retiroConCoords, 8500);
    expect(texto).not.toContain("maps.google.com");
  });

  it("no marca excedeLimite en un pedido normal", () => {
    const { excedeLimite } = construirMensaje(
      [linea("a", 2), linea("b", 1)],
      express,
      25500,
    );
    expect(excedeLimite).toBe(false);
  });
});
