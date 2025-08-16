import React, { useState, useEffect } from "react";
import type { DeviceConfig } from "../../../../../../types/device";
import BridgeComponent from "../BridgeComponent";

// Helper component for a standard text input
interface InputProps extends React.ComponentPropsWithoutRef<"input"> {}
const Input = (props: InputProps) => (
  <input
    {...props}
    className="w-full border rounded-md py-1.5 px-3 text-sm placeholder:text-gray-400 shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
  />
);

// Main form component starts here
interface PressureDeviceFormProps {
  onBack: () => void;
  onSave: (config: DeviceConfig) => void;
  interface_type: string;
  initialData: DeviceConfig | any;
  bridgeData?: any | null;
  interface_id: string;
}

const PressureDeviceForm: React.FC<PressureDeviceFormProps> = ({
  onBack,
  onSave,
  interface_type,
  interface_id,
  initialData,
  bridgeData,
}) => {
  const [activeTab, setActiveTab] = useState<"general" | "parameters">(
    "general"
  );

  // Define the full shape of the form's state, including HART fields
  const [formState, setFormState] = useState({
    manufacturer: "",
    serial_number: "",
    model: "",
    tag_name: "",
    build_year: "2025",
    version: "v1.0",
    pressure_min: "",
    pressure_max: "",
    unit: "bar",
    scaling_factor: "1.0",
    offset: "0.0",
    correction_c0: "0.0",
    correction_c1: "1.0",
    correction_c2: "0.0",
    correction_c3: "0.0",
    // Bridge-related state fields
    slave_id: "",
    register_count: "",
    register_address: "",
    data_type: "",
    // HART-specific fields
    pollingAddress: "",
    commandSet: "Universal",
    variableType: "",
  });

  useEffect(() => {
    // Explicitly type `data` to let TypeScript know its shape and allow extra props
    const data: Partial<DeviceConfig> & { [key: string]: any } =
      initialData || {};
    const interfaceSpecificData: any = bridgeData || {};

    setFormState({
      manufacturer: data.manufacturer ?? "",
      serial_number: data.serial_number ?? "",
      model: data.model ?? "",
      tag_name: data.tag_name ?? "",
      build_year: data.build_year ?? "2025",
      version: data.version ?? "v1.0",
      pressure_min: String(data.pressure_min ?? ""),
      pressure_max: String(data.pressure_max ?? ""),
      unit: data.unit ?? "bar",
      scaling_factor: String(data.scaling_factor ?? "1.0"),
      offset: String(data.offset ?? "0.0"),
      correction_c0: String(data.correction_c0 ?? "0.0"),
      correction_c1: String(data.correction_c1 ?? "1.0"),
      correction_c2: String(data.correction_c2 ?? "0.0"),
      correction_c3: String(data.correction_c3 ?? "0.0"),
      slave_id: String(interfaceSpecificData.slave_address ?? ""),
      register_count: String(interfaceSpecificData.register_count ?? ""),
      register_address: String(interfaceSpecificData.register_address ?? ""),
      data_type: interfaceSpecificData.data_type ?? "",
      // Load HART fields from device config (initialData)
      pollingAddress: String(data.pollingAddress ?? ""),
      commandSet: data.commandSet ?? "Universal",
      variableType: data.variableType ?? "",
    });
  }, [initialData, bridgeData]);

  const handleStateChange = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const validateAndSave = () => {
    const safeParseFloat = (val: string) =>
      val && !isNaN(parseFloat(val)) ? parseFloat(val) : 0;
    const safeParseInt = (val: string) =>
      val && !isNaN(parseInt(val, 10)) ? parseInt(val, 10) : 0;

    // Determine device_id based on interface type
    let deviceId = `${interface_id}`;
    if (interface_type.toUpperCase().includes("HART")) {
      const { pollingAddress, variableType } = formState;
      // This check is crucial. Both values must be present.
      if (pollingAddress && variableType) {
        deviceId = `${interface_id}T${pollingAddress}${variableType}`;
      }
    }

    // Construct the final config, using 'any' to allow for dynamic properties
    const finalConfig: any = {
      device_id: deviceId,
      manufacturer: formState.manufacturer,
      model: formState.model,
      serial_number: formState.serial_number,
      tag_name: formState.tag_name,
      build_year: formState.build_year,
      version: formState.version,
      pressure_min: safeParseFloat(formState.pressure_min),
      pressure_max: safeParseFloat(formState.pressure_max),
      scaling_factor: safeParseFloat(formState.scaling_factor),
      offset: safeParseFloat(formState.offset),
      unit: formState.unit as any,
      correction_c0: safeParseFloat(formState.correction_c0),
      correction_c1: safeParseFloat(formState.correction_c1),
      correction_c2: safeParseFloat(formState.correction_c2),
      correction_c3: safeParseFloat(formState.correction_c3),
      slave_address: safeParseInt(formState.slave_id),
      register_address: safeParseInt(formState.register_address),
      register_count: safeParseInt(formState.register_count),
      data_type: formState.data_type,
    };

    // If it's a HART interface, also include the HART-specific fields in the saved config
    if (interface_type.toUpperCase().includes("HART")) {
      finalConfig.pollingAddress = formState.pollingAddress;
      finalConfig.commandSet = formState.commandSet;
      finalConfig.variableType = formState.variableType;
    }
    console.log(finalConfig);
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
      <div className="flex justify-start items-center gap-6 text-slate-400">
        <div>Status: {initialData?.data?.status ?? "N/A"}</div>
        <div>
          Timestamp:{" "}
          {new Date(initialData.data.timestamp * 1000).toLocaleTimeString([], {
            hour12: false,
          })}
        </div>

        <div>Value: {initialData?.data?.value ?? "N/A"}</div>
      </div>

      <BridgeComponent
        interface_type={interface_type}
        formState={formState}
        errors={{}}
        handleStateChange={handleStateChange}
      />

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
            {/* General Fields... (unchanged) */}
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
            {/* Parameters Fields... (typo fixed here) */}
            <div className="grid grid-cols-2 gap-x-6">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">
                  Pmin
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
                  Pmax
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

export default PressureDeviceForm;
