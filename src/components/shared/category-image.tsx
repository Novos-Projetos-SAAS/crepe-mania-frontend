"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { Store } from "lucide-react";

interface CategoryImageProps {
  name: string;
  sizes?: string;
  fallback?: ReactNode;
}

const categoryImagePaths: Record<string, string> = {
  "crepes salgados": "crepes-salgados.webp",
  "crepes doces": "crepes-doces.webp",
  "pasteis salgados": "pasteis-salgados.webp",
  "pasteis doces": "pasteis-doces.webp",
  "pizzas salgadas": "pizzas-salgadas.webp",
  "pizzas doces": "pizzas-doces.webp",
  bebidas: "bebidas.webp",
  "sucos naturais": "sucos-naturais.webp",
  acai: "acai.webp",
  "caldo de cana": "caldo-de-cana.webp",
  "crepes no copo e barcas": "crepes-no-copo-e-barcas.webp",
  todos: "todos.webp",
};

export function resolveCategoryImage(name: string): string | null {
  const normalized = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").trim().replace(/\s+/g, " ");
  const filename = categoryImagePaths[normalized];
  return filename ? `/images/produtos/categorias/${filename}` : null;
}

export function CategoryImage({ name, sizes = "72px", fallback = <Store aria-hidden /> }: CategoryImageProps) {
  const src = resolveCategoryImage(name);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (src && failedSrc !== src) {
    return <Image src={src} alt="" width={1024} height={1024} sizes={sizes} onError={() => setFailedSrc(src)} />;
  }

  return <span className="category-placeholder-icon" aria-hidden="true">{fallback}</span>;
}
