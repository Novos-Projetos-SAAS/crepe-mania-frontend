import type { Product } from "@/types/domain";
type ProductImageSource = Pick<Product, "nome" | "descricao" | "imagem_url">;
/** Compatibilidade: nenhum fallback de imagens da Shirley e aplicado. */
export function resolveDemoProductImage(product: ProductImageSource) { void product; return null; }
export function resolveProductImage(product: ProductImageSource) { return product.imagem_url?.trim() || null; }
