// D:/flow-computer/src/components/configurationFlow/Stream/VolumeForm.tsx

import React from "react";
import { observer } from "mobx-react-lite"; // <-- Zaroori Import
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

// Default state for a new configuration
// Hum isko export karenge taaki StreamConfiguration.tsx use kar sake.
export const defaultVolumeConfig: VolumeConfiguration = {
  operating_mode: "encoderOnly",
  gas_meter_1: "Meter A", // Ek aam default value
  gas_meter_2: "",
  flow_rate: null, // number fields ke liye null use karein
  creep_time_seconds: null,
  max_total_volume: null,
  min_operating_volume: null,
  bidirectional: false,
};

interface VolumeFormProps {
  // config ab kabhi null nahi hoga.
  config: VolumeConfiguration;
  // onCommit ab koi parameter nahi lega.
  onCommit: () => void;
  onClose: () => void;
}

// Component ko observer se wrap karein
const VolumeForm: React.FC<VolumeFormProps> = observer(
  ({ config, onCommit, onClose }) => {
    // useState aur useEffect ki ab zaroorat nahi hai.

    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value, type } = e.target;

      let updatedValue: any = value;

      if (name === "bidirectional") {
        updatedValue = value === "true";
      } else if (
        type === "number" ||
        ["flow_rate", "max_total_volume", "min_operating_volume"].includes(name)
      ) {
        // Agar input khali hai to null, warna number
        updatedValue = value === "" ? null : Number(value);
      } else if (name === "operating_mode") {
        updatedValue = value as VolumeOperatingMode;
      }

      // --- YEH SABSE ZAROORI CHANGE HAI ---
      // Seedha MobX store ke object ko modify karein.
      (config as any)[name] = updatedValue;
    };

    const showTwoMeters =
      config.operating_mode === "twoPulse1-1" ||
      config.operating_mode === "twoPulseX-Y";

    return (
      <div className="flex flex-col gap-3">
        <div className="border border-gray-200 rounded-md shadow-sm p-3 space-y-3">
          <div className="space-y-1">
            <label className="block font-medium text-xs text-gray-700">
              Operating Mode
            </label>
            <select
              name="operating_mode"
              value={config.operating_mode || ""}
              onChange={handleInputChange}
              className={`w-full border border-gray-200 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 text-gray-800`}
            >
              {operatingModes.map((mode) => (
                <option key={mode.value} value={mode.value}>
                  {mode.label}
                </option>
              ))}
            </select>
          </div>
          {config.operating_mode && (
            <div className="animate-fade-in-up">
              {showTwoMeters ? (
                <div className="grid grid-cols-2 gap-x-3">
                  <div className="space-y-1">
                    <label className="block font-medium text-xs text-gray-700">
                      Select Gas Meter 1
                    </label>
                    <select
                      name="gas_meter_1"
                      value={config.gas_meter_1}
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
                      value={config.gas_meter_2}
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
                    value={config.gas_meter_1}
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
        {config.operating_mode && (
          <div className="border border-gray-200 rounded-md shadow-sm p-3 space-y-2.5 animate-fade-in-up">
            <h3 className="text-sm font-semibold text-gray-800">Volume</h3>
            <div className="grid grid-cols-2 gap-x-3 gap-y-3 text-xs">
              <div className="space-y-1">
                <label className="block font-medium">Max Flow Rate</label>
                <input
                  name="flow_rate"
                  value={config.flow_rate ?? ""}
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
                  value={config.max_total_volume ?? ""}
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
                  value={config.min_operating_volume ?? ""}
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
                  value={String(config.bidirectional)}
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
            onClick={onCommit} // Ab yeh seedha onCommit ko call karega
            className="px-5 py-1.5 rounded-full font-semibold text-xs text-black bg-yellow-500 hover:bg-yellow-600"
          >
            Save
          </button>
        </div>
      </div>
    );
  }
);

export default VolumeForm;
