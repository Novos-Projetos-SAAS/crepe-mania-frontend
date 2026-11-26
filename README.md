# Crepe Mania — Frontend

Clone independente do frontend **Lanchonete Shirley** adaptado para a **Crepe Mania**, mantendo a interface e a arquitetura existentes nesta fase. Stack: Next.js 16, React, TypeScript, Axios/fetch conforme serviços, TanStack Query, Zustand, Socket.IO, PWA. Repaginação de visual fica para etapa posterior.

## Rodar localmente

```bash
npm ci
cp .env.example .env.local
# Ajuste NEXT_PUBLIC_API_URL e NEXT_PUBLIC_SITE_URL
npm run dev
```

No PowerShell: `Copy-Item .env.example .env.local`. O frontend local sobe em `http://localhost:3000` e a API esperada em `http://localhost:3333/api/v1`.

## Fluxos preservados

Cardápio, filtro por categorias, detalhes de produto, adicionais, carrinho, checkout sem cadastro, acompanhamento de pedidos, painel com pedidos, criação manual, equipe, categorias, produtos, pagamentos, operação da loja, relatórios, convites, notificações e fila de impressão.

A configuração de **pães foi retirada integralmente da interface e do contrato de carrinho**. Os tipos de produto aceitos são `CREPE`, `PASTEL`, `PIZZA`, `BEBIDA`, `SUCO`, `ACAI` e `OUTRO`. Produtos e adicionais são cadastrados/ativados no painel; não há conteúdo fictício público.

## Segurança e identidade do novo cliente

Não reutilize `NEXT_PUBLIC_API_URL` do cliente Shirley. Configure um backend e banco separados. A marca e metadata textual usam Crepe Mania; removemos as fotos específicas de lanches do cliente anterior. Os ícones PWA foram trocados por um marcador neutro `CM`; a identidade visual final será definida na repaginação.

## Comandos

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run start
```

Deploy sugerido: Vercel via importação do novo repositório GitHub; configure `NEXT_PUBLIC_API_URL` e `NEXT_PUBLIC_SITE_URL` nas variáveis do projeto. A URL do front precisa estar em `ALLOWED_ORIGINS` do backend. Não libere a loja antes de validar uma compra real fim a fim.

## Observações

Os testes de navegador que estavam ligados ao catálogo demonstrativo da Shirley (inclusive pães) foram removidos por não se aplicarem ao novo cliente. A suite completa de testes de integração e build **ainda precisa ser executada e homologada** com dependências e banco de testes.
