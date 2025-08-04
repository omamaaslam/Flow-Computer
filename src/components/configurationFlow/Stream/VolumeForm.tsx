// src/components/configurationFlow/Stream/VolumeForm.tsx

import React, { useState, useEffect } from "react";
import type { VolumeConfig, VolumeOperatingMode } from "../../../interfaces/Stream";

// Ismein koi badlav nahi
const operatingModes = [
  { value: "encoderOnly", label: "Encoder Only" },
  { value: "onePulse", label: "One pulse input" },
  { value: "twoPulse1-1", label: "Two pulse inputs (1:1)" },
  { value: "twoPulseX-Y", label: "Two pulse inputs (x:y)" },
];

interface VolumeFormProps {
  config: VolumeConfig; // Parent se initial config aayega
  onCommit: (updatedConfig: VolumeConfig) => void; // Ab onCommit updated data wapis lega
  onClose: () => void;
}

const VolumeForm: React.FC<VolumeFormProps> = ({ config, onCommit, onClose }) => {
  // --- YAHAN SE BADLAV SHURU ---

  // STEP 1: Form ki apni local state banayein, jo parent ke prop se shuru hogi.
  const [localConfig, setLocalConfig] = useState<VolumeConfig>(config);

  // Yeh सुनिश्चित karta hai ki agar parent se prop badle, to local state bhi update ho.
  useEffect(() => {
    setLocalConfig(config);
  }, [config]);


  // STEP 2: Input change ko handle karne ke liye naya function. Yeh local state ko update karega.
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    // Local state ko update karein
    setLocalConfig(prevConfig => {
      let updatedValue: any = value;

      if (name === "bidirectional") {
        updatedValue = value === "enable";
      } else if (type === "number") {
        updatedValue = value === "" ? null : Number(value);
      } else if (name === "operating_mode") {
          updatedValue = (value as VolumeOperatingMode) || null;
      }

      return {
        ...prevConfig,
        [name]: updatedValue,
      };
    });
  };

  // --- BADLAV KHATAM ---

  // Yeh logic ab 'localConfig' par chalega
  const showTwoMeters =
    localConfig.operating_mode === "twoPulse1-1" ||
    localConfig.operating_mode === "twoPulseX-Y";

  return (
    <div className="flex flex-col gap-3">
      <div className="border border-gray-200 rounded-md shadow-sm p-3 space-y-3">
        <div className="space-y-1">
          <label className="block font-medium text-xs text-gray-700">
            Operating Mode
          </label>
          <select
            name="operating_mode"
            // STEP 3: Sabhi inputs ab 'localConfig' se value lenge
            value={localConfig.operating_mode || ""}
            onChange={handleInputChange}
            className={`w-full border border-gray-200 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 ${
              !localConfig.operating_mode ? "text-gray-400" : "text-gray-800"
            }`}
          >
            <option value="" disabled>
              Please select mode
            </option>
            {operatingModes.map((mode) => (
              <option key={mode.value} value={mode.value}>
                {mode.label}
              </option>
            ))}
          </select>
        </div>
        {localConfig.operating_mode && (
          <div className="animate-fade-in-up">
            {showTwoMeters ? (
              <div className="grid grid-cols-2 gap-x-3">
                <div className="space-y-1">
                  <label className="block font-medium text-xs text-gray-700">
                    Select Gas Meter 1
                  </label>
                  <select
                    name="gas_meter_1"
                    value={localConfig.gas_meter_1}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-sm px-2 py-1 text-sm shadow-sm"
                  >
                    <option>Meter A</option>
                    <option>Meter B</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block font-medium text-xs text-gray-700">
                    Select Gas Meter 2
                  </label>
                  <select
                    name="gas_meter_2"
                    value={localConfig.gas_meter_2}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-sm px-2 py-1 text-sm shadow-sm"
                  >
                    <option>Meter A</option>
                    <option>Meter B</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <label className="block font-medium text-xs text-gray-700">
                  Select Gas Meter
                </label>
                <select
                  name="gas_meter_1"
                  value={localConfig.gas_meter_1}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-sm px-2 py-1 text-sm shadow-sm"
                >
                  <option>Meter A</option>
                  <option>Meter B</option>
                </select>
              </div>
            )}
          </div>
        )}
      </div>
      {localConfig.operating_mode && (
        <div className="border border-gray-200 rounded-md shadow-sm p-3 space-y-2.5 animate-fade-in-up">
          <h3 className="text-sm font-semibold text-gray-800">Volume</h3>
          <div className="grid grid-cols-2 gap-x-3 gap-y-3 text-xs">
            {/* Saare inputs ab 'localConfig' ka istemaal karenge */}
            <div className="space-y-1">
              <label className="block font-medium">Max Flow Rate</label>
              <input
                name="flow_rate"
                value={localConfig.flow_rate || ""}
                onChange={handleInputChange}
                type="number"
                placeholder="Please add Value"
                className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="block font-medium">Max Total Volume</label>
              <input
                name="max_total_volume"
                value={localConfig.max_total_volume || ""}
                onChange={handleInputChange}
                type="number"
                placeholder="Please add Value"
                className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="block font-medium">Min Operational Volume</label>
              <input
                name="min_operating_volume"
                value={localConfig.min_operating_volume || ""}
                onChange={handleInputChange}
                type="number"
                placeholder="Please add Value"
                className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="block font-medium">Bi-Directional</label>
              <select
                name="bidirectional"
                value={localConfig.bidirectional ? "enable" : "disable"}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm"
              >
                <option value="enable">Enable</option>
                <option value="disable">Disable</option>
              </select>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-end gap-2 pt-1">
        <button
          onClick={onClose}
          className="px-5 py-1.5 rounded-full font-semibold text-xs text-gray-700 bg-gray-200 hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          // STEP 4: Save par, local state ko parent component ko bhej dein
          onClick={() => onCommit(localConfig)}
          className="px-5 py-1.5 rounded-full font-semibold text-xs text-black bg-yellow-500 hover:bg-yellow-600"
        >
          Save
        </button>
      </div>
    </div>
  );
};

// Ab observer ki zaroorat nahi hai, lekin rakhne se koi nuksaan nahi. Aap ise hata bhi sakte hain.
export default VolumeForm;