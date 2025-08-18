// src/components/configurationFlow/VolumeDeviceForm.tsx
import React, { useState } from "react";
import { observer } from "mobx-react-lite"; // 1. IMPORT OBSERVER
import type { DeviceConfig } from "../../../../../../types/device";
import BridgeComponent from "../BridgeComponent";

interface InputProps extends React.ComponentPropsWithoutRef<"input"> {}
const Input = (props: InputProps) => (
  <input
    {...props}
    className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm placeholder:text-gray-400 shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
  />
);

interface VolumeDeviceFormProps {
  onBack: () => void;
  onSave: (config: DeviceConfig) => void;
  interface_type: string;
  initialData?: DeviceConfig | any;
  interface_id: string;
}

// Wrap component definition with observer
const VolumeDeviceForm: React.FC<VolumeDeviceFormProps> = observer(
  ({ onBack, onSave, interface_type, initialData, interface_id }) => {
    const [activeTab, setActiveTab] = useState<"general" | "parameters">(
      "general"
    );

    // 2. REMOVE useEffect and USE LAZY INITIALIZATION FOR useState
    const [formState, setFormState] = useState(() => {
      // This function runs only ONCE on initial render
      const defaultState = {
        manufacturer: "Omega Traders",
        serial_number: "SN-123456",
        model: "2023",
        tag_name: "RMA",
        build_year: "2023",
        min_volume: "",
        max_volume: "",
        version: "v1.0",
        modbus_settings: {
          slave_id: "",
          register_address: "",
          register_count: "",
          data_type: "Float32",
        },
      };

      if (initialData) {
        return {
          ...defaultState,
          manufacturer: initialData.manufacturer ?? "",
          serial_number: initialData.serial_number ?? "",
          model: initialData.model ?? "",
          tag_name: initialData.tag_name ?? "",
          build_year: initialData.build_year ?? "",
          min_volume: String(initialData.min_volume ?? ""),
          max_volume: String(initialData.max_volume ?? ""),
          version: initialData.version ?? "",
          // Safely merge modbus_settings
          modbus_settings: initialData.modbus_settings
            ? {
                ...defaultState.modbus_settings,
                ...initialData.modbus_settings,
              }
            : defaultState.modbus_settings,
        };
      }

      return defaultState;
    });

    // --- No more useEffect ---

    // General handler for top-level state changes
    const handleStateChange = (field: string, value: string) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
    };

    // 3. ADD a specific handler for nested modbus_settings
    const handleModbusChange = (field: string, value: string) => {
      setFormState((prev) => ({
        ...prev,
        modbus_settings: {
          ...prev.modbus_settings,
          [field]: value,
        },
      }));
    };

    // 6. REFINE the submit handler
    const handleSubmit = () => {
      const { modbus_settings, ...restOfState } = formState;

      const finalConfig: DeviceConfig = {
        ...restOfState,
        device_id: initialData?.device_id || interface_id,
        device_type: "VolumeDevice",
        min_volume: parseFloat(formState.min_volume) || 0,
        max_volume: parseFloat(formState.max_volume) || 0,
      };

      if (interface_type === "ModbusInterface") {
        finalConfig.modbus_settings = {
          slave_address: modbus_settings.slave_id,
          register_address: modbus_settings.register_address,
          register_count: modbus_settings.register_count,
          data_type: modbus_settings.data_type,
        };
      }

      onSave(finalConfig);
    };

    return (
      <div className="flex flex-col space-y-6">
        <div className="flex justify-start items-center gap-6 text-blue-400">
          <div>Status: {initialData?.data?.status ?? "N/A"}</div>
          <div>
            Timestamp:{" "}
            {initialData?.data?.timestamp
              ? new Date(initialData.data.timestamp * 1000).toLocaleTimeString(
                  [],
                  {
                    hour12: false,
                  }
                )
              : "N/A"}
          </div>
          <div>Value: {initialData?.data?.value ?? "N/A"}</div>
        </div>

        {/* 4. UPDATE BridgeComponent props */}
        {interface_type === "ModbusInterface" && (
          <BridgeComponent
            interface_type={interface_type}
            formState={formState.modbus_settings} // Pass the nested object
            errors={{}}
            handleStateChange={handleModbusChange} // Pass the specific handler
          />
        )}
        {/* Add other interface types like HART if needed */}

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
                <Input
                  value={formState.manufacturer}
                  onChange={(e) =>
                    handleStateChange("manufacturer", e.target.value)
                  }
                  placeholder="Set manufacturer"
                />
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
                  onChange={(e) =>
                    handleStateChange("tag_name", e.target.value)
                  }
                  placeholder="Set tag name"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">
                  Version
                </label>
                <Input
                  value={formState.version}
                  onChange={(e) => handleStateChange("version", e.target.value)}
                  placeholder="v1.2"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">
                  Build Year
                </label>
                <Input
                  value={formState.build_year}
                  onChange={(e) =>
                    handleStateChange("build_year", e.target.value)
                  }
                  placeholder="e.g. 2023"
                />
              </div>
            </div>
          )}
          {activeTab === "parameters" && (
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 animate-fadeIn">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">
                  Min Volume
                </label>
                <Input
                  type="number"
                  value={formState.min_volume}
                  onChange={(e) =>
                    handleStateChange("min_volume", e.target.value)
                  }
                  placeholder="Set Min Volume"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">
                  Max Volume
                </label>
                <Input
                  type="number"
                  value={formState.max_volume}
                  onChange={(e) =>
                    handleStateChange("max_volume", e.target.value)
                  }
                  placeholder="Set Max Volume"
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
            onClick={handleSubmit}
            className="px-6 py-2 rounded-full font-semibold text-sm bg-yellow-400 text-black hover:bg-yellow-500 transition-colors shadow-sm"
          >
            Save
          </button>
        </div>
      </div>
    );
  }
); // 7. WRAP the component here

export default VolumeDeviceForm;
