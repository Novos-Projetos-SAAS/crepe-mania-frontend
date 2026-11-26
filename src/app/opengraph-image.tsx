import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Crepe Mania — crepes, pastéis, pizzas, açaí e sucos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagem OG provisória sem produtos/fotos do cliente anterior. */
export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", width: "100%", background: "#351140", color: "#ffffff", fontFamily: "sans-serif", padding: 76, textAlign: "center" }}>
      <div style={{ display: "flex", fontSize: 92, fontWeight: 900, color: "#ffe04e", letterSpacing: -4 }}>CREPE MANIA</div>
      <div style={{ display: "flex", fontSize: 40, fontWeight: 650, marginTop: 24 }}>Crepes • Pastéis • Pizzas • Açaí • Sucos</div>
      <div style={{ display: "flex", fontSize: 29, marginTop: 42, color: "#fef2c0" }}>Luiziânia — SP | Faça seu pedido online</div>
    </div>,
    size,
  );
}
