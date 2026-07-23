import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#2563eb",
          color: "white",
          display: "flex",
          fontSize: 245,
          fontWeight: 700,
          height: "100%",
          justifyContent: "center",
          letterSpacing: "-18px",
          width: "100%",
        }}
      >
        A
      </div>
    ),
    size,
  );
}
