"use client";

import type { ReactNode } from "react";
import { Store } from "lucide-react";

interface CategoryImageProps {
  name: string;
  sizes?: string;
  fallback?: ReactNode;
}

/** Icone generico ate a Crepe Mania enviar suas fotos de categoria. */
export function CategoryImage({ name, fallback = <Store aria-hidden /> }: CategoryImageProps) {
  return <span role="img" aria-label={name} className="category-placeholder-icon">{fallback}</span>;
}
