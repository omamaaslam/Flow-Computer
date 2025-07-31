// src/components/configurationFlow/PressureDeviceForm.tsx
import React, { useState, useEffect } from "react";
import BridgeComponent from "./BridgeComponent";
import type { DeviceConfig } from "../../types/device";

interface InputProps extends React.ComponentPropsWithoutRef<"input"> {}
const Input = (props: InputProps) => (
  <input
    {...props}
    className="w-full border rounded-md py-1.5 px-3 text-sm placeholder:text-gray-400 shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
  />
);
interface CustomComboboxProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}
const CustomCombobox: React.FC<CustomComboboxProps> = (props) => {
  return null;
};

interface PressureDeviceFormProps {
  onBack: () => void;
  onSave: (config: DeviceConfig) => void;
  interfaceName: string;
  initialData?: DeviceConfig | null;
}

const PressureDeviceForm: React.FC<PressureDeviceFormProps> = ({
  onBack,
  onSave,
  interfaceName,
  initialData,
}) => {
  const [activeTab, setActiveTab] = useState<"general" | "parameters">(
    "general"
  );
  const [formState, setFormState] = useState({
    manufacturer: "",
    serial_number: "",
    model: "",
    tag_name: "",
    g_size: "",
    pressure_min: "",
    pressure_max: "",
    unit: "bar",
    correction_c0: "",
    correction_c1: "",
    correction_c2: "",
    correction_c3: "",
    slaveId: "",
    register_count: "",
    register_address: "",
    data_type: "",
    pollingAddress: "",
    commandSet: "",
    variableType: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormState({
        manufacturer: initialData.manufacturer || "",
        serial_number: initialData.serial_number || "",
        model: initialData.model || "",
        tag_name: initialData.tag_name || "",
        g_size: String(initialData.g_size || ""),
        pressure_min: String(initialData.pressure_min || ""),
        pressure_max: String(initialData.pressure_max || ""),
        unit: initialData.unit || "bar",
        correction_c0: String(initialData.correction_c0 || ""),
        correction_c1: String(initialData.correction_c1 || ""),
        correction_c2: String(initialData.correction_c2 || ""),
        correction_c3: String(initialData.correction_c3 || ""),
        slaveId: String(initialData.slaveId || ""),
        register_count: String(initialData.register_count || ""),
        register_address: String(initialData.register_address || ""),
        data_type: initialData.data_type || "",
        pollingAddress: String(initialData.pollingAddress || ""),
        commandSet: initialData.commandSet || "",
        variableType: initialData.variableType || "",
      });
    }
  }, [initialData]);

  const handleStateChange = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const validateAndSave = () => {
    const finalConfig: DeviceConfig = {
      manufacturer: formState.manufacturer,
      model: formState.model,
      serial_number: formState.serial_number,
      tag_name: formState.tag_name,
      g_size: formState.g_size,
      pressure_min: parseFloat(formState.pressure_min),
      pressure_max: parseFloat(formState.pressure_max),
      unit: formState.unit,
      correction_c0: parseFloat(formState.correction_c0),
      correction_c1: parseFloat(formState.correction_c1),
      correction_c2: parseFloat(formState.correction_c2),
      correction_c3: parseFloat(formState.correction_c3),
    };
    onSave(finalConfig);
  };

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
          <div className="flex flex-col space-y-4 animate-fadeIn">
            <div className="grid grid-cols-2 gap-x-6">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">
                  Pmin
                </label>
                <Input
                  value={formState.pressure_min}
                  onChange={(e) =>
                    handleStateChange("pressure_min", e.target.value)
                  }
                  placeholder="Set Pmin"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">
                  Pmax
                </label>
                <Input
                  value={formState.pressure_max}
                  onChange={(e) =>
                    handleStateChange("pressure_max", e.target.value)
                  }
                  placeholder="Set Pmax"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Pressure Unit
              </label>
              <Input
                value={formState.unit}
                onChange={(e) => handleStateChange("unit", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Correction Coefficients
              </label>
              <div className="grid grid-cols-4 gap-x-3">
                <Input
                  value={formState.correction_c0}
                  onChange={(e) =>
                    handleStateChange("correction_c0", e.target.value)
                  }
                  placeholder="C0"
                />
                <Input
                  value={formState.correction_c1}
                  onChange={(e) =>
                    handleStateChange("correction_c1", e.target.value)
                  }
                  placeholder="C1"
                />
                <Input
                  value={formState.correction_c2}
                  onChange={(e) =>
                    handleStateChange("correction_c2", e.target.value)
                  }
                  placeholder="C2"
                />
                <Input
                  value={formState.correction_c3}
                  onChange={(e) =>
                    handleStateChange("correction_c3", e.target.value)
                  }
                  placeholder="C3"
                />
              </div>
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
          onClick={validateAndSave}
          className="px-6 py-2 rounded-full font-semibold text-sm bg-yellow-400 text-black hover:bg-yellow-500 transition-colors shadow-sm"
        >
          Save
        </button>
      </div>
    </div>
  );
};
export default PressureDeviceForm;
