"use client";

import { getKpiColor } from "@/lib/mock-data";

interface KpiGaugeProps {
  value: number;
  label: string;
  size?: "sm" | "md" | "lg";
}

const colorValues = {
  danger: "#E74C3C",
  warning: "#F39C12",
  success: "#2D8C4E",
};

export function KpiGauge({ value, label, size = "md" }: KpiGaugeProps) {
  const color = getKpiColor(value);
  const activeColor = colorValues[color];

  const dimensions = {
    sm: { width: 100, height: 60, strokeWidth: 8, fontSize: 18, labelSize: 10, radius: 38 },
    md: { width: 140, height: 80, strokeWidth: 10, fontSize: 24, labelSize: 12, radius: 52 },
    lg: { width: 180, height: 100, strokeWidth: 12, fontSize: 32, labelSize: 14, radius: 66 },
  };

  const d = dimensions[size];
  const cx = d.width / 2;
  const cy = d.height - 8;

  // Semi-circle arc calculation
  const startAngle = Math.PI;
  const endAngle = 0;
  const valueAngle = startAngle - (value / 10) * Math.PI;

  // Background arc (full semi-circle)
  const bgStartX = cx + d.radius * Math.cos(startAngle);
  const bgStartY = cy - d.radius * Math.sin(startAngle);
  const bgEndX = cx + d.radius * Math.cos(endAngle);
  const bgEndY = cy - d.radius * Math.sin(endAngle);

  const bgPath = `M ${bgStartX} ${bgStartY} A ${d.radius} ${d.radius} 0 0 1 ${bgEndX} ${bgEndY}`;

  // Value arc
  const valEndX = cx + d.radius * Math.cos(valueAngle);
  const valEndY = cy - d.radius * Math.sin(valueAngle);
  const largeArc = value > 5 ? 1 : 0;

  const valPath = `M ${bgStartX} ${bgStartY} A ${d.radius} ${d.radius} 0 ${largeArc} 1 ${valEndX} ${valEndY}`;

  return (
    <div className="flex flex-col items-center">
      <svg width={d.width} height={d.height} viewBox={`0 0 ${d.width} ${d.height}`}>
        {/* Background track */}
        <path
          d={bgPath}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={d.strokeWidth}
          strokeLinecap="round"
        />
        {/* Colored gradient segments (subtle background) */}
        <defs>
          <linearGradient id={`gauge-gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E74C3C" stopOpacity="0.15" />
            <stop offset="40%" stopColor="#F39C12" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#2D8C4E" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <path
          d={bgPath}
          fill="none"
          stroke={`url(#gauge-gradient-${label})`}
          strokeWidth={d.strokeWidth}
          strokeLinecap="round"
        />
        {/* Active value arc */}
        {value > 0 && (
          <path
            d={valPath}
            fill="none"
            stroke={activeColor}
            strokeWidth={d.strokeWidth}
            strokeLinecap="round"
          />
        )}
        {/* Value text */}
        <text
          x={cx}
          y={cy - d.radius * 0.3}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={d.fontSize}
          fontWeight="700"
          fill={activeColor}
          fontFamily="Montserrat, sans-serif"
        >
          {value}
        </text>
        <text
          x={cx}
          y={cy - d.radius * 0.3 + d.fontSize * 0.7}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={d.labelSize - 2}
          fill="#9CA3AF"
          fontFamily="Inter, sans-serif"
        >
          / 10
        </text>
      </svg>
      <span
        className="text-xs font-medium text-gray-600 mt-1 text-center"
        style={{ fontSize: d.labelSize }}
      >
        {label}
      </span>
    </div>
  );
}
