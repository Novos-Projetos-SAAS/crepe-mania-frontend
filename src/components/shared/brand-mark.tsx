import Link from "next/link";
import { CookingPot } from "lucide-react";

export function BrandMark({ compact = false, href = "/" }: { compact?: boolean; href?: string }) {
  return <Link className="brand-mark" href={href}><span className="brand-mark__icon"><CookingPot aria-hidden /></span><span><strong>Crepe Mania</strong>{!compact && <small>Crepes, pastéis e pizzas</small>}</span></Link>;
}

