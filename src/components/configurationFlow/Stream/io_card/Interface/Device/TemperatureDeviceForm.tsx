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

// Main form component starts here
interface TemperatureDeviceFormProps {
  onBack: () => void;
  onSave: (config: DeviceConfig) => void;
  interface_type: string;
  initialData?: DeviceConfig | null;
  interface_id: string;
  bridgeData?: any | null;
}

const TemperatureDeviceForm: React.FC<TemperatureDeviceFormProps> = ({
  onBack,
  onSave,
  interface_type,
  initialData,
  interface_id,
  bridgeData,
}) => {
  const [activeTab, setActiveTab] = useState<"general" | "parameters">(
    "general"
  );
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
    modbus_settings: {
      slave_id: "",
      slave_address: "",
      register_address: "",
      register_count: "",
      data_type: "Float32", // Set a default value here
    },
    // HART-specific fields
    pollingAddress: "",
    commandSet: "Universal",
    variableType: "",
  });

  useEffect(() => {
    const data: Partial<DeviceConfig> = initialData || {};
    const interfaceSpecificData: any = bridgeData || {};
    setFormState((prev) => ({ // Use previous state to avoid overwriting defaults
      ...prev,
      manufacturer: data.manufacturer ?? "",
      serial_number: data.serial_number ?? "",
      model: data.model ?? "",
      tag_name: data.tag_name ?? "",
      build_year: data.build_year ?? "",
      version: data.version ?? "",
      temp_min: String(data.temp_min ?? ""),
      temp_max: String(data.temp_max ?? ""),
      unit: data.unit ?? "Celsius",
      scaling_factor: String(data.scaling_factor ?? ""),
      offset: String(data.offset ?? ""),
      correction_c0: String(data.correction_c0 ?? ""),
      correction_c1: String(data.correction_c1 ?? ""),
      correction_c2: String(data.correction_c2 ?? ""),
      correction_c3: String(data.correction_c3 ?? ""),
      modbus_settings: {
        slave_id: String(interfaceSpecificData.slave_id ?? prev.modbus_settings.slave_id),
        slave_address: String(interfaceSpecificData.slave_address ?? prev.modbus_settings.slave_address),
        register_address: String(interfaceSpecificData.register_address ?? prev.modbus_settings.register_address),
        register_count: String(interfaceSpecificData.register_count ?? prev.modbus_settings.register_count),
        data_type: interfaceSpecificData.data_type ?? prev.modbus_settings.data_type,
      },
      pollingAddress: String(data.pollingAddress ?? ""),
      commandSet: data.commandSet ?? "Universal",
      variableType: data.variableType ?? "",
    }));
  }, [initialData, bridgeData]);

  // This handler is for top-level fields like "manufacturer"
  const handleStateChange = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };
  
  // *** FIX 1: Create a dedicated handler for the nested modbus_settings object ***
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
    const safeParseFloat = (val: string) =>
      val && !isNaN(parseFloat(val)) ? parseFloat(val) : 0;
    const safeParseInt = (val: string) =>
      val && !isNaN(parseInt(val, 10)) ? parseInt(val, 10) : 0;

    let final_interface_id = interface_id; // Use a local variable
    if (interface_type.toUpperCase().includes("HART")) {
      const { pollingAddress, variableType } = formState;
      if (pollingAddress && variableType) {
        final_interface_id = `${interface_id}T${pollingAddress}${variableType}`;
      }
    }
    const finalConfig: DeviceConfig = {
      device_id: final_interface_id,
      manufacturer: formState.manufacturer,
      model: formState.model,
      serial_number: formState.serial_number,
      tag_name: formState.tag_name,
      build_year: formState.build_year,
      version: formState.version,
      temp_min: safeParseFloat(formState.temp_min),
      temp_max: safeParseFloat(formState.temp_max),
      scaling_factor: safeParseFloat(formState.scaling_factor),
      offset: safeParseFloat(formState.offset),
      unit: formState.unit as "Celsius" | "Fahrenheit" | "Kelvin",
      correction_c0: safeParseFloat(formState.correction_c0),
      correction_c1: safeParseFloat(formState.correction_c1),
      correction_c2: safeParseFloat(formState.correction_c2),
      correction_c3: safeParseFloat(formState.correction_c3),
      modbus_settings: {
        slave_id: safeParseInt(formState.modbus_settings.slave_id),
        slave_address: safeParseInt(formState.modbus_settings.slave_address),
        register_address: safeParseInt(
          formState.modbus_settings.register_address
        ),
        register_count: safeParseInt(formState.modbus_settings.register_count),
        data_type: formState.modbus_settings.data_type,
      },
    };
    if (interface_type.toUpperCase().includes("HART")) {
      finalConfig.pollingAddress = formState.pollingAddress;
      finalConfig.commandSet = formState.commandSet;
      finalConfig.variableType = formState.variableType;
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

      {/* *** FIX 2: Pass the correct nested state and the new handler to the BridgeComponent *** */}
      <BridgeComponent
        interface_type={interface_type}
        formState={formState.modbus_settings} // Pass the nested object
        errors={{}}
        handleStateChange={handleModbusChange} // Pass the new handler
      />
      <div className="flex bg-gray-200 p-1 rounded-lg">
        {/* ... (rest of the component is unchanged) */}
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