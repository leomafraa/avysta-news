import type { INCCDataPoint } from "@/types/prices";

interface PriceSparklineProps {
  data: INCCDataPoint[];
  width?: number;
  height?: number;
  color?: string;
}

export function PriceSparkline({
  data,
  width = 120,
  height = 36,
  color = "#f97316",
}: PriceSparklineProps) {
  if (!data || data.length < 2) return null;

  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const pad = 2;
  const w = width - pad * 2;
  const h = height - pad * 2;

  const points = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * w;
    const y = pad + h - ((v - min) / range) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const polyline = points.join(" ");
  const lastPoint = points[points.length - 1].split(",");

  // Area fill path (close at bottom)
  const firstX = points[0].split(",")[0];
  const lastX = lastPoint[0];
  const bottomY = pad + h;
  const areaPath = `M ${firstX},${bottomY} L ${polyline.replace(/(\S+,\S+)/g, "L $1").slice(1)} L ${lastX},${bottomY} Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
      aria-hidden
    >
      {/* Gradient area fill */}
      <defs>
        <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={areaPath}
        fill={`url(#grad-${color.replace("#", "")})`}
      />
      {/* Line */}
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Last point dot */}
      <circle
        cx={lastPoint[0]}
        cy={lastPoint[1]}
        r="2.5"
        fill={color}
      />
    </svg>
  );
}
