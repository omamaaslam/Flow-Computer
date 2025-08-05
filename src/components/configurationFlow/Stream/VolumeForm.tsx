// src/components/configurationFlow/Stream/VolumeForm.tsx

import React, { useState, useEffect } from "react";
// UPDATED: Import from the new centralized types file
import type {
  VolumeConfiguration,
  VolumeOperatingMode,
} from "../../../types/streamConfig";

const operatingModes = [
  { value: "encoderOnly", label: "Encoder Only" },
  { value: "onePulse", label: "One pulse input" },
  { value: "twoPulse1-1", label: "Two pulse inputs (1:1)" },
  { value: "twoPulseX-Y", label: "Two pulse inputs (x:y)" },
  { value: "encoderWithOnePulseInput", label: "Encoder with One Pulse Input" },
  { value: "onePulseInputWithEncoder", label: "One Pulse Input with Encoder" },
  {
    value: "encoderWithTwoPulseInputs",
    label: "Encoder with Two Pulse Inputs",
  },
  {
    value: "twoPulseInputsWithEncoder",
    label: "Two Pulse Inputs with Encoder",
  },
];

interface VolumeFormProps {
  // Parent se MobX ka object aayega, jise hum local state me copy karenge
  config: VolumeConfiguration;
  onCommit: (updatedConfig: VolumeConfiguration) => void;
  onClose: () => void;
}

const VolumeForm: React.FC<VolumeFormProps> = ({
  config,
  onCommit,
  onClose,
}) => {
  // Form ki apni local state banayein, jo parent ke prop se shuru hogi.
  const [localConfig, setLocalConfig] = useState<VolumeConfiguration>(config);

  // Yeh सुनिश्चित karta hai ki agar parent se prop (jo MobX se aa raha hai) badle,
  // to local state bhi update ho, lekin sirf component ke pehle render par.
  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  // Input change ko handle karne ke liye naya function. Yeh local state ko update karega.
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setLocalConfig((prevConfig) => {
      let updatedValue: any = value;

      if (name === "bidirectional") {
        // value "true" ya "false" string hogi, use boolean me convert karein
        updatedValue = value === "true";
      } else if (type === "number") {
        // Agar input khali hai to null, warna number
        updatedValue = value === "" ? null : Number(value);
      } else if (name === "operating_mode") {
        // Type assertion
        updatedValue = (value as VolumeOperatingMode) || null;
      }

      return {
        ...prevConfig,
        [name]: updatedValue,
      };
    });
  };

  // Yeh logic ab local state par chalega
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
            value={localConfig.operating_mode || ""} // null ko handle karne ke liye || ""
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
              <label className="block font-medium">
                Min Operational Volume
              </label>
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
                // Boolean ko string me convert karein
                value={String(localConfig.bidirectional)}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm"
              >
                <option value="true">Enable</option>
                <option value="false">Disable</option>
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
          // Save par, local state ko parent component ko bhej dein
          onClick={() => onCommit(localConfig)}
          className="px-5 py-1.5 rounded-full font-semibold text-xs text-black bg-yellow-500 hover:bg-yellow-600"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default VolumeForm;
