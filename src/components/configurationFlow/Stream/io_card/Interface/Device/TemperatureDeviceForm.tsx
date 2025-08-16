import React, { useState, useEffect } from "react";
import type { DeviceConfig } from "../../../../../../types/device";
import BridgeComponent from "../BridgeComponent";

interface InputProps extends React.ComponentPropsWithoutRef<"input"> {}
const Input = (props: InputProps) => (
  <input
    {...props}
    className="w-full border rounded-md py-1.5 px-3 text-sm placeholder:text-gray-400 shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 border-gray-300"
  />
);

interface TemperatureDeviceFormProps {
  onBack: () => void;
  onSave: (config: DeviceConfig) => void;
  interface_type: string;
  initialData?: DeviceConfig | null;
}

const TemperatureDeviceForm: React.FC<TemperatureDeviceFormProps> = ({
  onBack,
  onSave,
  interface_type,
  initialData,
}) => {
  const [activeTab, setActiveTab] = useState<"general" | "parameters">(
    "general"
  );
  
  // A single state object that holds data for ALL possible fields.
  const [formState, setFormState] = useState({
    manufacturer: "",
    serial_number: "",
    model: "",
    tag_name: "",
    build_year: "",
    version: "",
    temp_min: "",
    temp_max: "",
    unit: "Celsius",
    scaling_factor: "",
    offset: "",
    correction_c0: "",
    correction_c1: "",
    correction_c2: "",
    correction_c3: "",
    // HART-specific fields (flat structure, live at the top level)
    pollingAddress: "",
    commandSet: "Universal",
    variableType: "",
    // Modbus-specific fields (nested structure)
    modbus_settings: {
      slave_id: "",
      register_address: "",
      register_count: "",
      data_type: "Float32",
    },
  });

  useEffect(() => {
    let baseState = { ...formState };

    if (initialData) {
      // Populate all general, parameter, and potentially saved bridge fields
      baseState = {
        ...baseState,
        manufacturer: initialData.manufacturer ?? "",
        serial_number: initialData.serial_number ?? "",
        model: initialData.model ?? "",
        tag_name: initialData.tag_name ?? "",
        build_year: initialData.build_year ?? "",
        version: initialData.version ?? "",
        temp_min: String(initialData.temp_min ?? ""),
        temp_max: String(initialData.temp_max ?? ""),
        unit: initialData.unit ?? "Celsius",
        scaling_factor: String(initialData.scaling_factor ?? ""),
        offset: String(initialData.offset ?? ""),
        correction_c0: String(initialData.correction_c0 ?? ""),
        correction_c1: String(initialData.correction_c1 ?? ""),
        correction_c2: String(initialData.correction_c2 ?? ""),
        correction_c3: String(initialData.correction_c3 ?? ""),
        commandSet: initialData.commandSet ?? "Universal", // HART field
        // Safely merge modbus_settings if they exist in initialData
        modbus_settings: initialData.modbus_settings 
          ? { ...baseState.modbus_settings, ...initialData.modbus_settings } 
                    : baseState.modbus_settings
      };

      // Special logic for HART: parse the device_id to fill transient fields
      if (interface_type === 'HartInterface' && initialData.device_id) {
        const hartIdRegex = /(S|P)(\d+)$/;
        const match = initialData.device_id.match(hartIdRegex);
        if (match) {
          baseState.variableType = match[1];
          baseState.pollingAddress = match[2];
        }
      }
    }
    setFormState(baseState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, interface_type]);

  // General handler for top-level state properties (e.g., manufacturer, pollingAddress)
  const handleStateChange = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  // Specific handler for the nested `modbus_settings` object
  const handleModbusChange = (field: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      modbus_settings: {
        ...prev.modbus_settings,
        [field]: value,
      },
    }));
  };

  const validateAndSave = () => {
    const safeParseFloat = (val: string) => (val && !isNaN(parseFloat(val)) ? parseFloat(val) : 0);
    // const safeParseInt = (val: string) => (val && !isNaN(parseInt(val, 10)) ? parseInt(val, 10) : 0);

    // Destructure to separate the modbus settings from everything else
    const { modbus_settings, ...restOfState } = formState;

    // Build the main config object with all flat properties (general, parameters, HART)
    const finalConfig: DeviceConfig = {
      ...restOfState,
      device_id: initialData?.device_id || "", // Temporary ID, parent will overwrite
      temp_min: safeParseFloat(formState.temp_min),
      temp_max: safeParseFloat(formState.temp_max),
      scaling_factor: safeParseFloat(formState.scaling_factor),
      offset: safeParseFloat(formState.offset),
      correction_c0: safeParseFloat(formState.correction_c0),
      correction_c1: safeParseFloat(formState.correction_c1),
      correction_c2: safeParseFloat(formState.correction_c2),
      correction_c3: safeParseFloat(formState.correction_c3),
      unit: formState.unit as any,
    };

    // If it's a Modbus interface, add the parsed modbus_settings object
    if (interface_type === 'ModbusInterface') {
      finalConfig.modbus_settings = {
        slave_id: modbus_settings.slave_id,
        register_address: modbus_settings.register_address,
        register_count: modbus_settings.register_count,
        data_type: modbus_settings.data_type,
      };
    }

    onSave(finalConfig);
  };

  const temperatureUnitOptions = [
    { value: "Celsius", label: "Celsius (°C)" },
    { value: "Fahrenheit", label: "Fahrenheit (°F)" },
    { value: "Kelvin", label: "Kelvin (K)" },
  ];

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-start items-center gap-6 text-slate-400">
        <div>Timestamp: {initialData?.data?.timestamp ?? "N/A"}</div>
        <div>Status: {initialData?.data?.status ?? "N/A"}</div>
        <div>Live Value: {initialData?.data?.value ?? "N/A"}</div>
      </div>
      
      {/* --- Conditional Rendering Logic for the Bridge --- */}
      {interface_type === 'HartInterface' && (
        <BridgeComponent
          interface_type={interface_type}
          formState={formState} // Pass the whole flat state object for HART
          errors={{}}
          handleStateChange={handleStateChange} // Use the general handler for HART
        />
      )}
      {interface_type === 'ModbusInterface' && (
        <BridgeComponent
          interface_type={interface_type}
          formState={formState.modbus_settings} // Pass only the nested object for Modbus
          errors={{}}
          handleStateChange={handleModbusChange} // Use the specific handler for Modbus
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
                placeholder="e.g., Omega"
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
                placeholder="e.g., SN-12345"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Model
              </label>
              <Input
                value={formState.model}
                onChange={(e) => handleStateChange("model", e.target.value)}
                placeholder="e.g., PT-100"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Tag Name
              </label>
              <Input
                value={formState.tag_name}
                onChange={(e) => handleStateChange("tag_name", e.target.value)}
                placeholder="e.g., Outlet Temperature"
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
                placeholder="e.g., 2023"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Version
              </label>
              <Input
                value={formState.version}
                onChange={(e) => handleStateChange("version", e.target.value)}
                placeholder="e.g., v1.2"
              />
            </div>
          </div>
        )}
        {activeTab === "parameters" && (
          <div className="flex flex-col space-y-4 animate-fadeIn">
            <div className="grid grid-cols-2 gap-x-6">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">
                  Tmin
                </label>
                <Input
                  value={formState.temp_min}
                  onChange={(e) =>
                    handleStateChange("temp_min", e.target.value)
                  }
                  placeholder="e.g., -50.0"
                  type="number"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">
                  Tmax
                </label>
                <Input
                  value={formState.temp_max}
                  onChange={(e) =>
                    handleStateChange("temp_max", e.target.value)
                  }
                  placeholder="e.g., 200.0"
                  type="number"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Temperature Unit
              </label>
              <select
                value={formState.unit}
                onChange={(e) => handleStateChange("unit", e.target.value)}
                className="w-full border rounded-md py-1.5 px-3 text-sm border-gray-300"
              >
                {temperatureUnitOptions.map((opt) => (
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
                  onChange={(e) => handleStateChange("offset", e.target.value)}
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
};

export default TemperatureDeviceForm;