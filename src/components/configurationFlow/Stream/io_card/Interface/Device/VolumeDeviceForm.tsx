import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import type { DeviceConfig } from "../../../../../../types/device";
import type { Device } from "../../../../../../stores/Device";
import BridgeComponent from "../BridgeComponent";

// Helper component for a standard text input
interface InputProps extends React.ComponentPropsWithoutRef<"input"> {}
const Input = (props: InputProps) => (
  <input
    {...props}
    className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm placeholder:text-gray-400 shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
  />
);

// *** PROPS HAVE BEEN UPDATED ***
interface VolumeDeviceFormProps {
  onBack: () => void;
  onSave: (config: DeviceConfig) => void;
  interface_type: string;
  device?: Device | null;
}

const VolumeDeviceForm: React.FC<VolumeDeviceFormProps> = observer(
  ({ onBack, onSave, interface_type, device }) => {
    console.log("VolumeDeviceFormProps: ", device);
    const [activeTab, setActiveTab] = useState<"general" | "parameters">(
      "general"
    );

    // Define the full shape of the form's state
    const [formState, setFormState] = useState({
      manufacturer: "",
      serial_number: "",
      model: "",
      tag_name: "",
      build_year: "",
      min_volume: "",
      max_volume: "",
      version: "",
      modbus_settings: {
        slave_address: "",
        register_address: "",
        register_count: "",
        data_type: "Float32",
      },
      pollingAddress: "",
      commandSet: "Universal",
      variableType: "",
    });

    useEffect(() => {
      if (device) {
        const config = device.config;
        const baseState = {
          manufacturer: config.manufacturer ?? "",
          serial_number: config.serial_number ?? "",
          model: config.model ?? "",
          tag_name: config.tag_name ?? "",
          build_year: config.build_year ?? "",
          version: config.version ?? "",
          min_volume: String(config.min_volume ?? ""),
          max_volume: String(config.max_volume ?? ""),
          modbus_settings: {
            slave_address: config.modbus_settings?.slave_address ?? "",
            register_address: config.modbus_settings?.register_address ?? "",
            register_count: config.modbus_settings?.register_count ?? "",
            data_type: config.modbus_settings?.data_type ?? "Float32",
          },
          commandSet: config.commandSet ?? "Universal",
          pollingAddress: "",
          variableType: "",
        };

        if (interface_type === "HartInterface" && config.device_id) {
          const hartIdRegex = /T(\d+)(P|S)$/;
          const match = config.device_id.match(hartIdRegex);
          if (match) {
            baseState.pollingAddress = match[1];
            baseState.variableType = match[2];
          }
        }
        setFormState((prevState) => ({ ...prevState, ...baseState }));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [device, interface_type]);

    const handleStateChange = (field: string, value: string) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
    };

    const handleModbusChange = (field: string, value: string) => {
      setFormState((prev) => ({
        ...prev,
        modbus_settings: {
          ...prev.modbus_settings,
          [field]: value,
        },
      }));
    };

    // *** SAVE LOGIC IS NOW SIMPLER ***
    const validateAndSave = () => {
      const { modbus_settings, ...restOfState } = formState;

      const finalConfig: DeviceConfig = {
        ...restOfState,
        device_id: device?.id || "",
        device_type: "VolumeDevice",
        min_volume: parseFloat(formState.min_volume) || 0,
        max_volume: parseFloat(formState.max_volume) || 0,
      };

      if (interface_type === "ModbusInterface") {
        finalConfig.modbus_settings = {
          slave_address: modbus_settings.slave_address,
          register_address: modbus_settings.register_address,
          register_count: modbus_settings.register_count,
          data_type: modbus_settings.data_type,
        };
      }

      onSave(finalConfig);
    };

    return (
      <div className="flex flex-col space-y-6">
        {/* *** LIVE DATA DISPLAY *** */}
        <div className="grid grid-cols-3 gap-4 text-slate-500 text-sm p-3 border rounded-lg bg-gray-50">
          <div className="truncate">
            Timestamp:{" "}
            <span className="font-medium text-gray-700">
              {device?.config.data?.timestamp ?? "N/A"}
            </span>
          </div>
          <div className="truncate">
            Status:{" "}
            <span className="font-medium text-gray-700">
              {device?.config.data?.status ?? "N/A"}
            </span>
          </div>
          <div className="truncate">
            Live Value:{" "}
            <span className="font-medium text-gray-700">
              {typeof device?.config.data?.value === "number"
                ? device.config.data.value.toFixed(5)
                : device?.config.data?.value ?? "N/A"}
            </span>
          </div>
        </div>

        {/* --- Conditional Rendering Logic for the Bridge --- */}
        {interface_type === "HartInterface" && (
          <BridgeComponent
            interface_type={interface_type}
            formState={formState}
            errors={{}}
            handleStateChange={handleStateChange}
          />
        )}
        {interface_type === "ModbusInterface" && (
          <BridgeComponent
            interface_type={interface_type}
            formState={formState.modbus_settings}
            errors={{}}
            handleStateChange={handleModbusChange}
          />
        )}

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
            onClick={validateAndSave}
            className="px-6 py-2 rounded-full font-semibold text-sm bg-yellow-400 text-black hover:bg-yellow-500 transition-colors shadow-sm"
          >
            Save
          </button>
        </div>
      </div>
    );
  }
);

export default VolumeDeviceForm;
