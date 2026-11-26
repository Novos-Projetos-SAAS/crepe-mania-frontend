# Imagens do catálogo Crepe Mania

O catálogo inicial contém **75 produtos em 11 categorias**. Foram geradas **68 fotografias individuais** com a ferramenta integrada de geração de imagens, usando os cartazes enviados pelo cliente como referência de aparência e ingredientes. Cada PNG gerado foi convertido para **WebP 1200 × 1200 px, qualidade 83**, em `public/images/produtos/<categoria>/`. As fotos usam mesa de madeira rústica, luz quente e fundo escuro com roxo e amarelo discretos. Não contêm texto, preços, marcas ou pessoas.

O [manifesto](catalogo-imagens.json) registra categoria, nome, arquivo, URL pública, status, tamanho e SHA-256 de cada item. Os [prompts individuais](prompts-imagens.json) documentam as 68 imagens geradas. A [prévia em mosaico](mosaico-produtos.webp) permite revisar a coleção. Os [sete produtos sem imagem](produtos-sem-imagem.md) precisam de confirmação do cliente e não são associados pela seed 015.

A origem pública confirmada no projeto Vercel é `https://crepe-mania.vercel.app`. O frontend já usa `imagem_url` recebido da API nos cards, detalhes, personalização e administração. O fallback visual existente é mantido quando a URL está ausente ou falha.

## Publicação e associação

1. Publicar o commit do frontend e confirmar que as URLs WebP do manifesto retornam imagens válidas no domínio público.
2. Publicar o commit do backend e executar as seeds versionadas. A seed `015_imagens_produtos_crepe_mania.js` associa somente os 68 itens prontos por categoria e nome. Ela atualiza apenas `imagem_url` vazio e preserva URLs manuais.
3. Quando as sete imagens pendentes forem confirmadas, criar os arquivos e uma **nova** seed versionada para associá-las. Não alterar a seed 015 depois de executada.

`CATALOG_IMAGE_BASE_URL` pode substituir a origem do frontend no ambiente do backend; o padrão é `https://crepe-mania.vercel.app`. Não apontar para o Render.

Para incorporar futuros PNGs gerados, criar um JSON local de fontes com objetos `{ "categoria": "...", "nome": "...", "path": "caminho/da/imagem.png" }` e executar `node scripts/finalize-catalog-images.mjs caminho/do/json`. Esse arquivo de fontes é temporário e não deve ser versionado. O script converte os PNGs, valida os WebP, atualiza o manifesto e reconstrói o mosaico.
