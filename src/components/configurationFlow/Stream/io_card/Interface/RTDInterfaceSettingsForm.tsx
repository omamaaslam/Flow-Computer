import React, { useState, useEffect, useRef } from "react";
import type { RtdConfig } from "../../../../../types/interfaceConfig";

interface RTDInterfaceSettingsFormProps {
  currentConfig: RtdConfig;
  onSave: (config: RtdConfig) => void;
  onClose: () => void;
  isSaving: boolean;
  interface_id: string;
}

const validate = (data: Partial<RtdConfig>) => {
  const errors: { [key: string]: string } = {};
  if (
    data.excitation_current_ma == null ||
    data.excitation_current_ma < 0.1 ||
    data.excitation_current_ma > 1.0
  )
    errors.excitation_current_ma = "Must be 0.1-1.0";
  if (
    data.sampling_interval_ms == null ||
    data.sampling_interval_ms < 600 ||
    data.sampling_interval_ms > 60000
  )
    errors.sampling_interval_ms = "Must be 600-60,000";
  if (
    data.reference_resistor_ohms == null ||
    data.reference_resistor_ohms < 10 ||
    data.reference_resistor_ohms > 10000
  )
    errors.reference_resistor_ohms = "Must be 10-10,000";
  return errors;
};

const RTDInterfaceSettingsForm: React.FC<RTDInterfaceSettingsFormProps> = ({
  currentConfig,
  onSave,
  onClose,
  isSaving,
  interface_id,
}) => {
  // --- 👇 KEY CHANGE: Robust state initialization with defaults ---
  const [formState, setFormState] = useState({
    ...currentConfig,
    // Provide a valid string default for every form field
    excitation_current_ma: String(currentConfig.excitation_current_ma || "0.5"),
    sampling_interval_ms: String(currentConfig.sampling_interval_ms || "1000"),
    reference_resistor_ohms: String(
      currentConfig.reference_resistor_ohms || "100"
    ),
    wire_type: currentConfig.wire_type || "ThreeWire",
    measurement_mode: currentConfig.measurement_mode || "Continuous",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isDirty, setIsDirty] = useState(false);
  const initialFormStateRef = useRef(JSON.stringify(formState));
  const isInitiallyConfigured = currentConfig.enabled;

  useEffect(() => {
    // Create a temporary object with correct types BEFORE validating.
    const validationData = {
      ...formState,
      excitation_current_ma: Number(formState.excitation_current_ma),
      sampling_interval_ms: Number(formState.sampling_interval_ms),
      reference_resistor_ohms: Number(formState.reference_resistor_ohms),
    };
    const validationErrors = validate(validationData);
    setErrors(validationErrors);
    setIsDirty(JSON.stringify(formState) !== initialFormStateRef.current);
  }, [formState]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  // --- 👇 KEY CHANGE: Build finalConfig with correct types ---
  const handleSave = () => {
    const finalConfig: RtdConfig = {
      interface_type: "RtdInterface",
      interface_id: interface_id,
      enabled: true,
    
      excitation_current_ma: Number(formState.excitation_current_ma),
      sampling_interval_ms: Number(formState.sampling_interval_ms),
      reference_resistor_ohms: Number(formState.reference_resistor_ohms),
      wire_type: formState.wire_type as RtdConfig["wire_type"],
      measurement_mode:
        formState.measurement_mode as RtdConfig["measurement_mode"],
    };
    if (Object.keys(validate(finalConfig)).length === 0) {
      onSave(finalConfig);
    }
  };

  // --- 👇 KEY CHANGE: ADD isSaving TO THE DISABLED LOGIC ---
  const isSaveDisabled =
    isSaving ||
    Object.keys(errors).length > 0 ||
    (isInitiallyConfigured && !isDirty);

  return (
    <>
      <div className="flex flex-col space-y-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Wire Type
          </label>
          <select
            name="wire_type"
            value={formState.wire_type}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm shadow-sm"
          >
            <option value="TwoWire">2-wire</option>
            <option value="ThreeWire">3-wire</option>
            <option value="FourWire">4-wire</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Excitation Current (mA)
          </label>
          <input
            name="excitation_current_ma"
            type="number"
            step="0.1" // Good for float inputs
            placeholder="0.1-1.0"
            value={formState.excitation_current_ma}
            onChange={handleChange}
            className={`w-full border rounded-md py-2 px-3 text-sm shadow-sm ${
              errors.excitation_current_ma
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {errors.excitation_current_ma && (
            <p className="text-red-500 text-xs mt-1">
              {errors.excitation_current_ma}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Measurement Mode
          </label>
          <select
            name="measurement_mode"
            value={formState.measurement_mode}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm shadow-sm"
          >
            <option value="Continuous">Continuous</option>
            <option value="On-Demand">On-Demand</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Sampling Interval (ms)
          </label>
          <input
            name="sampling_interval_ms"
            type="number"
            placeholder="600-60,000"
            value={formState.sampling_interval_ms}
            onChange={handleChange}
            className={`w-full border rounded-md py-2 px-3 text-sm shadow-sm ${
              errors.sampling_interval_ms ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.sampling_interval_ms && (
            <p className="text-red-500 text-xs mt-1">
              {errors.sampling_interval_ms}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Reference Resistor (Ω)
          </label>
          <input
            name="reference_resistor_ohms"
            type="number"
            placeholder="10-10,000"
            value={formState.reference_resistor_ohms}
            onChange={handleChange}
            className={`w-full border rounded-md py-2 px-3 text-sm shadow-sm ${
              errors.reference_resistor_ohms
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {errors.reference_resistor_ohms && (
            <p className="text-red-500 text-xs mt-1">
              {errors.reference_resistor_ohms}
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={onClose}
          disabled={isSaving}
          className="px-5 py-2 rounded-full font-semibold text-sm bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isSaveDisabled}
          className={`px-5 py-2 rounded-full font-semibold text-sm text-black transition-colors ${
            isSaveDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-yellow-400 hover:bg-yellow-500"
          }`}
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </>
  );
};

export default RTDInterfaceSettingsForm;
