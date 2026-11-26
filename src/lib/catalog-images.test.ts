import { describe, expect, it } from 'vitest';
import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import manifest from '../../docs/catalogo-imagens.json';

describe('imagens do catálogo inicial', () => {
  it('mapeia 75 produtos sem caminhos compartilhados entre categorias', () => {
    expect(manifest.produtos).toHaveLength(75);
    expect(new Set(manifest.produtos.map((item) => item.categoria)).size).toBe(11);
    expect(new Set(manifest.produtos.map((item) => `${item.categoria}/${item.nome}`)).size).toBe(75);
    expect(new Set(manifest.produtos.map((item) => item.arquivo)).size).toBe(75);
    for (const item of manifest.produtos) {
      expect(item.arquivo).toMatch(/^public\/images\/produtos\/[a-z-]+\/[a-z0-9-]+\.webp$/);
      expect(item.url).toBe(`https://crepe-mania.vercel.app/${item.arquivo.slice('public/'.length)}`);
    }
  });

  it('contém arquivos WebP válidos para todos os itens prontos', async () => {
    const ready = manifest.produtos.filter((item) => item.status === 'pronta');
    expect(ready).toHaveLength(68);
    for (const item of ready) {
      const bytes = await readFile(resolve(process.cwd(), item.arquivo));
      const metadata = await sharp(bytes).metadata();
      expect(metadata.format, item.arquivo).toBe('webp');
      expect(metadata.width, item.arquivo).toBe(1200);
      expect(metadata.height, item.arquivo).toBe(1200);
      expect(bytes.length, item.arquivo).toBeGreaterThan(20_000);
      if (!('sha256' in item)) throw new Error(`Hash ausente: ${item.arquivo}`);
      expect(createHash('sha256').update(bytes).digest('hex')).toBe(item.sha256);
    }
  });

  it('deixa sem arquivo os sete produtos aguardando confirmação', async () => {
    const pending = manifest.produtos.filter((item) => item.status === 'pendente');
    expect(pending).toHaveLength(7);
    for (const item of pending) await expect(access(resolve(process.cwd(), item.arquivo))).rejects.toThrow();
  });
});
