import { describe, expect, it } from "vitest";
import { orderStatusOptions, requiresStatusConfirmation, validateProductSelection } from "./order-rules";
import type { Product } from "@/types/domain";
const crepe: Product = { id: "1", categoria_id: "1", nome: "Crepe de frango", tipo: "CREPE", preco_base: "20.00", ativo: true, disponivel_hoje: true, adicionais: [{ id: "3", nome: "Queijo", preco: "4.00", ativo: true, disponivel_hoje: true, max_quantidade_por_item: 2 }] };
describe("regras de montagem", () => {
  it("aceita crepe sem selecao adicional", () => { expect(validateProductSelection(crepe, {})).toEqual([]); });
  it("limita adicionais", () => { expect(validateProductSelection(crepe, { "3": 3 })).toContainEqual(expect.stringMatching(/máximo é 2/i)); });
  it("aceita bebidas", () => { expect(validateProductSelection({ ...crepe, tipo: "BEBIDA" }, {})).toEqual([]); });
});
describe("regras administrativas de status", () => {
  it("respeita retirada", () => { expect(orderStatusOptions("RETIRADA", "PENDENTE").filter(x => !x.disabled).map(x => x.status)).toEqual(["EM_PREPARO", "PRONTO_PARA_RETIRADA", "ENTREGUE"]); });
  it("pede confirmacao em saltos", () => { expect(requiresStatusConfirmation("ENTREGA", "PENDENTE", "ENTREGUE")).toBe(true); });
});
