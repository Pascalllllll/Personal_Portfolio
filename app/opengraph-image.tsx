import { ImageResponse } from "next/og";

export const alt = "Hosea Felix Sanjaya, Informatics Engineering student at ITS Surabaya";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Link-preview card in the site's dark theme: name with the gold accent full stop, role below.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: "#0a0a0a",
          color: "#f5f5f5",
        }}
      >
        <div style={{ display: "flex", fontSize: 92, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
          Hosea Felix Sanjaya<span style={{ color: "#d9c27a" }}>.</span>
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 38, color: "#a3a3a3" }}>
          Informatics Engineering student at ITS Surabaya
        </div>
      </div>
    ),
    size,
  );
}
