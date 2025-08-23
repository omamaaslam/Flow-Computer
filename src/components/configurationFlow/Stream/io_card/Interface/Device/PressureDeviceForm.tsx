import React, { useState, useEffect } from "react";
import type { DeviceConfig } from "../../../../../../types/device";
import BridgeComponent from "../BridgeComponent";
import { observer } from "mobx-react-lite";
import type { Device } from "../../../../../../stores/Device";

// Helper component for a standard text input
interface InputProps extends React.ComponentPropsWithoutRef<"input"> {}
const Input = (props: InputProps) => (
  <input
    {...props}
    className="w-full border rounded-md py-1.5 px-3 text-sm placeholder:text-gray-400 shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 border-gray-300"
  />
);

// *** PROPS HAVE BEEN UPDATED ***
interface PressureDeviceFormProps {
  onBack: () => void;
  onSave: (config: DeviceConfig) => void;
  interface_type: string;
  device?: Device | null; // This is the new primary prop for data
}

// *** COMPONENT IS NOW A MOBX OBSERVER ***
const PressureDeviceForm: React.FC<PressureDeviceFormProps> = observer(
  ({ onBack, onSave, interface_type, device }) => {
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
      version: "",
      pressure_min: "",
      pressure_max: "",
      unit: "Pascal",
      scaling_factor: "",
      offset: "",
      correction_c0: "",
      correction_c1: "",
      correction_c2: "",
      correction_c3: "",
      modbus_settings: {
        slave_address: "",
        register_address: "",
        register_count: "",
        data_type: "Float32",
      },
      // HART-specific fields (transient, not saved directly)
      pollingAddress: "",
      commandSet: "Universal",
      variableType: "",
    });

    // *** USEEFFECT NOW POPULATES FROM THE 'device' PROP ***
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
          pressure_min: String(config.pressure_min ?? ""),
          pressure_max: String(config.pressure_max ?? ""),
          unit: config.unit ?? "Pascal",
          scaling_factor: String(config.scaling_factor ?? ""),
          offset: String(config.offset ?? ""),
          correction_c0: String(config.correction_c0 ?? ""),
          correction_c1: String(config.correction_c1 ?? ""),
          correction_c2: String(config.correction_c2 ?? ""),
          correction_c3: String(config.correction_c3 ?? ""),
          modbus_settings: config.modbus_settings ?? formState.modbus_settings,
          commandSet: config.commandSet ?? "Universal",
          // Default empty values for transient HART fields
          pollingAddress: "",
          variableType: "",
        };

        // Special logic for HART: parse the device_id to fill transient fields
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
      const safeParseFloat = (val: string) =>
        val && !isNaN(parseFloat(val)) ? parseFloat(val) : 0;

      const { modbus_settings, ...restOfState } = formState;

      // Build the main config object
      const finalConfig: DeviceConfig = {
        ...restOfState,
        device_id: device?.id || "", // Use existing ID if editing
        device_type: "PressureDevice",
        pressure_min: safeParseFloat(formState.pressure_min),
        pressure_max: safeParseFloat(formState.pressure_max),
        scaling_factor: safeParseFloat(formState.scaling_factor),
        offset: safeParseFloat(formState.offset),
        correction_c0: safeParseFloat(formState.correction_c0),
        correction_c1: safeParseFloat(formState.correction_c1),
        correction_c2: safeParseFloat(formState.correction_c2),
        correction_c3: safeParseFloat(formState.correction_c3),
        unit: formState.unit as any,
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

    const pressureUnitOptions = [
      { value: "Bar", label: "Bar" },
      { value: "Pascal", label: "Pascal" },
      { value: "Pa", label: "Pa" },
      { value: "PSI", label: "PSI" },
    ];

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
                  Build Year
                </label>
                <Input
                  value={formState.build_year}
                  onChange={(e) =>
                    handleStateChange("build_year", e.target.value)
                  }
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
            </div>
          )}

          {activeTab === "parameters" && (
            <div className="flex flex-col space-y-4 animate-fadeIn">
              <div className="grid grid-cols-2 gap-x-6">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-600">
                    Minimum Pressure
                  </label>
                  <Input
                    value={formState.pressure_min}
                    onChange={(e) =>
                      handleStateChange("pressure_min", e.target.value)
                    }
                    placeholder="Set Pmin"
                    type="number"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-600">
                    Maximum Pressure
                  </label>
                  <Input
                    value={formState.pressure_max}
                    onChange={(e) =>
                      handleStateChange("pressure_max", e.target.value)
                    }
                    placeholder="Set Pmax"
                    type="number"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">
                  Pressure Unit
                </label>
                <select
                  value={formState.unit}
                  onChange={(e) => handleStateChange("unit", e.target.value)}
                  className="w-full border rounded-md py-1.5 px-3 text-sm border-gray-300"
                >
                  {pressureUnitOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-x-6">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-600">
                    Scaling Factor
                  </label>
                  <Input
                    value={formState.scaling_factor}
                    onChange={(e) =>
                      handleStateChange("scaling_factor", e.target.value)
                    }
                    placeholder="e.g., 1.0"
                    type="number"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-600">
                    Offset
                  </label>
                  <Input
                    value={formState.offset}
                    onChange={(e) =>
                      handleStateChange("offset", e.target.value)
                    }
                    placeholder="e.g., -0.1"
                    type="number"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">
                  Correction Coefficients
                </label>
                <div className="grid grid-cols-4 gap-x-3">
                  <Input
                    value={formState.correction_c0}
                    onChange={(e) =>
                      handleStateChange("correction_c0", e.target.value)
                    }
                    placeholder="C0"
                    type="number"
                  />
                  <Input
                    value={formState.correction_c1}
                    onChange={(e) =>
                      handleStateChange("correction_c1", e.target.value)
                    }
                    placeholder="C1"
                    type="number"
                  />
                  <Input
                    value={formState.correction_c2}
                    onChange={(e) =>
                      handleStateChange("correction_c2", e.target.value)
                    }
                    placeholder="C2"
                    type="number"
                  />
                  <Input
                    value={formState.correction_c3}
                    onChange={(e) =>
                      handleStateChange("correction_c3", e.target.value)
                    }
                    placeholder="C3"
                    type="number"
                  />
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
            className="px-6 py-2 rounded-full font-semibold text-sm bg-yellow-400 text-black hover:bg-yellow-500 transition-colors shadow-sm"
          >
            Save
          </button>
        </div>
      </div>
    );
  }
);

export default PressureDeviceForm;
