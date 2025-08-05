// src/components/configurationFlow/Stream/io_card/Interface/DI_InterfaceSettingsForm.tsx

import React, { useState, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import type { DigitalInputConfig } from "../../../../../types/interfaceConfig";

interface DIInterfaceSettingsFormProps {
  currentConfig: DigitalInputConfig;
  onSave: (config: DigitalInputConfig) => void;
  onClose: () => void;
}

// --- NEW, STRONGER VALIDATION FUNCTION ---
// This function now correctly checks for empty, non-numeric, and out-of-range values.
const validate = (data: Partial<DigitalInputConfig>) => {
  const errors: { [key: string]: string } = {};

  const debounceValue = data.debounce_time_ms;

  if (debounceValue == null || String(debounceValue).trim() === "") {
    errors.debounce_time_ms = "Debounce time is required.";
  } else if (isNaN(Number(debounceValue))) {
    errors.debounce_time_ms = "Must be a valid number.";
  } else if (Number(debounceValue) < 0 || Number(debounceValue) > 10000) {
    errors.debounce_time_ms = "Must be between 0 and 10,000.";
  }

  // Other fields are selects with default values, so they are always valid.
  return errors;
};

const DIInterfaceSettingsForm: React.FC<DIInterfaceSettingsFormProps> =
  observer(({ currentConfig, onSave, onClose }) => {
    // Local state will hold strings for text inputs to allow flexible user typing
    const [formState, setFormState] = useState({
      ...currentConfig,
      debounce_time_ms: String(currentConfig.debounce_time_ms), // Store as string for the input field
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isDirty, setIsDirty] = useState(false);

    // Store a clean, correctly-typed initial state for comparison
    const initialFormStateRef = useRef(
      JSON.stringify({
        ...currentConfig,
        debounce_time_ms: String(currentConfig.debounce_time_ms),
      })
    );

    // Check if the interface was already configured when the form opened
    const isInitiallyConfigured = currentConfig.enabled;

    useEffect(() => {
      // We validate against a correctly-typed version of the state
      const validationData = {
        ...formState,
        debounce_time_ms: Number(formState.debounce_time_ms),
      };
      const validationErrors = validate(validationData);
      setErrors(validationErrors);

      // Check if the form has been changed from its initial state
      setIsDirty(JSON.stringify(formState) !== initialFormStateRef.current);
    }, [formState]);

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
      setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
      // Before saving, create a final, correctly-typed config object
      const finalConfig: DigitalInputConfig = {
        ...formState,
        debounce_time_ms: Number(formState.debounce_time_ms),
      };
      // Double-check for validity before sending
      if (Object.keys(validate(finalConfig)).length === 0) {
        onSave(finalConfig);
      } else {
        console.error(
          "Save blocked due to invalid data.",
          validate(finalConfig)
        );
      }
    };

    // The final, correct logic for the save button's disabled state
    const isSaveDisabled =
      Object.keys(errors).length > 0 || // 1. Disable if there are any validation errors
      (isInitiallyConfigured && !isDirty); // 2. If it's an existing config, also disable if no changes were made

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
              <option value="Dry Contact">Dry Contact</option>
              <option value="Wet Contact">Wet Contact</option>
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor="debounce_time_ms" className={labelClass}>
              Debounce Time (ms)
            </label>
            <input
              id="debounce_time_ms"
              name="debounce_time_ms"
              type="text"
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
              <option>Active High</option>
              <option>Active Low</option>
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
              <option>Rising</option>
              <option>Falling</option>
              <option>Both</option>
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
              <option>Pull-down</option>
              <option>Pull-up</option>
              <option>None</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full font-semibold text-sm text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
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
            Save
          </button>
        </div>
      </>
    );
  });

export default DIInterfaceSettingsForm;
