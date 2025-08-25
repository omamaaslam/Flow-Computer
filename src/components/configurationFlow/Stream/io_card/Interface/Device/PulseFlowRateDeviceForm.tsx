import React, { useState, useEffect } from "react";
import type { DeviceConfig } from "../../../../../../types/device";
import type { Device } from "../../../../../../stores/Device";
import { observer } from "mobx-react-lite";
// import BridgeComponent from "../BridgeComponent";

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
  interface_type: string;
  device?: Device | null; // This is the new primary prop for data
}

const PulseFlowRateDeviceForm: React.FC<PulseFlowRateDeviceFormProps> =
  observer(({ onBack, onSave, device }) => {
    const [activeTab, setActiveTab] = useState<"general" | "parameters">(
      "general"
    );
    const lfOptions = [2, 5];
    const hfOptions = [5, 20, 50, 100, 250, 500, 1000, 1500, 2000, 3000, 4000];

    // --- 👇 FIX #1: Add all required fields to the state ---
    const [formState, setFormState] = useState({
      manufacturer: "",
      serial_number: "",
      model: "",
      tag_name: "",
      build_year: "2025",
      version: "v1.0",
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
      if (device) {
        const config = device.config;
        const initialFreqType = config.frequency_type ?? "LF";

        setFormState((prevState) => ({
          ...prevState,
          manufacturer: config.manufacturer ?? "",
          serial_number: config.serial_number ?? "",
          model: config.model ?? "",
          tag_name: config.tag_name ?? "",
          build_year: config.build_year ?? "",
          version: config.version ?? "",
          frequency_type: initialFreqType,
          frequency_hz: String(
            config.frequency_hz ??
              (initialFreqType === "HF" ? hfOptions[0] : lfOptions[0])
          ),
          pulse_duration_ms: String(config.pulse_duration_ms ?? ""),
          pulse_pause_ms: String(config.pulse_pause_ms ?? ""),
          scaling_factor: String(config.scaling_factor ?? ""),
          offset: String(config.offset ?? ""),
          flowrate_min: String(config.flowrate_min ?? ""),
          flowrate_max: String(config.flowrate_max ?? ""),
        }));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [device]);

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
      const safeParseInt = (val: string) =>
        val && !isNaN(parseInt(val, 10)) ? parseInt(val, 10) : 0;
      const safeParseFloat = (val: string) =>
        val && !isNaN(parseFloat(val)) ? parseFloat(val) : 0;

      // --- 👇 FIX #3: Include all required fields in the final object ---
      const finalConfig: DeviceConfig = {
        device_id: device?.id || "",
        device_type: "PulseFlowRateDevice",
        manufacturer: formState.manufacturer,
        model: formState.model,
        serial_number: formState.serial_number,
        tag_name: formState.tag_name,
        build_year: formState.build_year,
        version: formState.version,
        frequency_type: formState.frequency_type,
        frequency_hz: safeParseInt(formState.frequency_hz),
        pulse_duration_ms: safeParseInt(formState.pulse_duration_ms),
        pulse_pause_ms: safeParseInt(formState.pulse_pause_ms),
        scaling_factor: safeParseFloat(formState.scaling_factor),
        offset: safeParseFloat(formState.offset),
        flowrate_min: safeParseFloat(formState.flowrate_min),
        flowrate_max: safeParseFloat(formState.flowrate_max),
      };
      onSave(finalConfig);
    };

    const frequencyOptions =
      formState.frequency_type === "LF" ? lfOptions : hfOptions;

    return (
      <div className="flex flex-col space-y-6">
        <div className="grid grid-cols-3 gap-4 text-slate-500 text-sm p-3 border rounded-lg bg-gray-50">
          <div className="truncate">
            Timestamp:{" "}
            <span className="font-medium text-gray-700">
              {typeof device?.config.data?.timestamp === "number"
                ? new Date(device.config.data.timestamp * 1000).toLocaleTimeString()
                : "N/A"}
            </span>
          </div>
          <div className="truncate">
            Status:{" "}
            <span className="font-medium text-gray-700">
              {device?.config.data?.status ?? "N/A"}
            </span>
          </div>
          <div className="truncate">
            Live Value:{" "}
            <span className="font-medium text-gray-700">
              {typeof device?.config.data?.value === "number"
                ? device.config.data.value.toFixed(5)
                : device?.config.data?.value ?? "N/A"}
            </span>
          </div>
        </div>

        {/* Assuming BridgeComponent is not needed for this device type */}

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
                  onChange={(e) =>
                    handleStateChange("tag_name", e.target.value)
                  }
                  placeholder="Set tag name"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">
                  Build Year
                </label>
                <Input
                  value={formState.build_year}
                  onChange={(e) =>
                    handleStateChange("build_year", e.target.value)
                  }
                  placeholder="e.g., 2025"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">
                  Version
                </label>
                <Input
                  value={formState.version}
                  onChange={(e) => handleStateChange("version", e.target.value)}
                  placeholder="e.g., v1.0"
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
                    <option key={freq} value={freq}>{`${freq} Hz`}</option>
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
                  type="number"
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
                  type="number"
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
                  type="number"
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
                  type="number"
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
                  type="number"
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
                  type="number"
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
  });
export default PulseFlowRateDeviceForm;
