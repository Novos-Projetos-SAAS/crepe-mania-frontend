import { beforeEach, describe, expect, it, vi } from "vitest";
import { buildMenuReturnPath, buildProductHref, consumeMenuPosition, menuContextFromSearch, sanitizeMenuReturnPath, saveMenuPosition } from "./menu-context";

describe("menu context", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.useRealTimers();
  });

  it("serializes only search and category", () => {
    expect(buildMenuReturnPath({ search: "  Crepe de Frango  ", category: "crepes-salgados" })).toBe("/?busca=Crepe de Frango&categoria=crepes-salgados");
    expect(menuContextFromSearch("?busca=Crepe de Frango&categoria=crepes-salgados&token=secret")).toEqual({ search: "Crepe de Frango", category: "crepes-salgados" });
  });

  it("rejects external, protocol-relative and unrelated return targets", () => {
    expect(sanitizeMenuReturnPath("https://example.com/roubo")).toBe("/");
    expect(sanitizeMenuReturnPath("//example.com/roubo")).toBe("/");
    expect(sanitizeMenuReturnPath("/admin?busca=x")).toBe("/");
    expect(sanitizeMenuReturnPath("/?busca=x&categoria=1&token=segredo")).toBe("/?busca=x&categoria=1");
  });

  it("builds a product link with a safe fallback", () => {
    expect(buildProductHref("10", "/?categoria=1")).toBe("/produto/10?retorno=%2F%3Fcategoria%3D1");
    expect(buildProductHref("10", "https://example.com")).toBe("/produto/10?retorno=%2F");
  });

  it("restores a saved position once and only for the same context", () => {
    saveMenuPosition("/?busca=x&categoria=1", 482.4);
    expect(consumeMenuPosition("/?busca=x&categoria=1")).toBe(482);
    expect(consumeMenuPosition("/?busca=x&categoria=1")).toBeNull();
    saveMenuPosition("/?categoria=1", 100);
    expect(consumeMenuPosition("/?categoria=2")).toBeNull();
  });
});
