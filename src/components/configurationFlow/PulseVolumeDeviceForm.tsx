import React, { useState } from "react";
import BridgeComponent from "./BridgeComponent";

// Helper component for styled inputs
interface InputProps extends React.ComponentPropsWithoutRef<"input"> {}
const Input = (props: InputProps) => (
  <input
    {...props}
    className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm placeholder:text-gray-400 shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
  />
);

interface PulseVolumeDeviceFormProps {
  onBack: () => void;
  onSave: (config: any) => void;
  interfaceName: string;
}

const PulseVolumeDeviceForm: React.FC<PulseVolumeDeviceFormProps> = ({
  onBack,
  onSave,
  interfaceName,
}) => {
  const [activeTab, setActiveTab] = useState<"general" | "parameters">(
    "general"
  );

  // Options for Frequency dropdown
  const lfOptions = [2, 5];
  const hfOptions = [5, 20, 50, 100, 250, 500, 1000, 1500, 2000, 3000, 4000];

  // Single state object for all form fields
  const [formState, setFormState] = useState({
    // Bridge fields
    slaveId: "",
    registerCount: "",
    registerAddress: "",
    dataType: "",
    pollingAddress: "",
    commandSet: "",
    variableType: "",
    // General fields
    manufacturer: "",
    serialNumber: "",
    model: "",
    tagName: "",
    gSize: "",
    // Parameters fields
    frequencyType: "LF", // Default to Low Frequency
    frequency: lfOptions[0].toString(), // Default to the first LF option
    pulseDuration: "",
    pulsePause: "",
    pulseVolume: "",
  });

  // A single handler for all input changes
  const handleStateChange = (field: string, value: string) => {
    setFormState((prev) => {
      const newState = { ...prev, [field]: value };

      // If frequency type changes, update the frequency to the first valid option of the new type
      if (field === "frequencyType") {
        newState.frequency =
          value === "LF" ? lfOptions[0].toString() : hfOptions[0].toString();
      }
      return newState;
    });
  };

  // Format and submit the data
  const handleSubmit = () => {
    const finalConfig = {
      general: {
        // Modbus fields
        slaveId:
          interfaceName === "MOD" ? parseInt(formState.slaveId, 10) : null,
        registerCount:
          interfaceName === "MOD"
            ? parseInt(formState.registerCount, 10)
            : null,
        registerAddress:
          interfaceName === "MOD"
            ? parseInt(formState.registerAddress, 10)
            : null,
        dataType: interfaceName === "MOD" ? formState.dataType : "INT16",
        // HART fields
        pollingAddress: interfaceName.includes("HART")
          ? parseInt(formState.pollingAddress, 10)
          : null,
        commandSet: interfaceName.includes("HART")
          ? formState.commandSet
          : null,
        variableType: interfaceName.includes("HART")
          ? formState.variableType
          : null,
        // General device info
        manufacturer: formState.manufacturer,
        model: formState.model,
        serialNumber: formState.serialNumber,
        tagName: formState.tagName,
        deviceId: "",
        buildYear: null,
        version: "",
        gSize: formState.gSize ? parseFloat(formState.gSize) : null,
      },
      parameters: {
        // Device-specific parameters
        frequencyType: formState.frequencyType,
        frequency: formState.frequency
          ? parseInt(formState.frequency, 10)
          : null,
        pulseDuration: formState.pulseDuration
          ? parseInt(formState.pulseDuration, 10)
          : null,
        pulsePause: formState.pulsePause
          ? parseInt(formState.pulsePause, 10)
          : null,
        pulseVolume: formState.pulseVolume
          ? parseFloat(formState.pulseVolume)
          : null,
      },
    };

    console.log("Submitting Formatted Pulse Volume Config:", finalConfig);
    onSave(finalConfig);
  };

  // Determine which frequency options to show based on the current state
  const frequencyOptions =
    formState.frequencyType === "LF" ? lfOptions : hfOptions;

  return (
    <div className="flex flex-col space-y-6">
      {/* Bridge Component for common interface settings */}
      <BridgeComponent
        interfaceName={interfaceName}
        formState={formState}
        errors={{}}
        handleStateChange={handleStateChange}
      />

      {/* Tab Switcher */}
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

      {/* Form Fields */}
      <div>
        {activeTab === "general" && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 animate-fadeIn">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Device Manufacturer
              </label>
              <select
                value={formState.manufacturer}
                onChange={(e) =>
                  handleStateChange("manufacturer", e.target.value)
                }
                className={`w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm bg-white shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 ${
                  formState.manufacturer === "" ? "text-gray-400" : "text-black"
                }`}
              >
                <option value="" disabled>
                  Please set manufacturer
                </option>
                <option value="RMA">RMA</option>
                <option value="Siemens">Siemens</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Serial Number
              </label>
              <Input
                value={formState.serialNumber}
                onChange={(e) =>
                  handleStateChange("serialNumber", e.target.value)
                }
                placeholder="Please set serial number"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Model
              </label>
              <Input
                value={formState.model}
                onChange={(e) => handleStateChange("model", e.target.value)}
                placeholder="Please set Device model"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Tag Name
              </label>
              <Input
                value={formState.tagName}
                onChange={(e) => handleStateChange("tagName", e.target.value)}
                placeholder="Please set tag name"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                G-Size
              </label>
              <Input
                value={formState.gSize}
                onChange={(e) => handleStateChange("gSize", e.target.value)}
                placeholder="Please set G-size"
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
                value={formState.frequencyType}
                onChange={(e) =>
                  handleStateChange("frequencyType", e.target.value)
                }
                className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm bg-white shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
              >
                <option value="LF">Low Frequency (LF)</option>
                <option value="HF">High Frequency (HF)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Frequency
              </label>
              <select
                value={formState.frequency}
                onChange={(e) => handleStateChange("frequency", e.target.value)}
                className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm bg-white shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
              >
                {frequencyOptions.map((freq) => (
                  <option key={freq} value={freq}>
                    {`${freq}${formState.frequencyType === "HF" ? " Hz" : ""}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Pulse Duration (ms)
              </label>
              <Input
                value={formState.pulseDuration}
                onChange={(e) =>
                  handleStateChange("pulseDuration", e.target.value)
                }
                placeholder="Please set Pulse Duration"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Pulse Pause (ms)
              </label>
              <Input
                value={formState.pulsePause}
                onChange={(e) =>
                  handleStateChange("pulsePause", e.target.value)
                }
                placeholder="Please set Pulse Pause"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Pulse Volume (m3)
              </label>
              <Input
                value={formState.pulseVolume}
                onChange={(e) =>
                  handleStateChange("pulseVolume", e.target.value)
                }
                placeholder="Please set Pulse Volume"
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
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

export default PulseVolumeDeviceForm;
