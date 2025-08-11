import React, { useState, useEffect } from "react";
import type { DeviceConfig } from "../../../../../../types/device";
import BridgeComponent from "../BridgeComponent";

// Reusable Input component
interface InputProps extends React.ComponentPropsWithoutRef<"input"> {}
const Input = (props: InputProps) => (
  <input
    {...props}
    className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm placeholder:text-gray-400 shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
  />
);

interface GasDeviceFormProps {
  onBack: () => void;
  onSave: (config: DeviceConfig) => void;
  interface_type: string;
  initialData?: DeviceConfig | null;
  deviceTypeLabel: string;
  interface_id: string;
}

// Default state for the form, including ALL required fields
const defaultFormState = {
  // BridgeComponent state
  slave_id: "1",
  register_address: "40001",
  register_count: "2",
  data_type: "FLOAT",
  // General fields state
  manufacturer: "Default Manufacturer",
  serial_number: "SN-12345",
  model: "Model-X",
  tag_name: "Gas-Device-Tag",
  build_year: "2025",
  version: "v1.0",
  // Gas-specific field
  gas_value: "0.0",
};

const GasDeviceForm: React.FC<GasDeviceFormProps> = ({
  onBack,
  onSave,
  interface_type,
  initialData,
  deviceTypeLabel,
  interface_id
}) => {
  const [formState, setFormState] = useState(defaultFormState);

  useEffect(() => {
    // Explicitly type `data` to let TypeScript know its shape
    const data: Partial<DeviceConfig> = initialData || {};
    const interfaceSpecificData: any = initialData || {}; // For gas devices, bridge data is part of the main config

    setFormState({
      // Start with default values and overwrite with any existing data
      slave_id: String(
        interfaceSpecificData.slave_id ?? defaultFormState.slave_id
      ),
      register_address: String(
        interfaceSpecificData.register_address ??
          defaultFormState.register_address
      ),
      register_count: String(
        interfaceSpecificData.register_count ?? defaultFormState.register_count
      ),
      data_type: interfaceSpecificData.data_type ?? defaultFormState.data_type,
      manufacturer: data.manufacturer ?? defaultFormState.manufacturer,
      serial_number: data.serial_number ?? defaultFormState.serial_number,
      model: data.model ?? defaultFormState.model,
      tag_name: data.tag_name ?? defaultFormState.tag_name,
      build_year: data.build_year ?? defaultFormState.build_year,
      version: data.version ?? defaultFormState.version,
      gas_value: String(data.gas_value ?? defaultFormState.gas_value),
    });
  }, [initialData]);

  const handleStateChange = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const safeParseFloat = (val: string) =>
      val && !isNaN(parseFloat(val)) ? parseFloat(val) : 0;
    const safeParseInt = (val: string) =>
      val && !isNaN(parseInt(val, 10)) ? parseInt(val, 10) : 0;

    // Construct the final config, ensuring all required fields are present
    const finalConfig: DeviceConfig = {
      device_id: `${interface_id}D`,
      // General fields
      manufacturer: formState.manufacturer,
      model: formState.model,
      serial_number: formState.serial_number,
      tag_name: formState.tag_name,
      build_year: formState.build_year,
      version: formState.version,
      // Bridge fields (for gas devices, these are part of the main config)
      slave_address: safeParseInt(formState.slave_id),
      register_address: safeParseInt(formState.register_address),
      register_count: safeParseInt(formState.register_count),
      data_type: formState.data_type,
      // Gas-specific field
      gas_value: safeParseFloat(formState.gas_value),
    };
    onSave(finalConfig);
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-start items-center gap-6 text-slate-400">
        <div>Status: {initialData?.data?.status ?? "N/A"}</div>
        <div>Timestamp: {initialData?.data?.timestamp ?? "N/A"}</div>
        <div>Value: {initialData?.data?.value ?? "N/A"}</div>
      </div>

      <BridgeComponent
        interface_type={interface_type}
        formState={formState}
        errors={{}}
        handleStateChange={handleStateChange}
      />

      <div className="grid grid-cols-2 gap-x-6 gap-y-4 animate-fadeIn border-t pt-6">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-600">
            Device Manufacturer
          </label>
          <Input
            value={formState.manufacturer}
            onChange={(e) => handleStateChange("manufacturer", e.target.value)}
            placeholder="Set manufacturer"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-600">
            Serial Number
          </label>
          <Input
            value={formState.serial_number}
            onChange={(e) => handleStateChange("serial_number", e.target.value)}
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
            Build Year
          </label>
          <Input
            value={formState.build_year}
            onChange={(e) => handleStateChange("build_year", e.target.value)}
            placeholder="e.g., 2025"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-600">
            Version
          </label>
          <Input
            value={formState.version}
            onChange={(e) => handleStateChange("version", e.target.value)}
            placeholder="e.g., v1.0"
          />
        </div>

        <div className="space-y-1 col-span-2">
          <label className="block text-xs font-medium text-gray-600">
            {deviceTypeLabel}
          </label>
          <div className="relative">
            <Input
              value={formState.gas_value}
              onChange={(e) => handleStateChange("gas_value", e.target.value)}
              placeholder="Set value"
              type="number"
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 text-sm pointer-events-none">
              %mol
            </span>
          </div>
        </div>
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

export default GasDeviceForm;
