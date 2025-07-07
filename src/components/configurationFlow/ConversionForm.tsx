import { useState } from "react";
import { ArrowUpDown } from "lucide-react";

// --- Data Structure for Dynamic Content ---
const conversionMethodsData = {
  GERG88_1: {
    name: "GERG88_1",
    rows: [
      { name: "Ho_n", unit: "MJ/m³", liveValue: "12.345" },
      { name: "Rhol", unit: "kg/m³", liveValue: "0.891" },
      { name: "Rhon", unit: "kg/m³", liveValue: "0.887" },
      { name: "Carbon Dioxide", unit: "mol%", liveValue: "2.15" },
      { name: "Nitrogen", unit: "mol%", liveValue: "0.55" },
    ],
  },
  ISO6976_2: {
    name: "ISO6976_2",
    rows: [
      { name: "Gross Calorific Value", unit: "BTU/scf", liveValue: "1010.5" },
      { name: "Relative Density", unit: "ratio", liveValue: "0.554" },
      { name: "Methane Number", unit: "index", liveValue: "95.1" },
    ],
  },
  Custom_Method_3: {
    name: "Custom_Method_3",
    rows: [
      { name: "Viscosity", unit: "cP", liveValue: "0.011" },
      { name: "Enthalpy", unit: "kJ/kg", liveValue: "2050.3" },
    ],
  },
} as const;

type MethodKey = keyof typeof conversionMethodsData;

// ------------------------------------------

interface ConversionFormProps {
  onClose: () => void;
}

const ConversionForm = ({ onClose }: ConversionFormProps) => {
  const [selectedMethod, setSelectedMethod] = useState<MethodKey>("GERG88_1");
  const currentRows = conversionMethodsData[selectedMethod]?.rows || [];

  const UnitDisplay = ({ unit }: { unit: string }) => {
    const parts = unit.split("³");
    if (parts.length > 1) {
      return (
        <span>
          {parts[0]}
          <sup>3</sup>
          {parts[1]}
        </span>
      );
    }
    return <span>{unit}</span>;
  };

  return (
    // --- Overall gap between sections reduced ---
    <div className="flex flex-col gap-4">
      {/* Method Selector */}
      <div className="space-y-1">
        <label className="block font-medium text-xs text-gray-700">
          Method
        </label>
        <select
          value={selectedMethod}
          onChange={(e) => setSelectedMethod(e.target.value as MethodKey)}
          // --- Input height and font size reduced ---
          className="w-full max-w-xs border border-gray-200 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
        >
          {(Object.keys(conversionMethodsData) as MethodKey[]).map((key) => (
            <option key={key} value={key}>
              {conversionMethodsData[key].name}
            </option>
          ))}
        </select>
      </div>

      {/* Conversion Table Container */}
      <div className="border border-gray-200 rounded-md overflow-hidden shadow-sm">
        {/* Table Header */}
        <div className="grid grid-cols-[2.5fr_1.5fr_1fr_2fr_2fr] items-center border-b bg-gray-50 font-semibold text-xs text-gray-700">
          <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900 px-3 py-2">
            Name <ArrowUpDown size={12} />
          </div>
          <div className="px-3 py-2">Live Value</div>
          <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900 px-3 py-2">
            Unit <ArrowUpDown size={12} />
          </div>
          <div className="px-3 py-2">Link Device</div>
          <div className="px-3 py-2">Keyboard Input</div>
        </div>

        {/* Table Body */}
        {/* Removed max-height and overflow to prevent internal scroll */}
        <div>
          {currentRows.map((row, index) => (
            <div
              key={index}
              className="grid grid-cols-[2.5fr_1.5fr_1fr_2fr_2fr] items-center text-xs border-b last:border-b-0"
            >
              {/* Name */}
              <div className="font-medium text-gray-800 px-3 py-1.5">
                {row.name}
              </div>

              {/* Live Value */}
              <div className="text-gray-600 px-3 py-1.5">{row.liveValue}</div>

              {/* Unit */}
              <div className="text-gray-700 px-3 py-1.5">
                <UnitDisplay unit={row.unit} />
              </div>

              {/* Link Device */}
              <div className="px-2 py-1.5">
                <select className="w-full border border-gray-300 rounded-sm px-2 py-1 text-xs shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500">
                  <option>Device list</option>
                  <option>Device A</option>
                </select>
              </div>

              {/* Keyboard Input */}
              <div className="px-2 py-1.5">
                <input
                  type="text"
                  placeholder="Enter value"
                  className="w-full border border-gray-300 rounded-sm px-2 py-1 text-xs shadow-sm focus:ring-1 focus:ring-yellow-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Buttons (Compact) */}
      <div className="flex justify-end gap-2 pt-2">
        <button
          onClick={onClose}
          className="px-5 py-1.5 rounded-full font-semibold text-xs text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button className="px-5 py-1.5 rounded-full font-semibold text-xs text-black bg-yellow-500 hover:bg-yellow-600 transition-colors">
          Save
        </button>
      </div>
    </div>
  );
};

export default ConversionForm;
