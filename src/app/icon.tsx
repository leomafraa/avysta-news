import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          backgroundColor: "#020617",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 4,
            width: 8,
            height: 8,
            borderRadius: "9999px",
            backgroundColor: "#f97316",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 5,
            width: 18,
            height: 18,
            borderLeft: "3px solid #ffffff",
            borderRight: "3px solid #ffffff",
            borderBottom: "3px solid transparent",
            borderTop: "3px solid transparent",
            transform: "skewX(0deg)",
            borderRadius: 2,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
