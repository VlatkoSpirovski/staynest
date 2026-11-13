import { ImageResponse } from "next/og";

export const alt = "StayNest: a QR guest guide for holiday rental hosts";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #FAF7F2 0%, #F1EBE0 60%, #E3EEEC 100%)",
          color: "#172033"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "#172033", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontSize: 30, fontWeight: 700 }}>S</div>
          <div style={{ fontSize: 34, fontWeight: 700 }}>StayNest</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05, letterSpacing: -1.5, maxWidth: 900 }}>
            The guest guide your guests actually open
          </div>
          <div style={{ fontSize: 30, color: "#3F5652", maxWidth: 900, lineHeight: 1.35 }}>
            One QR code for Wi-Fi, check-in, house rules, local tips, review links and an AI guest chat.
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 24, color: "#172033" }}>
          <div style={{ padding: "10px 20px", borderRadius: 999, background: "#FFFFFF", border: "1px solid #D8D1C4" }}>7 days free, no card</div>
          <div style={{ padding: "10px 20px", borderRadius: 999, background: "#FFFFFF", border: "1px solid #D8D1C4" }}>EUR 20 per year</div>
          <div style={{ padding: "10px 20px", borderRadius: 999, background: "#FFFFFF", border: "1px solid #D8D1C4" }}>Airbnb · Booking.com · villas</div>
        </div>
      </div>
    ),
    size
  );
}
