import { describe, it, expect } from "vitest";
import { formatoColones } from "./formatoColones";

describe("formatoColones", () => {
  it("usa punto como separador de miles", () => {
    expect(formatoColones(17000)).toBe("₡17.000");
  });

  it("no muestra decimales", () => {
    expect(formatoColones(9500)).toBe("₡9.500");
  });

  it("maneja montos menores a mil", () => {
    expect(formatoColones(800)).toBe("₡800");
  });

  it("maneja cero", () => {
    expect(formatoColones(0)).toBe("₡0");
  });

  it("maneja montos de seis cifras", () => {
    expect(formatoColones(125000)).toBe("₡125.000");
  });

  it("redondea los decimales que lleguen por error", () => {
    expect(formatoColones(8500.4)).toBe("₡8.500");
  });
});
