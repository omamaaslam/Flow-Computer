import React, { useState } from "react";
import BridgeComponent from "./BridgeComponent";

interface CustomComboboxProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  // REMOVED: hasError prop
}

const CustomCombobox: React.FC<CustomComboboxProps> = ({
  options,
  value,
  onChange,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full" onBlur={handleBlur} tabIndex={-1}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        // REMOVED: Conditional border class
        className="w-full border rounded-md py-1.5 pl-3 pr-8 text-sm placeholder:text-gray-400 bg-white shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 border-gray-300"
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

// REMOVED: hasError prop from InputProps
interface InputProps extends React.ComponentPropsWithoutRef<"input"> {}
const Input = (props: InputProps) => (
  <input
    {...props}
    // REMOVED: Conditional border class
    className="w-full border rounded-md py-1.5 px-3 text-sm placeholder:text-gray-400 shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 border-gray-300"
  />
);

interface TemperatureDeviceFormProps {
  onBack: () => void;
  onSave: (config: any) => void;
  interfaceName: string;
}

const TemperatureDeviceForm: React.FC<TemperatureDeviceFormProps> = ({
  onBack,
  onSave,
  interfaceName,
}) => {
  const [activeTab, setActiveTab] = useState<"general" | "parameters">(
    "general"
  );

  const [formState, setFormState] = useState({
    slaveId: "",
    register_count: "",
    register_address: "",
    data_type: "",
    pollingAddress: "",
    commandSet: "",
    variableType: "",
    manufacturer: "",
    serial_number: "",
    model: "",
    tag_name: "",
    tempUnit: "C",
    gSize: "",
    tmin: "",
    tmax: "",
    coeff1: "",
    coeff2: "",
    coeff3: "",
    coeff4: "",
  });

  // REMOVED: 'errors' state
  // const [errors, setErrors] = useState<Record<string, string>>({});

  const handleStateChange = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    // REMOVED: Logic to clear errors
  };

  // REMOVED: All validation-related constants and functions
  // ('requiredFields', 'numericFields', 'calculateIsFormValid', 'isFormValid')

  const validateAndSave = () => {
    // REMOVED: All validation logic

    const finalConfig = {
      general: {
        slaveId:
          interfaceName === "MOD" ? parseInt(formState.slaveId, 10) : null,
        register_count:
          interfaceName === "MOD"
            ? parseInt(formState.register_count, 10)
            : null,
        register_address:
          interfaceName === "MOD"
            ? parseInt(formState.register_address, 10)
            : null,
        data_type: interfaceName === "MOD" ? formState.data_type : "INT16",
        pollingAddress: interfaceName.includes("HART")
          ? parseInt(formState.pollingAddress, 10)
          : null,
        commandSet: interfaceName.includes("HART")
          ? formState.commandSet
          : null,
        variableType: interfaceName.includes("HART")
          ? formState.variableType
          : null,
        manufacturer: formState.manufacturer,
        model: formState.model,
        serial_number: formState.serial_number,
        tag_name: formState.tag_name,
        device_id: "",
        build_year: "",
        version: "",
      },
      parameters: {
        gSize: formState.gSize ? parseFloat(formState.gSize) : null,
        tmin: formState.tmin ? parseFloat(formState.tmin) : null,
        tmax: formState.tmax ? parseFloat(formState.tmax) : null,
        tempUnit: formState.tempUnit,
        coeff1: formState.coeff1 ? parseFloat(formState.coeff1) : null,
        coeff2: formState.coeff2 ? parseFloat(formState.coeff2) : null,
        coeff3: formState.coeff3 ? parseFloat(formState.coeff3) : null,
        coeff4: formState.coeff4 ? parseFloat(formState.coeff4) : null,
      },
    };

    onSave(finalConfig);
  };

  return (
    <div className="flex flex-col space-y-6">
      <BridgeComponent
        interfaceName={interfaceName}
        formState={formState}
        // Pass an empty object for the errors prop as it's no longer managed here
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
              <CustomCombobox
                value={formState.manufacturer}
                onChange={(val) => handleStateChange("manufacturer", val)}
                placeholder="Please set manufacturer"
                options={[
                  { value: "RMA", label: "RMA" },
                  { value: "Siemens", label: "Siemens" },
                ]}
              />
              {/* REMOVED: Error message */}
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
                placeholder="Please set serial number"
              />
              {/* REMOVED: Error message */}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Model
              </label>
              <Input
                value={formState.model}
                onChange={(e) => handleStateChange("model", e.target.value)}
                placeholder="Please set Device model"
                type="text"
              />
              {/* REMOVED: Error message */}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Tag Name
              </label>
              <Input
                value={formState.tag_name}
                onChange={(e) => handleStateChange("tag_name", e.target.value)}
                placeholder="Please set tag name"
              />
              {/* REMOVED: Error message */}
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
              {/* REMOVED: Error message */}
            </div>
          </div>
        )}
        {activeTab === "parameters" && (
          <div className="flex flex-col space-y-4 animate-fadeIn">
            <div className="grid grid-cols-2 gap-x-6">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">
                  Tmin
                </label>
                <Input
                  value={formState.tmin}
                  onChange={(e) => handleStateChange("tmin", e.target.value)}
                  placeholder="Please set Tmin"
                />
                {/* REMOVED: Error message */}
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">
                  Tmax
                </label>
                <Input
                  value={formState.tmax}
                  onChange={(e) => handleStateChange("tmax", e.target.value)}
                  placeholder="Please set Tmax"
                />
                {/* REMOVED: Error message */}
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Temperature Unit
              </label>
              <CustomCombobox
                value={formState.tempUnit}
                onChange={(val) => handleStateChange("tempUnit", val)}
                placeholder="Select Unit"
                options={[
                  { value: "C", label: "C" },
                  { value: "F", label: "F" },
                  { value: "K", label: "K" },
                ]}
              />
              {/* REMOVED: Error message */}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Correction Coefficients
              </label>
              <div className="grid grid-cols-4 gap-x-3">
                <div>
                  <Input
                    value={formState.coeff1}
                    onChange={(e) =>
                      handleStateChange("coeff1", e.target.value)
                    }
                    placeholder="Enter value"
                  />
                  {/* REMOVED: Error message */}
                </div>
                <div>
                  <Input
                    value={formState.coeff2}
                    onChange={(e) =>
                      handleStateChange("coeff2", e.target.value)
                    }
                    placeholder="Enter value"
                  />
                  {/* REMOVED: Error message */}
                </div>
                <div>
                  <Input
                    value={formState.coeff3}
                    onChange={(e) =>
                      handleStateChange("coeff3", e.target.value)
                    }
                    placeholder="Enter value"
                  />
                  {/* REMOVED: Error message */}
                </div>
                <div>
                  <Input
                    value={formState.coeff4}
                    onChange={(e) =>
                      handleStateChange("coeff4", e.target.value)
                    }
                    placeholder="Enter value"
                  />
                  {/* REMOVED: Error message */}
                </div>
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
          // REMOVED: disabled prop
          className="px-6 py-2 rounded-full font-semibold text-sm bg-yellow-400 text-black hover:bg-yellow-500 transition-colors shadow-sm"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default TemperatureDeviceForm;
