import { ImageResponse } from "next/og";

export const alt = "Atlas Study Library";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#f8fafc",
          color: "#182230",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          padding: "88px",
          width: "100%",
        }}
      >
        <div style={{ color: "#2563eb", display: "flex", fontSize: 32, fontWeight: 700 }}>ATLAS</div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 700, letterSpacing: "-4px", marginTop: 22 }}>
          Your study library
        </div>
        <div style={{ color: "#64748b", display: "flex", fontSize: 34, marginTop: 26 }}>
          Notes, formulas, and PYQs — ready when you are.
        </div>
      </div>
    ),
    size,
  );
}
