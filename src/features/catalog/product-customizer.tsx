"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Check, ShoppingBag } from "lucide-react";
import { ProductImage } from "@/components/shared/product-image";
import { Button, Card, CurrencyText, ErrorState, QuantityStepper, Skeleton, Textarea } from "@/components/ui";
import { moneyToCents, centsToMoney } from "@/lib/money";
import { sanitizeMenuReturnPath } from "@/lib/menu-context";
import { resolveProductImage } from "@/lib/product-images";
import { queryKeys } from "@/lib/query-keys";
import { validateProductSelection } from "@/lib/order-rules";
import { publicService } from "@/services/public-service";
import { useCartStore } from "@/store/cart-store";
import { useToast } from "@/components/ui/toast";

export function ProductCustomizer() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const addItem = useCartStore((state) => state.addItem);
  const product = useQuery({ queryKey: queryKeys.product(params.id), queryFn: () => publicService.product(params.id) });
  const [additionals, setAdditionals] = useState<Record<string, number>>({});
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [returnPath, setReturnPath] = useState("/");
  const [isAdding, setIsAdding] = useState(false);
  const addingRef = useRef(false);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // O retorno é browser-only e é saneado antes de entrar no estado de navegação.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReturnPath(sanitizeMenuReturnPath(new URLSearchParams(window.location.search).get("retorno")));
  }, []);

  const unitCents = useMemo(() => {
    if (!product.data) return 0;
    const additions = (product.data.adicionais || []).reduce((sum, item) => sum + moneyToCents(item.preco) * (additionals[item.id] || 0), 0);
    return moneyToCents(product.data.preco_base) + additions;
  }, [additionals, product.data]);

  if (product.isLoading) return <main className="container section" id="conteudo-principal"><Skeleton className="skeleton--title" /><div className="product-detail"><Skeleton className="skeleton--hero" /><Skeleton className="skeleton--hero" /></div></main>;
  if (product.isError || !product.data) return <main className="container centered-page" id="conteudo-principal"><ErrorState title="Produto indisponível" description="Esse item pode ter sido pausado ou o servidor não respondeu." action={<Button asChild><Link href="/"><ArrowLeft aria-hidden /> Voltar ao cardápio</Link></Button>} /></main>;
  const data = product.data;

  function addToCart() {
    if (addingRef.current) return;
    const validation = validateProductSelection(data, additionals);
    if (validation.length) {
      setErrors(validation);
      window.requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }
    addingRef.current = true;
    setIsAdding(true);
    addItem({
      produtoId: data.id,
      nome: data.nome,
      tipo: data.tipo,
      precoBase: data.preco_base || "0.00",
      quantidade: quantity,
      adicionais: (data.adicionais || []).filter((item) => (additionals[item.id] || 0) > 0).map((item) => ({ id: item.id, nome: item.nome, preco: item.preco, quantidade: additionals[item.id] })),
      observacoes: notes.trim() || undefined,
    });
    toast({ tone: "success", title: "Item adicionado ao carrinho", description: `${quantity}× ${data.nome}` });
    router.replace(returnPath);
  }

  return <main className="container section product-page" id="conteudo-principal"><Link className="back-link" href={returnPath}><ArrowLeft aria-hidden /> Voltar ao cardápio</Link><div className="product-detail"><div className="product-detail__visual"><ProductImage product={data} sizes="(min-width: 48rem) 50vw, 100vw" priority largePlaceholder fill={false} />{resolveProductImage(data) && <div className="product-detail__label"> IMAGENS MERAMENTE ILUSTRATIVAS</div>  }</div><div className="product-detail__content"><p className="eyebrow">Personalize seu pedido</p><h1>{data.nome}</h1>{data.descricao && <p className="product-description">{data.descricao}</p>}<div className="base-price"><span>A partir de</span><CurrencyText value={data.preco_base} /></div>
    {!!data.adicionais?.length && <fieldset className="option-group"><legend>1. Quer caprichar?</legend>{data.adicionais.map((item) => { const value = additionals[item.id] || 0; const max = item.max_quantidade_por_item || 20; return <div className="additional-row" key={item.id}><div><strong>{item.nome}</strong>{item.descricao && <small>{item.descricao}</small>}<CurrencyText value={item.preco} /></div><QuantityStepper label={`Quantidade de ${item.nome}`} min={0} max={max} value={value} onChange={(next) => setAdditionals((current) => ({ ...current, [item.id]: next }))} /></div>; })}</fieldset>}
    <div className="option-group"><label className="field-label" htmlFor="item-notes">Observações</label><Textarea id="item-notes" maxLength={300} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Ex.: sem cebola, molho à parte" /><small className="field__hint">Não use este campo para pedir itens que não aparecem nas opções.</small></div>
    {errors.length > 0 && <div className="form-error-summary" role="alert" tabIndex={-1} ref={errorSummaryRef}><strong>Revise para continuar:</strong><ul>{errors.map((error) => <li key={error}>{error}</li>)}</ul></div>}
    <Card className="add-bar"><QuantityStepper value={quantity} onChange={setQuantity} /><div><small>Total estimado</small><CurrencyText value={centsToMoney(unitCents * quantity)} /></div><Button size="lg" onClick={addToCart} loading={isAdding} disabled={isAdding}><ShoppingBag aria-hidden /> Adicionar ao carrinho <Check aria-hidden /></Button></Card>
  </div></div></main>;
}

