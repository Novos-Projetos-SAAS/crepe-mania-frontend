import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const manifestPath = resolve(projectRoot, 'docs/catalogo-imagens.json');
const sourceList = process.argv[2];
if (!sourceList) throw new Error('Uso: node scripts/finalize-catalog-images.mjs ARQUIVO_JSON_DAS_FONTES');
const sourcesPath = resolve(projectRoot, sourceList);
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const sources = JSON.parse(await readFile(sourcesPath, 'utf8'));
const seen = new Set();

for (const source of sources) {
  const key = `${source.categoria}\u0000${source.nome}`;
  if (seen.has(key)) throw new Error(`Fonte duplicada: ${key}`);
  seen.add(key);
  const entry = manifest.produtos.find((item) => item.categoria === source.categoria && item.nome === source.nome);
  if (!entry) throw new Error(`Produto sem manifesto: ${key}`);
  const target = resolve(projectRoot, entry.arquivo);
  if (relative(projectRoot, target).startsWith('..')) throw new Error(`Caminho fora do projeto: ${target}`);
  await mkdir(dirname(target), { recursive: true });
  try { await access(target); }
  catch {
    await sharp(source.path).rotate().resize(1200, 1200, { fit: 'fill' }).webp({ quality: 83, effort: 6 }).toFile(target);
  }
  const bytes = await readFile(target);
  const info = await sharp(bytes).metadata();
  if (info.format !== 'webp' || info.width !== 1200 || info.height !== 1200) throw new Error(`WebP inválido: ${entry.arquivo}`);
  entry.status = 'pronta';
  entry.bytes = bytes.length;
  entry.sha256 = createHash('sha256').update(bytes).digest('hex');
}

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
const ready = manifest.produtos.filter((item) => item.status === 'pronta');
const tile = 220;
const columns = 7;
const rows = Math.ceil(ready.length / columns);
const layers = [];
for (let i = 0; i < ready.length; i++) {
  const item = ready[i];
  const thumb = await sharp(resolve(projectRoot, item.arquivo)).resize(200, 200).toBuffer();
  const x = (i % columns) * tile + 10;
  const y = Math.floor(i / columns) * tile + 10;
  layers.push({ input: thumb, left: x, top: y });
}
const mosaicPath = resolve(projectRoot, 'docs/mosaico-produtos.webp');
await sharp({ create: { width: columns * tile, height: rows * tile, channels: 3, background: '#24132a' } })
  .composite(layers).webp({ quality: 85 }).toFile(mosaicPath);
process.stdout.write(JSON.stringify({ total: manifest.produtos.length, prontas: ready.length, pendentes: manifest.produtos.length - ready.length, mosaico: mosaicPath }) + '\n');
