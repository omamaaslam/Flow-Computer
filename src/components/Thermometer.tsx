import React from "react";
import { observer } from "mobx-react-lite";

interface ThermometerProps {
  currentValue: number;
  min: number;
  max: number;
}

const Thermometer = observer(({ currentValue, min, max }: ThermometerProps) => {
  const tempRange = max - min;
  const clampedValue = Math.max(min, Math.min(max, currentValue));
  const normalizedTemp = tempRange > 0 ? (clampedValue - min) / tempRange : 0;
  const maxMercuryHeight = 82;
  const mercuryHeight = normalizedTemp * maxMercuryHeight;
  const mercuryY = 102.082 - mercuryHeight;

  const getMercuryColor = (temperature: number) => {
    if (temperature <= 26) return { gradient: "mercuryBlueGradient" };
    if (temperature <= 42) return { gradient: "mercuryYellowGradient" };
    return { gradient: "mercuryRedGradient" };
  };

  const colorConfig = getMercuryColor(currentValue);

  const generateScaleMarks = () => {
    const marks = [];
    const numLabels = 6; // Example: -20, 4, 28, 52, 76, 100
    const step = tempRange > 0 ? tempRange / (numLabels - 1) : 0;

    for (let i = 0; i < numLabels; i++) {
      const temp = min + i * step;
      const position = ((temp - min) / tempRange) * maxMercuryHeight;
      const y = 102.082 - position;

      marks.push(
        <g key={temp}>
          <line x1="35.7" y1={y} x2="46.2" y2={y} stroke="#949494" strokeWidth="0.8"/>
          <text x="48" y={y + 2} fill="#555" fontSize="6" textAnchor="start" fontFamily="Arial, sans-serif">
            {Math.round(temp)}°
          </text>
        </g>
      );
    }
    return marks;
  };

  const getBackgroundClass = (temperature: number) => {
    if (temperature > 42) return "from-red-100/50 to-red-50/50";
    if (temperature > 26) return "from-yellow-100/50 to-yellow-50/50";
    return "from-blue-100/50 to-blue-50/50";
  };

  return (
    <div className={`flex flex-col items-center p-2 bg-gradient-to-b ${getBackgroundClass(currentValue)} rounded-xl shadow-inner w-full`}>
      <div className="relative">
        <svg viewBox="0 0 80 141" className="w-24 h-auto" xmlns="http://www.w3.org/2000/svg">
          {/* Color Gradients Definitions */}
          <defs>
            <linearGradient id="mercuryBlueGradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#2196F3"/><stop offset="100%" stopColor="#1565C0"/></linearGradient>
            <linearGradient id="mercuryYellowGradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#FFC107"/><stop offset="100%" stopColor="#FF8F00"/></linearGradient>
            <linearGradient id="mercuryRedGradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#FF3D00"/><stop offset="100%" stopColor="#D32F2F"/></linearGradient>
            <filter id="glow"><feGaussianBlur stdDeviation="1.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>

          {/* --- FIX: REORDERED SVG ELEMENTS --- */}

          {/* 1. Draw Mercury Fill FIRST (Bottom Layer) */}
          <g>
            <path
              d={`M27.76 102.08V${mercuryY}C27.76 22.09 25.53 19.86 22.78 19.86C20.03 19.86 17.80 22.09 17.80 ${mercuryY}V102.08C11.82 104.55 6.36 110.45 6.36 117.35C6.36 126.45 13.71 133.84 22.78 133.84C31.85 133.84 39.21 126.45 39.21 117.35C39.21 110.45 33.75 104.55 27.76 102.08Z`}
              fill={`url(#${colorConfig.gradient})`}
              filter="url(#glow)"
              className="transition-all duration-500 ease-in-out"
            />
            <circle
              cx="22.78"
              cy="117.35"
              r="16"
              fill={`url(#${colorConfig.gradient})`}
              filter="url(#glow)"
              className="transition-all duration-500 ease-in-out"
            />
          </g>

          {/* 2. Draw Thermometer Outline SECOND (Middle Layer) */}
          <g>
            <path
              d="M22.78 6.55C18.17 6.55 14.42 10.31 14.42 14.94V98.70L13.76 99.03C10.39 100.70 7.55 103.26 5.53 106.45C3.46 109.73 2.36 113.52 2.36 117.42C2.36 128.72 11.52 137.91 22.78 137.91C34.04 137.91 43.20 128.72 43.20 117.42C43.20 113.52 42.10 109.73 40.04 106.45C38.02 103.26 35.17 100.70 31.80 99.03L31.15 98.70V14.94C31.15 10.31 27.39 6.55 22.78 6.55ZM22.78 140.29C10.22 140.29 0 130.02 0 117.42C0 113.07 1.22 108.83 3.53 105.18C5.65 101.83 8.59 99.10 12.06 97.24V14.94C12.06 9.00 16.87 4.17 22.78 4.17C28.70 4.17 33.51 9.00 33.51 14.94V97.24C36.98 99.10 39.91 101.83 42.03 105.18C44.34 108.83 45.56 113.07 45.56 117.42C45.56 130.02 35.34 140.29 22.78 140.29Z"
              fill="none"
              stroke="#6b7280" // a slightly darker gray
              strokeWidth="2.5"
            />
          </g>

          {/* 3. Draw Scale Marks LAST (Top Layer) */}
          {generateScaleMarks()}

        </svg>
      </div>
    </div>
  );
});

export default Thermometer;