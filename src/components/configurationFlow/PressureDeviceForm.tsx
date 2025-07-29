    import React, { useState, useRef, useEffect, useMemo } from "react";
import BridgeComponent from "./BridgeComponent";

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
  g_size: "",
  pmin: "",
  pmax: "",
  pressureUnit: "psi",
  coeff1: "",
  coeff2: "",
  coeff3: "",
  coeff4: "",
};

interface PressureDeviceFormProps {
  onBack: () => void;
  onSave: (config: any) => void;
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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleStateChange = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const getRequiredFields = () => {
    const baseFields = [
      "manufacturer",
      "serial_number",
      "model",
      "tag_name",
      "pmin",
      "pmax",
    ];
    if (interfaceName === "MOD") {
      return [
        ...baseFields,
        "slaveId",
        "register_count",
        "register_address",
        "data_type",
      ];
    }
    if (interfaceName.includes("HART")) {
      return [...baseFields, "pollingAddress", "commandSet", "variableType"];
    }
    return baseFields;
  };

  const requiredFields = getRequiredFields();

  const numericFields = [
    "slaveId",
    "register_count",
    "register_address",
    "pollingAddress",
    "g_size",
    "pmin",
    "pmax",
    "coeff1",
    "coeff2",
    "coeff3",
    "coeff4",
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
    const newErrors: Record<string, string> = {};
    requiredFields.forEach((field) => {
      if (!formState[field as keyof typeof formState]?.trim())
        newErrors[field] = "This field is required.";
    });
    numericFields.forEach((field) => {
      const value = formState[field as keyof typeof formState];
      if (value && !/^-?\d*\.?\d*$/.test(value)) {
        newErrors[field] = "Please enter a valid number.";
      }
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
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
          deviceId: "",
          buildYear: null,
          version: "",
        },
        parameters: {
          g_size: formState.g_size ? parseFloat(formState.g_size) : null,
          pmin: formState.pmin ? parseFloat(formState.pmin) : null,
          pmax: formState.pmax ? parseFloat(formState.pmax) : null,
          pressureUnit: formState.pressureUnit,
          coeff1: formState.coeff1 ? parseFloat(formState.coeff1) : null,
          coeff2: formState.coeff2 ? parseFloat(formState.coeff2) : null,
          coeff3: formState.coeff3 ? parseFloat(formState.coeff3) : null,
          coeff4: formState.coeff4 ? parseFloat(formState.coeff4) : null,
        },
      };
      onSave(finalConfig);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <BridgeComponent
        interfaceName={interfaceName}
        formState={formState}
        errors={errors}
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
                hasError={!!errors.serial_number}
                value={formState.serial_number}
                onChange={(e) =>
                  handleStateChange("serial_number", e.target.value)
                }
                placeholder="Please set serial number"
              />
              {errors.serial_number && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.serial_number}
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
                hasError={!!errors.tag_name}
                value={formState.tag_name}
                onChange={(e) => handleStateChange("tag_name", e.target.value)}
                placeholder="Please set tag name"
              />
              {errors.tag_name && (
                <p className="text-xs text-red-600 mt-1">{errors.tag_name}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                G-Size
              </label>
              <Input
                hasError={!!errors.g_size}
                value={formState.g_size}
                onChange={(e) => handleStateChange("g_size", e.target.value)}
                placeholder="Please set G-size"
              />
              {errors.g_size && (
                <p className="text-xs text-red-600 mt-1">{errors.g_size}</p>
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
                Correction Coefficients
              </label>
              <div className="grid grid-cols-4 gap-x-3">
                <div>
                  <Input
                    hasError={!!errors.coeff1}
                    value={formState.coeff1}
                    onChange={(e) =>
                      handleStateChange("coeff1", e.target.value)
                    }
                    placeholder="Enter value"
                  />
                  {errors.coeff1 && (
                    <p className="text-xs text-red-600 mt-1">{errors.coeff1}</p>
                  )}
                </div>
                <div>
                  <Input
                    hasError={!!errors.coeff2}
                    value={formState.coeff2}
                    onChange={(e) =>
                      handleStateChange("coeff2", e.target.value)
                    }
                    placeholder="Enter value"
                  />
                  {errors.coeff2 && (
                    <p className="text-xs text-red-600 mt-1">{errors.coeff2}</p>
                  )}
                </div>
                <div>
                  <Input
                    hasError={!!errors.coeff3}
                    value={formState.coeff3}
                    onChange={(e) =>
                      handleStateChange("coeff3", e.target.value)
                    }
                    placeholder="Enter value"
                  />
                  {errors.coeff3 && (
                    <p className="text-xs text-red-600 mt-1">{errors.coeff3}</p>
                  )}
                </div>
                <div>
                  <Input
                    hasError={!!errors.coeff4}
                    value={formState.coeff4}
                    onChange={(e) =>
                      handleStateChange("coeff4", e.target.value)
                    }
                    placeholder="Enter value"
                  />
                  {errors.coeff4 && (
                    <p className="text-xs text-red-600 mt-1">{errors.coeff4}</p>
                  )}
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
