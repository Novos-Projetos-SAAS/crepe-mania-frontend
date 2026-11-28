# Identidade visual — Crepe Mania (proposta v1)

**Escopo:** somente estilização. Não altera layout, responsividade, estrutura de componentes, URLs, carrinho, dashboard ou regras de negócio.

## Direção

Referências: peças publicitárias do cliente com **roxo vibrante + amarelo dourado**, contraste alto, ambiente gastronômico acolhedor e efeitos suaves. A interface preserva fundo claro para leitura e mantém os indicadores operacionais com suas cores semânticas.

| Papel | Cor |
|---|---|
| Roxo profundo (hero/sidebar) | `#270C34` |
| Roxo escuro (ênfase) | `#3A104E` |
| Roxo principal (ações) | `#66147C` |
| Roxo hover | `#4D0D61` |
| Amarelo dourado (destaques) | `#FFCF24` |
| Amarelo suave (seleções) | `#FFF5CA` |
| Fundo público | `#FDFAFF` |
| Texto principal | `#291630` |
| Bordas | `#E8DCED` |

## Aplicação

A folha `src/app/styles/crepe-mania-theme.css` é importada no fim de `src/app/globals.css`, **após** os CSS de cardápio e administração. Ela contém apenas tokens e regras de aparência (cores, superfícies, sombras, bordas, estados hover/foco). O objetivo é permitir revisão e reversão isoladas.

- **Cardápio:** hero em roxo profundo e sombra escura, acentos dourados, categorias ativas com destaque, fotos e cards com sombras roxas mais profundas, CTA dourado e carrinho móvel roxo.
- **Produto e compra:** preço roxo, escolhas selecionadas com fundo lilás, resumo de compra roxo escuro.
- **Dashboard:** sidebar roxa, item ativo violeta intenso com detalhe dourado, botões roxos, cards com borda lilás, tabelas roxas e seleção dourada.
- **Acessibilidade:** foco visível; estados de sucesso, aviso e erro continuam específicos; suporte a `prefers-reduced-motion` e `prefers-contrast`.

## O que esta branch não faz

Não redesenha ícones ou imagens, não altera logotipo, não muda posições ou dimensões, não modifica markup TSX/JSX, não altera fontes nem implementa funcionalidades adicionais. A repaginação estrutural poderá ocorrer em etapa posterior.

## Revisão sugerida

1. Conferir cardápio em mobile e desktop: hero, busca, categorias, cards, carrinho, produto e checkout.
2. Conferir dashboard: login, home, pedidos, produtos, categorias, loja, relatórios e tabelas.
3. Validar contraste e feedback visual dos estados de ação, erro, aviso e sucesso.
4. Fazer merge somente após aprovação; a branch `main` permanece inalterada.
