import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
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
            top: 26,
            width: 36,
            height: 36,
            borderRadius: "9999px",
            backgroundColor: "#f97316",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 35,
            width: 110,
            height: 110,
            borderLeft: "14px solid #ffffff",
            borderRight: "14px solid #ffffff",
            borderBottom: "14px solid transparent",
            borderTop: "14px solid transparent",
            borderRadius: 8,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
