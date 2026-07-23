import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#2563eb",
          color: "white",
          display: "flex",
          fontSize: 88,
          fontWeight: 700,
          height: "100%",
          justifyContent: "center",
          letterSpacing: "-7px",
          width: "100%",
        }}
      >
        A
      </div>
    ),
    size,
  );
}
