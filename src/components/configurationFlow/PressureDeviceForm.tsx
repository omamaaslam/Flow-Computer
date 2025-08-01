import React, { useState, useEffect } from "react";
import BridgeComponent from "./BridgeComponent";
import type { DeviceConfig } from "../../types/device";

// Helper component for a standard text input
interface InputProps extends React.ComponentPropsWithoutRef<"input"> {}
const Input = (props: InputProps) => (
  <input
    {...props}
    className="w-full border rounded-md py-1.5 px-3 text-sm placeholder:text-gray-400 shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
  />
);

// CustomCombobox definition is now inside this file
interface CustomComboboxProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hasError?: boolean;
}

const CustomCombobox: React.FC<CustomComboboxProps> = ({
  options,
  value,
  onChange,
  placeholder,
  hasError,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const comboboxRef = React.useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    if (
      comboboxRef.current &&
      !comboboxRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={comboboxRef}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className={`w-full border rounded-md py-1.5 pl-3 pr-8 text-sm placeholder:text-gray-400 bg-white shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 ${
          hasError ? "border-red-500" : "border-gray-300"
        }`}
      />
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="absolute inset-y-0 right-0 flex items-center px-2"
        aria-label="Toggle options"
      >
        <svg
          className="h-4 w-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-[2000] top-full mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 animate-fadeIn p-2">
          <div className="max-h-60 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-4 p-2.5 rounded-md cursor-pointer text-sm transition-colors ${
                  value === option.value
                    ? "bg-yellow-100/50"
                    : "hover:bg-gray-100"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    value === option.value
                      ? "border-yellow-500"
                      : "border-gray-400"
                  }`}
                >
                  {value === option.value && (
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  )}
                </div>
                <span>{option.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Main form component starts here
interface PressureDeviceFormProps {
  onBack: () => void;
  onSave: (config: DeviceConfig) => void;
  interfaceName: string;
  initialData?: DeviceConfig | null;
  bridgeData?: any | null; // Receives Modbus/HART specific data
}

const PressureDeviceForm: React.FC<PressureDeviceFormProps> = ({
  onBack,
  onSave,
  interfaceName,
  initialData,
  bridgeData,
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
    // Bridge-related state fields (using snake_case)
    slave_id: "",
    register_count: "",
    register_address: "",
    data_type: "",
    pollingAddress: "",
    commandSet: "",
    variableType: "",
  });

  useEffect(() => {
    const generalData = initialData || {};
    const interfaceSpecificData = bridgeData || {};

    setFormState({
      // Populate general data from 'devices' object
      manufacturer: generalData.manufacturer ?? "",
      serial_number: generalData.serial_number ?? "",
      model: generalData.model ?? "",
      tag_name: generalData.tag_name ?? "",
      g_size: String(generalData.g_size ?? ""),
      pressure_min: String(generalData.pressure_min ?? ""),
      pressure_max: String(generalData.pressure_max ?? ""),
      unit: generalData.unit ?? "bar",
      correction_c0: String(generalData.correction_c0 ?? ""),
      correction_c1: String(generalData.correction_c1 ?? ""),
      correction_c2: String(generalData.correction_c2 ?? ""),
      correction_c3: String(generalData.correction_c3 ?? ""),

      // Populate bridge data from 'list' object
      slave_id: String(interfaceSpecificData.slave_address ?? ""),
      register_count: String(interfaceSpecificData.register_count ?? ""),
      register_address: String(interfaceSpecificData.register_address ?? ""),
      data_type: interfaceSpecificData.data_type ?? "",
      pollingAddress: String(interfaceSpecificData.pollingAddress ?? ""),
      commandSet: interfaceSpecificData.commandSet ?? "",
      variableType: interfaceSpecificData.variableType ?? "",
    });
  }, [initialData, bridgeData]);

  const handleStateChange = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const validateAndSave = () => {
    const finalConfig: DeviceConfig = {
      // General & Parameters data
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

      // Bridge data
      slave_address: parseInt(formState.slave_id, 10),
      register_address: parseInt(formState.register_address, 10),
      register_count: parseInt(formState.register_count, 10),
      data_type: formState.data_type,
    };
    onSave(finalConfig);
  };

  const pressureUnitOptions = [
    { value: "bar", label: "bar" },
    { value: "psi", label: "psi" },
    { value: "kPa", label: "kPa" },
    { value: "mbar", label: "mbar" },
  ];

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
              <CustomCombobox
                value={formState.unit}
                onChange={(value) => handleStateChange("unit", value)}
                options={pressureUnitOptions}
                placeholder="Select a unit"
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
