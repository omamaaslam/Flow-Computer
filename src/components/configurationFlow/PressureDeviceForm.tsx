import React, { useState, useRef, useEffect, useMemo } from "react";
import type { DeviceConfig, DataType } from "../../types/device";

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
interface CustomComboboxProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  hasError?: boolean;
}
const CustomCombobox: React.FC<CustomComboboxProps> = ({
  options,
  value,
  onChange,
  placeholder,
  hasError,
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

interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  hasError?: boolean;
}
const Input = ({ hasError, ...props }: InputProps) => (
  <input
    {...props}
    className={`w-full border rounded-md py-1.5 px-3 text-sm placeholder:text-gray-400 shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 ${
      hasError ? "border-red-500" : "border-gray-300"
    }`}
  />
);

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

  type FormErrors = Partial<Record<keyof typeof formState, string>>;
  const [errors, setErrors] = useState<FormErrors>({});

  const handleStateChange = (field: keyof typeof formState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const requiredFields = useMemo(() => {
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
    if (interfaceName === "HART1" || interfaceName === "HART2") {
      return [...baseFields, "pollingAddress", "commandSet", "variableType"];
    }
    return baseFields;
  }, [interfaceName]);

  const numericFields: (keyof typeof formState)[] = [
    "slaveId",
    "registerCount",
    "registerAddress",
    "gSize",
    "pmin",
    "pmax",
    "correctionCoefficient",
    "pollingAddress",
  ];

  const isFormValid = useMemo(() => {
    const allRequiredFilled = requiredFields.every(
      (field) => formState[field as keyof typeof formState]?.trim() !== ""
    );
    if (!allRequiredFilled) return false;
    const allNumericValid = numericFields.every((field) => {
      const value = formState[field as keyof typeof formState];
      return !value || /^-?\d*\.?\d*$/.test(value);
    });
    if (!allNumericValid) return false;
    return true;
  }, [formState, requiredFields, numericFields]);

  const validateAndSave = () => {
    const newErrors: FormErrors = {};
    requiredFields.forEach((field) => {
      const typedField = field as keyof typeof formState;
      if (!formState[typedField]?.toString().trim())
        newErrors[typedField] = "This field is required.";
    });
    numericFields.forEach((field) => {
      const value = formState[field as keyof typeof formState];
      if (value && !/^-?\d*\.?\d*$/.test(value))
        newErrors[field as keyof typeof formState] =
          "Please enter a valid number.";
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const finalConfig: DeviceConfig = {
        general: {
          slaveId:
            interfaceName === "MOD"
              ? parseInt(formState.slaveId, 10) || null
              : null,
          registerCount:
            interfaceName === "MOD"
              ? parseInt(formState.registerCount, 10) || null
              : null,
          registerAddress:
            interfaceName === "MOD"
              ? parseInt(formState.registerAddress, 10) || null
              : null,
          dataType:
            interfaceName === "MOD"
              ? (formState.dataType as DataType)
              : "INT16",
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
    } else {
      console.log("Validation failed. Please correct errors.");
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-600">
            Slave ID
          </label>
          <CustomCombobox
            hasError={!!errors.slaveId}
            value={formState.slaveId}
            onChange={(val) => handleStateChange("slaveId", val)}
            placeholder="Please set slave ID"
            options={[
              { value: "1", label: "1" },
              { value: "2", label: "2" },
            ]}
          />
          {errors.slaveId && (
            <p className="text-xs text-red-600 mt-1">{errors.slaveId}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-600">
            Register Count
          </label>
          <CustomCombobox
            hasError={!!errors.registerCount}
            value={formState.registerCount}
            onChange={(val) => handleStateChange("registerCount", val)}
            placeholder="Number of registers..."
            options={[
              { value: "2", label: "2 (for 1 float32)" },
              { value: "4", label: "4" },
            ]}
          />
          {errors.registerCount && (
            <p className="text-xs text-red-600 mt-1">{errors.registerCount}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-600">
            Register Address
          </label>
          <CustomCombobox
            hasError={!!errors.registerAddress}
            value={formState.registerAddress}
            onChange={(val) => handleStateChange("registerAddress", val)}
            placeholder="Please set register address"
            options={[
              { value: "40001", label: "40001" },
              { value: "40002", label: "40002" },
            ]}
          />
          {errors.registerAddress && (
            <p className="text-xs text-red-600 mt-1">
              {errors.registerAddress}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-600">
            Data Type
          </label>
          <CustomCombobox
            hasError={!!errors.dataType}
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
          {errors.dataType && (
            <p className="text-xs text-red-600 mt-1">{errors.dataType}</p>
          )}
        </div>
      </div>

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
                hasError={!!errors.manufacturer}
                value={formState.manufacturer}
                onChange={(val) => handleStateChange("manufacturer", val)}
                placeholder="Please set manufacturer"
                options={[
                  { value: "RMA", label: "RMA" },
                  { value: "Siemens", label: "Siemens" },
                ]}
              />
              {errors.manufacturer && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.manufacturer}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Serial Number
              </label>
              <Input
                hasError={!!errors.serialNumber}
                value={formState.serialNumber}
                onChange={(e) =>
                  handleStateChange("serialNumber", e.target.value)
                }
                placeholder="Please set serial number"
              />
              {errors.serialNumber && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.serialNumber}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Model
              </label>
              <Input
                hasError={!!errors.model}
                value={formState.model}
                onChange={(e) => handleStateChange("model", e.target.value)}
                placeholder="Please set Device model"
              />
              {errors.model && (
                <p className="text-xs text-red-600 mt-1">{errors.model}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Tag Name
              </label>
              <Input
                hasError={!!errors.tagName}
                value={formState.tagName}
                onChange={(e) => handleStateChange("tagName", e.target.value)}
                placeholder="Please set tag name"
              />
              {errors.tagName && (
                <p className="text-xs text-red-600 mt-1">{errors.tagName}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                G-Size
              </label>
              <Input
                hasError={!!errors.gSize}
                value={formState.gSize}
                onChange={(e) => handleStateChange("gSize", e.target.value)}
                placeholder="Please set G-size"
              />
              {errors.gSize && (
                <p className="text-xs text-red-600 mt-1">{errors.gSize}</p>
              )}
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
                  hasError={!!errors.pmin}
                  value={formState.pmin}
                  onChange={(e) => handleStateChange("pmin", e.target.value)}
                  placeholder="Please set Pmin"
                />
                {errors.pmin && (
                  <p className="text-xs text-red-600 mt-1">{errors.pmin}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">
                  Pmax
                </label>
                <Input
                  hasError={!!errors.pmax}
                  value={formState.pmax}
                  onChange={(e) => handleStateChange("pmax", e.target.value)}
                  placeholder="Please set Pmax"
                />
                {errors.pmax && (
                  <p className="text-xs text-red-600 mt-1">{errors.pmax}</p>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Pressure Unit
              </label>
              <CustomCombobox
                hasError={!!errors.pressureUnit}
                value={formState.pressureUnit}
                onChange={(val) => handleStateChange("pressureUnit", val)}
                placeholder="Select Unit"
                options={[
                  { value: "psi", label: "psi" },
                  { value: "bar", label: "bar" },
                  { value: "kPa", label: "kPa" },
                ]}
              />
              {errors.pressureUnit && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.pressureUnit}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Correction Coefficient
              </label>
              <Input
                hasError={!!errors.correctionCoefficient}
                value={formState.correctionCoefficient}
                onChange={(e) =>
                  handleStateChange("correctionCoefficient", e.target.value)
                }
                placeholder="Enter value"
              />
              {errors.correctionCoefficient && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.correctionCoefficient}
                </p>
              )}
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
