import React from "react";

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
            {options.map((option: { value: string; label: string }) => (
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

const FormField: React.FC<FormFieldProps> = ({ label, children, error }) => (
  <div className="space-y-1">
    <label className="block text-xs font-medium text-gray-600">{label}</label>
    {children}
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

interface MODBridgeProps {
  formState: any;
  errors: any;
  handleStateChange: (field: string, value: string) => void;
}

const MODBridge: React.FC<MODBridgeProps> = ({
  formState,
  errors,
  handleStateChange,
}) => {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
      <FormField label="Slave ID" error={errors.slave_id}>
        <CustomCombobox
          hasError={!!errors.slave_id}
          value={formState.slave_id}
          onChange={(val:any) => handleStateChange("slave_id", val)}
          placeholder="Please set slave ID"
          options={[
            { value: "1", label: "1" },
            { value: "2", label: "2" },
          ]}
        />
      </FormField>
      <FormField label="Register Count" error={errors.register_count}>
        <CustomCombobox
          hasError={!!errors.register_count}
          value={formState.register_count}
          onChange={(val:any) => handleStateChange("register_count", val)}
          placeholder="Number of registers..."
          options={[
            { value: "2", label: "2 (for 1 float32)" },
            { value: "4", label: "4" },
          ]}
        />
      </FormField>
      <FormField label="Register Address" error={errors.register_address}>
        <CustomCombobox
          hasError={!!errors.register_address}
          value={formState.register_address}
          onChange={(val) => handleStateChange("register_address", val)}
          placeholder="Please set register address"
          options={[
            { value: "40001", label: "40001" },
            { value: "40002", label: "40002" },
          ]}
        />
      </FormField>
      <FormField label="Data Type" error={errors.data_type}>
        <CustomCombobox
          hasError={!!errors.data_type}
          value={formState.data_type}
          onChange={(val) => handleStateChange("data_type", val)}
          placeholder="INT16, FLOAT..."
          options={[
            { value: "INT16", label: "INT16" },
            { value: "INT32", label: "INT32" },
            { value: "FLOAT", label: "FLOAT" },
            { value: "DOUBLE", label: "DOUBLE" },
            { value: "STRING", label: "STRING" },
          ]}
        />
      </FormField>
    </div>
  );
};

export default MODBridge;
