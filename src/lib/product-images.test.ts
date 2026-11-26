import { describe, expect, it } from "vitest";
import { resolveDemoProductImage, resolveProductImage } from "@/lib/product-images";
describe("imagens do cardapio", () => {
  it("usa imagem cadastrada", () => {
    expect(resolveProductImage({ nome: "Crepe", descricao: null, imagem_url: "https://cdn.example.invalid/crepe.webp" })).toBe("https://cdn.example.invalid/crepe.webp");
  });
  it("nao reutiliza imagens de outro cliente", () => {
    const product = { nome: "Crepe", descricao: null, imagem_url: null };
    expect(resolveDemoProductImage(product)).toBeNull();
    expect(resolveProductImage(product)).toBeNull();
  });
});
