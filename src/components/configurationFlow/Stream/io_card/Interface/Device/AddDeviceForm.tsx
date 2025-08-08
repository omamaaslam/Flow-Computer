import React, { useState, useRef, useEffect, useMemo } from "react";
import ReactDOM from "react-dom";

const CustomCombobox = ({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openDropdown = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        position: "fixed",
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
    setIsOpen(true);
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openDropdown}
        className="w-full border border-gray-300 rounded-md py-2 px-3 text-left shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 flex justify-between items-center"
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen &&
        ReactDOM.createPortal(
          <div
            ref={dropdownRef}
            style={position}
            className="z-[9999] bg-white rounded-md shadow-lg border border-gray-200"
          >
            <div className="max-h-60 sm:max-h-40 overflow-y-auto p-1">
              {options
                .filter((option) => option.value !== value)
                .map((option) => (
                  <div
                    key={option.value}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className="p-2 rounded-md cursor-pointer text-sm hover:bg-yellow-100"
                  >
                    {option.label}
                  </div>
                ))}
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

interface AddDeviceFormProps {
  onClose: () => void;
  onNext: (deviceType: string) => void;
  interfaceId: string;
}

const allDeviceOptions = [
  { value: "TemperatureDevice", label: "Temperature" },
  { value: "PressureDevice", label: "Pressure" },
  { value: "VolumeDevice", label: "Volume" },
  { value: "PulseVolumeDevice", label: "Pulse Volume" },
  { value: "FlowRateDevice", label: "Flow Rate" },
  { value: "PulseFlowRateDevice", label: "Pulse Flow Rate" },
  { value: "CH4", label: "Methanes" },
  { value: "N2", label: "Nitrogen" },
  { value: "CO2", label: "Carbon Dioxide" },
  { value: "C2H6", label: "Ethane" },
  { value: "C3H8", label: "Propane" },
  { value: "H2O", label: "Water" },
  { value: "H2S", label: "Hydrogen sulfides" },
  { value: "H2", label: "Hydrogen" },
  { value: "CO", label: "Carbon monoxide" },
  { value: "O2", label: "Oxygen" },
  { value: "IC4H10", label: "i-Butane" },
  { value: "C4H10", label: "n-butane" },
  { value: "IC5H12", label: "i-Pentane" },
  { value: "C5H12", label: "n-Pentanes" },
  { value: "C6H14", label: "n-hexanes" },
  { value: "C7H16", label: "n-heptanes" },
  { value: "C8H18", label: "n-octanes" },
  { value: "C9H20", label: "n-Nonane" },
  { value: "C10H22", label: "n-Decane" },
  { value: "HE", label: "Helium" },
  { value: "AR", label: "Argon" },
  { value: "HI", label: "heating value" },
  { value: "RD", label: "density ratio" },
  { value: "WI", label: "Wobbe index" },
];

const AddDeviceForm: React.FC<AddDeviceFormProps> = ({
  onClose,
  onNext,
  interfaceId,
}) => {
  const [selectedType, setSelectedType] = useState<string>("");

  const filteredOptions = useMemo(() => {
    const id = interfaceId.toUpperCase();
    if (id === "TI1") {
      return allDeviceOptions.filter(
        (opt) => opt.value === "TemperatureDevice"
      );
    }
    if (id === "HI1" || id === "HI2") {
      return allDeviceOptions.filter((opt) =>
        ["TemperatureDevice", "PressureDevice"].includes(opt.value)
      );
    }
    if (id.startsWith("DI")) {
      return allDeviceOptions.filter((opt) => opt.value === "VolumeDevice");
    }
    const specialDevices = [
      "TemperatureDevice",
      "PressureDevice",
      "VolumeDevice",
    ];
    return allDeviceOptions.filter(
      (opt) => !specialDevices.includes(opt.value)
    );
  }, [interfaceId]);

  useEffect(() => {
    if (
      selectedType &&
      !filteredOptions.some((opt) => opt.value === selectedType)
    ) {
      setSelectedType("");
    }
  }, [filteredOptions, selectedType]);

  const handleNextClick = () => {
    if (selectedType) {
      onNext(selectedType);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Device Type
        </label>
        <CustomCombobox
          value={selectedType}
          onChange={setSelectedType}
          options={filteredOptions}
          placeholder="Please select a device type"
        />
      </div>
      <div className="flex justify-end gap-3 pt-8 mt-4 border-t border-gray-200">
        <button
          onClick={onClose}
          className="px-6 py-2 rounded-full font-semibold text-sm bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors shadow-sm"
        >
          Cancel
        </button>
        <button
          onClick={handleNextClick}
          disabled={!selectedType}
          className="px-6 py-2 rounded-full font-semibold text-sm bg-yellow-400 text-black hover:bg-yellow-500 transition-colors shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </>
  );
};

export default AddDeviceForm;
