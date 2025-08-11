import React from "react";

interface CustomComboboxOption {
  value: string;
  label: string;
}

interface CustomComboboxProps {
  options: CustomComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hasError?: boolean;
}

const CustomCombobox = ({
  options,
  value,
  onChange,
  placeholder,
  hasError,
}: CustomComboboxProps) => {
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
            {options.map((option: CustomComboboxOption) => (
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

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
}

const FormField = ({ label, children, error }: FormFieldProps) => (
  <div className="space-y-1">
    <label className="block text-xs font-medium text-gray-600">{label}</label>
    {children}
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

interface HartBridgeProps {
  formState: any;
  errors: any;
  handleStateChange: (field: string, value: string) => void;
}

const HartBridge: React.FC<HartBridgeProps> = ({
  formState,
  errors,
  handleStateChange,
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <FormField label="Polling Address" error={errors.pollingAddress}>
        <CustomCombobox
          hasError={!!errors.pollingAddress}
          value={formState.pollingAddress}
          onChange={(val) => handleStateChange("pollingAddress", val)}
          placeholder="Hart transducer address (0-15)"
          options={Array.from({ length: 16 }, (_, i) => ({
            value: i.toString(),
            label: i.toString(),
          }))}
        />
      </FormField>
      <div className="grid grid-cols-2 gap-x-6">
        <FormField label="Command Set" error={errors.commandSet}>
          <CustomCombobox
            hasError={!!errors.commandSet}
            value={formState.commandSet}
            onChange={(val) => handleStateChange("commandSet", val)}
            placeholder="Universal/ Common Practice/ Device-Specific"
            options={[
              { value: "Universal", label: "Universal" },
              { value: "Common Practice", label: "Common Practice" },
              { value: "Device-Specific", label: "Device-Specific" },
            ]}
          />
        </FormField>
        <FormField label="Variable Type" error={errors.variableType}>
          <CustomCombobox
            hasError={!!errors.variableType}
            value={formState.variableType}
            onChange={(val) => handleStateChange("variableType", val)}
            placeholder="One of: P, S"
            options={[
              { value: "P", label: "P" },
              { value: "S", label: "S" },
            ]}
          />
        </FormField>
      </div>
    </div>
  );
};

export default HartBridge;
