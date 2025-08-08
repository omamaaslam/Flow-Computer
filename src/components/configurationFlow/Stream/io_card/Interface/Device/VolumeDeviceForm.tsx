// src/components/configurationFlow/VolumeDeviceForm.tsx
import React, { useState, useEffect } from "react";
import type { DeviceConfig } from "../../../../../../types/device";
import BridgeComponent from "../BridgeComponent";

interface InputProps extends React.ComponentPropsWithoutRef<"input"> {}
const Input = (props: InputProps) => (
  <input
    {...props}
    className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm placeholder:text-gray-400 shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
  />
);

interface VolumeDeviceFormProps {
  onBack: () => void;
  onSave: (config: DeviceConfig) => void;
  interface_type: string;
  initialData?: DeviceConfig | null;
}

const VolumeDeviceForm: React.FC<VolumeDeviceFormProps> = ({
  onBack,
  onSave,
  interface_type,
  initialData,
}) => {
  const [activeTab, setActiveTab] = useState<"general" | "parameters">(
    "general"
  );
  const [formState, setFormState] = useState({
    manufacturer: "Omega Traders",
    serial_number: "SN-123456",
    model: "2023",
    tag_name: "RMA",
    build_year: "2023",
    volume_min: "",
    volume_max: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormState({
        manufacturer: initialData.manufacturer || "",
        serial_number: initialData.serial_number || "",
        model: initialData.model || "",
        tag_name: initialData.tag_name || "",
        build_year: initialData.build_year || "",
        volume_min: String(initialData.volume_min || ""),
        volume_max: String(initialData.volume_max || ""),
      });
    }
  }, [initialData]);

  const handleStateChange = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const finalConfig: DeviceConfig = {
      manufacturer: formState.manufacturer,
      model: formState.model,
      serial_number: formState.serial_number,
      tag_name: formState.tag_name,
      build_year: formState.build_year,
      volume_min: parseFloat(formState.volume_min),
      volume_max: parseFloat(formState.volume_max),
    };
    onSave(finalConfig);
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-start items-center gap-6 text-blue-400">
        <div>Status: {initialData?.data.status}</div>
        <div>Timestamp: {initialData?.data.timestamp}</div>
        <div>Value: {initialData?.data.value}</div>
      </div>
      <BridgeComponent
        interface_type={interface_type}
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
          </div>
        )}
        {activeTab === "parameters" && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 animate-fadeIn">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Min Volume
              </label>
              <Input
                value={formState.volume_min}
                onChange={(e) =>
                  handleStateChange("volume_min", e.target.value)
                }
                placeholder="Set Min Volume"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Max Volume
              </label>
              <Input
                value={formState.volume_max}
                onChange={(e) =>
                  handleStateChange("volume_max", e.target.value)
                }
                placeholder="Set Max Volume"
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
export default VolumeDeviceForm;
