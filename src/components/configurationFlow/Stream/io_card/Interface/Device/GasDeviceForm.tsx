// src/components/configurationFlow/Interfaces/Device/GasDeviceForm.tsx

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
  interfaceName: string;
  initialData?: DeviceConfig | null;
  deviceTypeLabel: string; // e.g., "Methanes"
}

// --- NEWLY ADDED ---
// Default state for the form
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
  g_size: "G100",
  // Gas-specific field
  gas_value: "0.0",
};
// --- END OF NEWLY ADDED ---

const GasDeviceForm: React.FC<GasDeviceFormProps> = ({
  onBack,
  onSave,
  interfaceName,
  initialData,
  deviceTypeLabel,
}) => {
  // Initialize state with default values
  const [formState, setFormState] = useState(defaultFormState);

  // useEffect now merges initialData (for editing) over the default state
  useEffect(() => {
    if (initialData) {
      // Start with default values and overwrite with any existing data
      setFormState({
        ...defaultFormState,
        slave_id: initialData.slave_id ?? defaultFormState.slave_id,
        register_address:
          initialData.register_address ?? defaultFormState.register_address,
        register_count:
          initialData.register_count ?? defaultFormState.register_count,
        data_type: initialData.data_type ?? defaultFormState.data_type,
        manufacturer: initialData.manufacturer ?? defaultFormState.manufacturer,
        serial_number:
          initialData.serial_number ?? defaultFormState.serial_number,
        model: initialData.model ?? defaultFormState.model,
        tag_name: initialData.tag_name ?? defaultFormState.tag_name,
        g_size: String(initialData.g_size ?? defaultFormState.g_size),
        gas_value: String(initialData.gas_value ?? defaultFormState.gas_value),
      });
    } else {
      // If creating a new device, ensure state is set to defaults
      setFormState(defaultFormState);
    }
  }, [initialData]);

  const handleStateChange = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const finalConfig: DeviceConfig = {
      // Bridge fields
      slave_id: formState.slave_id,
      register_address: formState.register_address,
      register_count: formState.register_count,
      data_type: formState.data_type,
      // General fields
      manufacturer: formState.manufacturer,
      model: formState.model,
      serial_number: formState.serial_number,
      tag_name: formState.tag_name,
      g_size: formState.g_size,
      // Gas-specific field
      gas_value: parseFloat(formState.gas_value) || null,
    };
    onSave(finalConfig);
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-start items-center gap-6 text-blue-400">
        <div>Status: {initialData?.data.status}</div>
        <div>Timestamp: {initialData?.data.timestamp}</div>
        <div>Value: {initialData?.data.value}</div>
      </div>
      <BridgeComponent
        interfaceName={interfaceName}
        formState={formState}
        errors={{}}
        handleStateChange={handleStateChange}
      />

      {/* General fields directly displayed without tabs */}
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
            G-Size
          </label>
          <Input
            value={formState.g_size}
            onChange={(e) => handleStateChange("g_size", e.target.value)}
            placeholder="Set G-size"
          />
        </div>

        {/* New non-editable gas value field */}
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

      {/* Action buttons */}
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
