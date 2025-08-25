import React from "react";
import { observer } from "mobx-react-lite";

// Define the properties the component will accept to become reusable
interface MeterGuageProps {
  currentValue: number;
  min: number;
  max: number;
  unit: string;
}

const MeterGuage = observer(
  ({ currentValue, min, max, unit }: MeterGuageProps) => {
    const valueRange = max - min;
    const angleRange = 360;

    const clampedValue = Math.max(min, Math.min(currentValue, max));
    const normalizedValue =
      valueRange > 0 ? (clampedValue - min) / valueRange : 0;
    const needleAngle = normalizedValue * angleRange - 90;

    const segmentColors = [
      // Blues (for low/starting values)
      "#007DAA",
      "#198EB9",
      "#1DA7DA",
      "#48BFE3",
      "#72DDF7",
      // Greens (for optimal/normal values)
      "#B2DA4F",
      "#9CC33A",
      "#4EAB3F",
      "#009245",
      "#00745D",
      // Yellows/Oranges (for caution/warning values)
      "#FFD166",
      "#FFC123",
      "#F5B000",
      "#DB9D00",
      "#F48C06",
      // Reds (for high/danger values)
      "#DC2F02",
      "#D00000",
      "#C70F0A",
      "#9D0208",
      "#6A040F",
    ];

    const gaugeLabels = Array.from({ length: 20 }, (_, index) => {
      const value = min + index * (valueRange / 20);
      return valueRange < 100 ? value.toFixed(1) : Math.round(value);
    });

    return (
      <div className="relative w-full">
        <svg
          viewBox="0 0 147 147"
          className="w-full h-auto max-w-xs mx-auto drop-shadow-lg"
          style={{ filter: "drop-shadow(0 10px 15px rgb(0 0 0 / 0.1))" }}
        >
          {/* Outer colored segments */}
          {segmentColors.map((color, index) => {
            const startAngle = index * 18 - 90;
            const endAngle = (index + 1) * 18 - 90;
            const startAngleRad = (startAngle * Math.PI) / 180;
            const endAngleRad = (endAngle * Math.PI) / 180;
            const innerRadius = 48;
            const outerRadius = 72;
            const centerX = 73.5;
            const centerY = 73.5;
            const x1 = centerX + innerRadius * Math.cos(startAngleRad);
            const y1 = centerY + innerRadius * Math.sin(startAngleRad);
            const x2 = centerX + outerRadius * Math.cos(startAngleRad);
            const y2 = centerY + outerRadius * Math.sin(startAngleRad);
            const x3 = centerX + outerRadius * Math.cos(endAngleRad);
            const y3 = centerY + outerRadius * Math.sin(endAngleRad);
            const x4 = centerX + innerRadius * Math.cos(endAngleRad);
            const y4 = centerY + innerRadius * Math.sin(endAngleRad);
            const pathData = `M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1}`;
            return (
              <path
                key={index}
                d={pathData}
                fill={color}
                stroke="#F7F9FA"
                strokeWidth="0.8"
              />
            );
          })}

          <circle
            cx="73.5"
            cy="73.5"
            r="32"
            fill="#F9FBFC"
            stroke="#E4E5E6"
            strokeWidth="1"
          />

          {Array.from({ length: 20 }).map((_, index) => {
            const angle = index * 18 - 90;
            const angleRad = (angle * Math.PI) / 180;
            return (
              <line
                key={index}
                x1={73.5 + 44 * Math.cos(angleRad)}
                y1={73.5 + 44 * Math.sin(angleRad)}
                x2={73.5 + 47 * Math.cos(angleRad)}
                y2={73.5 + 47 * Math.sin(angleRad)}
                stroke="#333234"
                strokeWidth="1"
              />
            );
          })}

          {gaugeLabels.map((label, index) => {
            const angle = index * 18 - 90;
            const angleRad = (angle * Math.PI) / 180;
            const radius = 38;
            const x = 73.5 + radius * Math.cos(angleRad);
            const y = 73.5 + radius * Math.sin(angleRad);
            return (
              <text
                key={index}
                x={x}
                y={y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#525252"
                fontSize="5"
                fontWeight="600"
                fontFamily="system-ui, sans-serif"
              >
                {label}
              </text>
            );
          })}

          <circle
            cx="73.5"
            cy="73.5"
            r="8"
            fill="#E4E5E6"
            stroke="#CFD1D2"
            strokeWidth="0.5"
          />

          {/* Needle now has a STATIC black color */}
          <line
            x1="73.5"
            y1="73.5"
            x2={73.5 + 28 * Math.cos((needleAngle * Math.PI) / 180)}
            y2={73.5 + 28 * Math.sin((needleAngle * Math.PI) / 180)}
            stroke="#333234"
            strokeWidth="3"
            strokeLinecap="round"
            className="transition-transform duration-500 ease-out"
            style={{ transformOrigin: "73.5px 73.5px" }}
          />

          <circle cx="73.5" cy="73.5" r="4" fill="#333234" />

          <text
            x="73.5"
            y="95"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#525252"
            fontSize="8"
            fontWeight="bold"
            fontFamily="system-ui, sans-serif"
          >
            {unit}
          </text>
        </svg>
      </div>
    );
  }
);

export default MeterGuage;
