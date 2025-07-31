// src/components/configurationFlow/PulseFlowRateDeviceForm.tsx
import React, { useState, useEffect } from "react";
import BridgeComponent from "./BridgeComponent";
import type { DeviceConfig } from "../../types/device";

interface InputProps extends React.ComponentPropsWithoutRef<"input"> {}
const Input = (props: InputProps) => (
  <input
    {...props}
    className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm placeholder:text-gray-400 shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
  />
);

interface PulseFlowRateDeviceFormProps {
  onBack: () => void;
  onSave: (config: DeviceConfig) => void;
  interfaceName: string;
  initialData?: DeviceConfig | null;
}

const PulseFlowRateDeviceForm: React.FC<PulseFlowRateDeviceFormProps> = ({
  onBack,
  onSave,
  interfaceName,
  initialData,
}) => {
  const [activeTab, setActiveTab] = useState<"general" | "parameters">(
    "general"
  );
  const lfOptions = [2, 5];
  const hfOptions = [5, 20, 50, 100, 250, 500, 1000, 1500, 2000, 3000, 4000];
  const [formState, setFormState] = useState({
    manufacturer: "",
    serial_number: "",
    model: "",
    tag_name: "",
    g_size: "",
    frequency_type: "LF",
    frequency_hz: lfOptions[0].toString(),
    pulse_duration_ms: "",
    pulse_pause_ms: "",
    scaling_factor: "",
    offset: "",
    flowrate_min: "",
    flowrate_max: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormState({
        manufacturer: initialData.manufacturer || "",
        serial_number: initialData.serial_number || "",
        model: initialData.model || "",
        tag_name: initialData.tag_name || "",
        g_size: String(initialData.g_size || ""),
        frequency_type: initialData.frequency_type || "LF",
        frequency_hz: String(
          initialData.frequency_hz ||
            (initialData.frequency_type === "HF" ? hfOptions[0] : lfOptions[0])
        ),
        pulse_duration_ms: String(initialData.pulse_duration_ms || ""),
        pulse_pause_ms: String(initialData.pulse_pause_ms || ""),
        scaling_factor: String(initialData.scaling_factor || ""),
        offset: String(initialData.offset || ""),
        flowrate_min: String(initialData.flowrate_min || ""),
        flowrate_max: String(initialData.flowrate_max || ""),
      });
    }
  }, [initialData]);

  const handleStateChange = (field: string, value: string) => {
    setFormState((prev) => {
      const newState = { ...prev, [field]: value };
      if (field === "frequency_type") {
        newState.frequency_hz =
          value === "LF" ? lfOptions[0].toString() : hfOptions[0].toString();
      }
      return newState;
    });
  };

  const handleSubmit = () => {
    const finalConfig: DeviceConfig = {
      manufacturer: formState.manufacturer,
      model: formState.model,
      serial_number: formState.serial_number,
      tag_name: formState.tag_name,
      g_size: formState.g_size,
      frequency_type: formState.frequency_type,
      frequency_hz: parseInt(formState.frequency_hz, 10),
      pulse_duration_ms: parseInt(formState.pulse_duration_ms, 10),
      pulse_pause_ms: parseInt(formState.pulse_pause_ms, 10),
      scaling_factor: parseFloat(formState.scaling_factor),
      offset: parseFloat(formState.offset),
      flowrate_min: parseFloat(formState.flowrate_min),
      flowrate_max: parseFloat(formState.flowrate_max),
    };
    onSave(finalConfig);
  };

  const frequencyOptions =
    formState.frequency_type === "LF" ? lfOptions : hfOptions;

  return (
    <div className="flex flex-col space-y-6">
      <BridgeComponent
        interfaceName={interfaceName}
        formState={formState}
        errors={{}}
        handleStateChange={handleStateChange}
      />
      <div className="flex bg-gray-200 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab("general")}
          className={`w-1/2 py-2.5 text-sm font-semibold rounded-md transition-all duration-300 ${
            activeTab === "general"
              ? "bg-yellow-400 text-black shadow-md"
              : "text-gray-600 hover:bg-gray-300"
          }`}
        >
          General
        </button>
        <button
          onClick={() => setActiveTab("parameters")}
          className={`w-1/2 py-2.5 text-sm font-semibold rounded-md transition-all duration-300 ${
            activeTab === "parameters"
              ? "bg-yellow-400 text-black shadow-md"
              : "text-gray-600 hover:bg-gray-300"
          }`}
        >
          Parameters
        </button>
      </div>
      <div>
        {activeTab === "general" && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 animate-fadeIn">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Device Manufacturer
              </label>
              <Input
                value={formState.manufacturer}
                onChange={(e) =>
                  handleStateChange("manufacturer", e.target.value)
                }
                placeholder="Set manufacturer"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Serial Number
              </label>
              <Input
                value={formState.serial_number}
                onChange={(e) =>
                  handleStateChange("serial_number", e.target.value)
                }
                placeholder="Set serial number"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Model
              </label>
              <Input
                value={formState.model}
                onChange={(e) => handleStateChange("model", e.target.value)}
                placeholder="Set Device model"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Tag Name
              </label>
              <Input
                value={formState.tag_name}
                onChange={(e) => handleStateChange("tag_name", e.target.value)}
                placeholder="Set tag name"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                G-Size
              </label>
              <Input
                value={formState.g_size}
                onChange={(e) => handleStateChange("g_size", e.target.value)}
                placeholder="Set G-size"
              />
            </div>
          </div>
        )}
        {activeTab === "parameters" && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 animate-fadeIn">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Frequency Type
              </label>
              <select
                value={formState.frequency_type}
                onChange={(e) =>
                  handleStateChange("frequency_type", e.target.value)
                }
                className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm bg-white shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
              >
                <option value="LF">Low Frequency (LF)</option>
                <option value="HF">High Frequency (HF)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Frequency (Hz)
              </label>
              <select
                value={formState.frequency_hz}
                onChange={(e) =>
                  handleStateChange("frequency_hz", e.target.value)
                }
                className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm bg-white shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
              >
                {frequencyOptions.map((freq) => (
                  <option key={freq} value={freq}>{`${freq}${
                    formState.frequency_type === "HF" ? " Hz" : ""
                  }`}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Pulse Duration (ms)
              </label>
              <Input
                value={formState.pulse_duration_ms}
                onChange={(e) =>
                  handleStateChange("pulse_duration_ms", e.target.value)
                }
                placeholder="Set value"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Pulse Pause (ms)
              </label>
              <Input
                value={formState.pulse_pause_ms}
                onChange={(e) =>
                  handleStateChange("pulse_pause_ms", e.target.value)
                }
                placeholder="Set value"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Scaling Factor (Imp/Q)
              </label>
              <Input
                value={formState.scaling_factor}
                onChange={(e) =>
                  handleStateChange("scaling_factor", e.target.value)
                }
                placeholder="Set value"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Offset
              </label>
              <Input
                value={formState.offset}
                onChange={(e) => handleStateChange("offset", e.target.value)}
                placeholder="Set value"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Minimum Flowrate
              </label>
              <Input
                value={formState.flowrate_min}
                onChange={(e) =>
                  handleStateChange("flowrate_min", e.target.value)
                }
                placeholder="Set Minimum Flowrate"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Maximum Flowrate
              </label>
              <Input
                value={formState.flowrate_max}
                onChange={(e) =>
                  handleStateChange("flowrate_max", e.target.value)
                }
                placeholder="Set Maximum Flowrate"
              />
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={onBack}
          className="px-6 py-2 rounded-full font-semibold text-sm bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors shadow-sm"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 rounded-full font-semibold text-sm bg-yellow-400 text-black hover:bg-yellow-500 transition-colors shadow-sm"
        >
          Save
        </button>
      </div>
    </div>
  );
};
export default PulseFlowRateDeviceForm;
