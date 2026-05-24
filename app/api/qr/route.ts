import QRCode from "qrcode";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const text = (url.searchParams.get("text") || "").trim();

  if (!text || text.length > 1200) {
    return new Response("Invalid QR text", { status: 400 });
  }

  const png = await QRCode.toBuffer(text, {
    margin: 1,
    width: 260,
    color: {
      dark: "#111827",
      light: "#FFFFFF"
    }
  });

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
}
