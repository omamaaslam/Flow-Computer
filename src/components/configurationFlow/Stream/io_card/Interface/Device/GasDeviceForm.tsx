import React, { useState, useEffect } from "react";
// Make sure this path points to your updated type definitions
import type { DeviceConfig } from "../../../../../../types/device";
import BridgeComponent from "../BridgeComponent";

// --- REUSABLE INPUT COMPONENT (Unchanged) ---
interface InputProps extends React.ComponentPropsWithoutRef<"input"> {}
const Input = (props: InputProps) => (
  <input
    {...props}
    className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm placeholder:text-gray-400 shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
  />
);

// --- COMPONENT PROPS (Unchanged) ---
interface GasDeviceFormProps {
  onBack: () => void;
  onSave: (config: DeviceConfig) => void;
  interface_type: string;
  initialData?: DeviceConfig | any;
  deviceTypeLabel: string;
  interface_id: string;
}

// --- UPDATED DEFAULT STATE with Nested Structure ---
const defaultFormState = {
  // General fields state
  manufacturer: "",
  serial_number: "",
  model: "",
  tag_name: "",
  build_year: "",
  version: "",
  gas_value: "",
  modbus_settings: {
    slave_address: "",
    register_address: "",
    register_count: "",
    data_type: "",
  },
};

const GasDeviceForm: React.FC<GasDeviceFormProps> = ({
  onBack,
  onSave,
  interface_type,
  initialData,
  deviceTypeLabel,
  interface_id,
}) => {
  const [formState, setFormState] = useState(defaultFormState);
  console.log("GasDeviceForm initialData", initialData);
  // --- [FIXED] UPDATED useEffect for Data Hydration with Nested State ---
  useEffect(() => {
    if (initialData) {
      setFormState({
        manufacturer: initialData.manufacturer ?? defaultFormState.manufacturer,
        serial_number:
          initialData.serial_number ?? defaultFormState.serial_number,
        model: initialData.model ?? defaultFormState.model,
        tag_name: initialData.tag_name ?? defaultFormState.tag_name,
        build_year: initialData.build_year ?? defaultFormState.build_year,
        version: initialData.version ?? defaultFormState.version,
        gas_value: String(initialData.gas_value ?? defaultFormState.gas_value),
        modbus_settings: {
          slave_address: String(
            initialData.modbus_settings?.slave_address ?? // Use optional chaining
              defaultFormState.modbus_settings.slave_address
          ),
          register_address: String(
            initialData.modbus_settings?.register_address ?? // Use optional chaining
              defaultFormState.modbus_settings.register_address
          ),
          register_count: String(
            initialData.modbus_settings?.register_count ?? // Use optional chaining
              defaultFormState.modbus_settings.register_count
          ),
          data_type:
            initialData.modbus_settings?.data_type ?? // Use optional chaining
            defaultFormState.modbus_settings.data_type,
        },
      });
    } else {
      // Reset to default if there is no initial data
      setFormState(defaultFormState);
    }
  }, [initialData]);
  console.warn("GasDevice", formState);
  // --- UPDATED handleStateChange to manage nested state ---
  const handleStateChange = (
    field: string,
    value: string,
    group?: "modbus_settings"
  ) => {
    if (group) {
      setFormState((prev) => ({
        ...prev,
        [group]: {
          ...prev[group],
          [field]: value,
        },
      }));
    } else {
      setFormState((prev) => ({ ...prev, [field]: value }));
    }
  };

  // --- [FIXED] UPDATED handleSubmit to build the new payload structure ---
  const handleSubmit = () => {
    const safeParseFloat = (val: string) =>
      val && !isNaN(parseFloat(val)) ? parseFloat(val) : 0;
    // const safeParseInt = (val: string) =>
    //   val && !isNaN(parseInt(val, 10)) ? parseInt(val, 10) : 0;

    const finalConfig: DeviceConfig = {
      device_id: interface_id,
      device_type: deviceTypeLabel,
      // General fields
      manufacturer: formState.manufacturer,
      model: formState.model,
      serial_number: formState.serial_number,
      tag_name: formState.tag_name,
      build_year: formState.build_year,
      version: formState.version,
      gas_value: safeParseFloat(formState.gas_value),
      // Nested modbus_settings object
      modbus_settings: {
        slave_id: formState.modbus_settings.slave_address,
        // slave_address: formState.modbus_settings.slave_address,
        register_address: formState.modbus_settings.register_address,
        register_count: formState.modbus_settings.register_count,
        data_type: formState.modbus_settings.data_type,
      },
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

      {/* --- Pass nested state and a specialized handler to BridgeComponent --- */}
      <BridgeComponent
        interface_type={interface_type}
        formState={formState.modbus_settings}
        errors={{}}
        handleStateChange={(field, value) => {
          const stateField = field === "slave_id" ? "slave_address" : field;
          handleStateChange(stateField, value, "modbus_settings");
        }}
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
