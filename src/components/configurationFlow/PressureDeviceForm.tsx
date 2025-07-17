import React, { useState, useRef, useEffect } from "react";

// --- Type Definitions (for context) ---
type DataType = "INT16" | "INT32" | "FLOAT" | "DOUBLE" | "STRING";
interface DeviceConfig {
  general: {
    slaveId: number | null;
    registerCount: number | null;
    registerAddress: number | null;
    dataType: DataType;
    manufacturer: string;
    model: string;
    serialNumber: string;
    tagName: string;
    deviceId: string;
    buildYear: number | null;
    version: string;
  };
}

function useOnClickOutside(
  ref: React.RefObject<HTMLDivElement | null>,
  handler: () => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

// --- CustomCombobox Component (Simplified) ---
// The `hasError` prop has been removed to simplify this component.
interface CustomComboboxProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const CustomCombobox: React.FC<CustomComboboxProps> = ({
  options,
  value,
  onChange,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const comboboxRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(comboboxRef, () => setIsOpen(false));

  return (
    <div className="relative w-full" ref={comboboxRef}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        // The className is now simpler, with no conditional red border.
        className="w-full border border-gray-300 rounded-md py-1.5 pl-3 pr-8 text-sm placeholder:text-gray-400 bg-white shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
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

// --- Custom Input Component (Simplified) ---
// The `hasError` prop has been removed here as well.
interface InputProps extends React.ComponentPropsWithoutRef<"input"> {}

const Input = (props: InputProps) => (
  <input
    {...props}
    // The className is now simpler, with no conditional red border.
    className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm placeholder:text-gray-400 shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
  />
);

// --- Form Logic and State ---

const initialFormState = {
  slaveId: "",
  registerCount: "",
  registerAddress: "",
  dataType: "" as DataType | "",
  pollingAddress: "",
  commandSet: "",
  variableType: "",
  manufacturer: "",
  serialNumber: "",
  model: "",
  tagName: "",
  gSize: "",
  pmin: "",
  pmax: "",
  pressureUnit: "psi",
  correctionCoefficient: "",
};
export type PressureFormState = typeof initialFormState;

interface PressureDeviceFormProps {
  onBack: () => void;
  onSave: (config: DeviceConfig) => void;
  interfaceName: string;
}

const PressureDeviceForm: React.FC<PressureDeviceFormProps> = ({
  onBack,
  onSave,
  interfaceName,
}) => {
  const [activeTab, setActiveTab] = useState<"general" | "parameters">(
    "general"
  );
  const [formState, setFormState] = useState(initialFormState);

  const handleStateChange = (field: keyof typeof formState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  // This function determines which fields are required based on the interfaceName.
  // We keep this because it's important for deciding when the form is ready to be saved.
  const getRequiredFields = () => {
    const baseFields: (keyof typeof formState)[] = [
      "manufacturer",
      "serialNumber",
      "model",
      "tagName",
      "pmin",
      "pmax",
    ];
    if (interfaceName === "MOD") {
      return [
        ...baseFields,
        "slaveId",
        "registerCount",
        "registerAddress",
        "dataType",
      ];
    }
    return baseFields;
  };
  const requiredFields = getRequiredFields();

  // This simple check determines if the save button should be enabled.
  // It checks if all the required fields have a value.
  const isFormValid = requiredFields.every(
    (field) => formState[field as keyof typeof formState]?.trim() !== ""
  );

  // This function is now much simpler. It doesn't need to check for errors
  // because the "Save" button will be disabled if the form isn't valid.
  const handleSave = () => {
    // We can directly create the final configuration object.
    const finalConfig: DeviceConfig = {
      general: {
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
        dataType:
          interfaceName === "MOD" ? (formState.dataType as DataType) : "INT16",
        manufacturer: formState.manufacturer,
        model: formState.model,
        serialNumber: formState.serialNumber,
        tagName: formState.tagName,
        deviceId: "",
        buildYear: null,
        version: "",
      },
    };
    onSave(finalConfig);
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Top section of the form (always visible) */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        {/* Slave ID */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-600">
            Slave ID
          </label>
          <CustomCombobox
            value={formState.slaveId}
            onChange={(val) => handleStateChange("slaveId", val)}
            placeholder="Please set slave ID"
            options={[
              { value: "1", label: "1" },
              { value: "2", label: "2" },
            ]}
          />
          {/* SIMPLIFICATION: The error message <p> tag is removed. */}
        </div>

        {/* Register Count */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-600">
            Register Count
          </label>
          <CustomCombobox
            value={formState.registerCount}
            onChange={(val) => handleStateChange("registerCount", val)}
            placeholder="Number of registers..."
            options={[
              { value: "2", label: "2 (for 1 float32)" },
              { value: "4", label: "4" },
            ]}
          />
        </div>

        {/* Register Address */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-600">
            Register Address
          </label>
          <CustomCombobox
            value={formState.registerAddress}
            onChange={(val) => handleStateChange("registerAddress", val)}
            placeholder="Please set register address"
            options={[
              { value: "40001", label: "40001" },
              { value: "40002", label: "40002" },
            ]}
          />
        </div>

        {/* Data Type */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-600">
            Data Type
          </label>
          <CustomCombobox
            value={formState.dataType}
            onChange={(val) => handleStateChange("dataType", val)}
            placeholder="INT16, FLOAT..."
            options={[
              { value: "INT16", label: "INT16" },
              { value: "INT32", label: "INT32" },
              { value: "FLOAT", label: "FLOAT" },
              { value: "DOUBLE", label: "DOUBLE" },
              { value: "STRING", label: "STRING" },
            ]}
          />
        </div>
      </div>

      {/* Tab switcher */}
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

      {/* Content for the tabs */}
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
          <div className="flex flex-col space-y-4 animate-fadeIn">
            <div className="grid grid-cols-2 gap-x-6">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">
                  Pmin
                </label>
                <Input
                  value={formState.pmin}
                  onChange={(e) => handleStateChange("pmin", e.target.value)}
                  placeholder="Please set Pmin"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">
                  Pmax
                </label>
                <Input
                  value={formState.pmax}
                  onChange={(e) => handleStateChange("pmax", e.target.value)}
                  placeholder="Please set Pmax"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Pressure Unit
              </label>
              <CustomCombobox
                value={formState.pressureUnit}
                onChange={(val) => handleStateChange("pressureUnit", val)}
                placeholder="Select Unit"
                options={[
                  { value: "psi", label: "psi" },
                  { value: "bar", label: "bar" },
                  { value: "kPa", label: "kPa" },
                ]}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Correction Coefficient
              </label>
              <Input
                value={formState.correctionCoefficient}
                onChange={(e) =>
                  handleStateChange("correctionCoefficient", e.target.value)
                }
                placeholder="Enter value"
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
          onClick={handleSave}
          disabled={!isFormValid}
          className="px-6 py-2 rounded-full font-semibold text-sm bg-yellow-400 text-black hover:bg-yellow-500 transition-colors shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default PressureDeviceForm;
