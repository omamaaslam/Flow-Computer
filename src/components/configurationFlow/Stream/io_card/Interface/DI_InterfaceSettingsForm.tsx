import React, { useState, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import type { DigitalInputConfig } from "../../../../../types/interfaceConfig";

// Props interface updated to include isSaving
interface DIInterfaceSettingsFormProps {
  currentConfig: DigitalInputConfig;
  onSave: (config: DigitalInputConfig) => void;
  onClose: () => void;
  isSaving: boolean;
  interface_id: string;
}

const validate = (data: Partial<DigitalInputConfig>) => {
  const errors: { [key: string]: string } = {};
  const debounceValue = data.debounce_time_ms;

  // Use Number() for validation as data might be a string from the form
  if (debounceValue == null || String(debounceValue).trim() === "") {
    errors.debounce_time_ms = "Debounce time is required.";
  } else if (isNaN(Number(debounceValue))) {
    errors.debounce_time_ms = "Must be a valid number.";
  } else if (Number(debounceValue) < 0 || Number(debounceValue) > 10000) {
    errors.debounce_time_ms = "Must be between 0 and 10,000.";
  }
  return errors;
};

const DIInterfaceSettingsForm: React.FC<DIInterfaceSettingsFormProps> =
  observer(({ currentConfig, onSave, onClose, isSaving, interface_id }) => {
    // Robust state initialization with defaults
    const [formState, setFormState] = useState({
      ...currentConfig,
      // Provide a valid string default for every form field
      debounce_time_ms: String(currentConfig.debounce_time_ms || "10"),
      // NOTE: Ensure these values match your type definitions.
      // E.g., 'DryContact', not 'drycontect'
      input_type: currentConfig.input_type || "DryContact",
      signal_logic: currentConfig.signal_logic || "ActiveHigh",
      edge_detection: currentConfig.edge_detection || "Rising",
      pull_config: currentConfig.pull_config || "PullUp",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isDirty, setIsDirty] = useState(false);
    const initialFormStateRef = useRef(JSON.stringify(formState));
    const isInitiallyConfigured = currentConfig.enabled;

    useEffect(() => {
      // Create a temporary object with correct types BEFORE validating.
      const validationData = {
        ...formState,
        debounce_time_ms: Number(formState.debounce_time_ms),
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

    const handleSave = () => {
      // Build finalConfig with correct types
      const finalConfig: DigitalInputConfig = {
        interface_type: "DigitalInputInterface",
        interface_id: interface_id,
        enabled: true, 
        debounce_time_ms: Number(formState.debounce_time_ms),
        input_type: formState.input_type as DigitalInputConfig["input_type"],
        signal_logic:
          formState.signal_logic as DigitalInputConfig["signal_logic"],
        edge_detection:
          formState.edge_detection as DigitalInputConfig["edge_detection"],
        pull_config: formState.pull_config as DigitalInputConfig["pull_config"],
      };

      if (Object.keys(validate(finalConfig)).length === 0) {
        onSave(finalConfig);
        // console.warn(finalConfig);
      } else {
        console.error(
          "Save blocked due to invalid data.",
          validate(finalConfig)
        );
      }
    };

    // Include isSaving in disabled logic
    const isSaveDisabled =
      isSaving ||
      Object.keys(errors).length > 0 ||
      (isInitiallyConfigured && !isDirty);

    // Common styling for form elements
    const inputBaseClass =
      "w-full border rounded-sm px-3 py-2 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 bg-white placeholder-gray-400";
    const labelClass = "block font-medium text-sm text-gray-700";

    return (
      <>
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          DI Settings: DigitalInputInterface
        </h2>
        <div className="space-y-5">
          {/* Added explicit `value` attributes to options */}
          <div className="space-y-1">
            <label htmlFor="input_type" className={labelClass}>
              Input Type
            </label>
            <select
              id="input_type"
              name="input_type"
              value={formState.input_type}
              onChange={handleChange}
              className={`${inputBaseClass} appearance-none`}
            >
              {/* NOTE: Fixed "drycontect" typo and used values matching your types */}
              <option value="DryContact">Dry Contact</option>
              <option value="PulseCount">Pulse Count</option>
              <option value="OpenCollector">Open Collector</option>
            </select>
          </div>

          <div className="space-y-1">
            <label htmlFor="debounce_time_ms" className={labelClass}>
              Debounce Time (ms)
            </label>
            <input
              id="debounce_time_ms"
              name="debounce_time_ms"
              type="number"
              value={formState.debounce_time_ms}
              onChange={handleChange}
              placeholder="0-10,000"
              className={`${inputBaseClass} ${
                errors.debounce_time_ms ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.debounce_time_ms && (
              <p className="text-red-500 text-xs mt-1">
                {errors.debounce_time_ms}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="signal_logic" className={labelClass}>
              Signal Logic
            </label>
            <select
              id="signal_logic"
              name="signal_logic"
              value={formState.signal_logic}
              onChange={handleChange}
              className={`${inputBaseClass} appearance-none`}
            >
              <option value="ActiveHigh">Active High</option>
              <option value="ActiveLow">Active Low</option>
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor="edge_detection" className={labelClass}>
              Edge Detection
            </label>
            <select
              id="edge_detection"
              name="edge_detection"
              value={formState.edge_detection}
              onChange={handleChange}
              className={`${inputBaseClass} appearance-none`}
            >
              <option value="Rising">Rising</option>
              <option value="Falling">Falling</option>
              <option value="Both">Both</option>
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor="pull_config" className={labelClass}>
              Pull-up/Pull-down
            </label>
            <select
              id="pull_config"
              name="pull_config"
              value={formState.pull_config}
              onChange={handleChange}
              className={`${inputBaseClass} appearance-none`}
            >
              <option value="PullUp">Pull-up</option>
              <option value="PullDown">Pull-down</option>
              <option value="None">None</option>
            </select>
          </div>
        </div>

        {/* Updated buttons with isSaving logic */}
        <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-5 py-2 rounded-full font-semibold text-sm text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaveDisabled}
            className={`px-5 py-2 rounded-full font-semibold text-sm text-black transition-colors ${
              isSaveDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600"
            }`}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </>
    );
  });

export default DIInterfaceSettingsForm;
