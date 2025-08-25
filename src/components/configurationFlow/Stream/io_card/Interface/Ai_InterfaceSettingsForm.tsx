// src/components/FlowComputer/Configuration/ConfigureInterface/Ai_InterfaceSettingsForm.tsx
import React, { useState, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import type { AnalogInputConfig } from "../../../../../types/interfaceConfig";

// Props interface for the component
interface AIInterfaceSettingsFormProps {
  currentConfig: AnalogInputConfig;
  onSave: (config: AnalogInputConfig) => void;
  onClose: () => void;
  isSaving: boolean;
  interface_id: string;
}

const AIInterfaceSettingsForm: React.FC<AIInterfaceSettingsFormProps> =
  observer(({ currentConfig, onSave, onClose, isSaving, interface_id }) => {
    // State to manage the form data. We map the boolean `isenable` to a string for the dropdown.
    const [formState, setFormState] = useState({
      isenable: currentConfig.isenable ? "enable" : "disable",
    });

    // State to track if the form has been changed by the user
    const [isDirty, setIsDirty] = useState(false);

    // Store the initial state to compare against for changes
    const initialFormStateRef = useRef(JSON.stringify(formState));

    // Check if the interface was already configured when the form was opened
    const isInitiallyConfigured = currentConfig.enabled;

    // Effect to check if the form state has changed from its initial state
    useEffect(() => {
      setIsDirty(JSON.stringify(formState) !== initialFormStateRef.current);
    }, [formState]);

    // Handler for changes in the select dropdown
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormState((prev) => ({ ...prev, [name]: value }));
    };

    // Handler for the save button click
    const handleSave = () => {
      // Convert the form state string back to a boolean for the config object
      const isEnabledValue = formState.isenable === "enable";

      // Build the final configuration object with the correct types
      const finalConfig: AnalogInputConfig = {
        interface_type: "AnalogInput",
        interface_id: interface_id,
        isenable: isEnabledValue,
        enabled: isEnabledValue, // Keep 'enabled' and 'isenable' in sync
      };

      // Call the onSave prop with the new config
      onSave(finalConfig);
    };

    // Determine if the save button should be disabled
    // Disabled if: it's currently saving, OR if it was already configured and nothing has changed.
    const isSaveDisabled = isSaving || (isInitiallyConfigured && !isDirty);

    // Common styling for form elements
    const inputBaseClass =
      "w-full border rounded-sm px-3 py-2 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 bg-white placeholder-gray-400 appearance-none";
    const labelClass = "block font-medium text-sm text-gray-700";

    return (
      <>
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          AI Settings: AnalogInputInterface
        </h2>
        <div className="space-y-5">
          <div className="space-y-1">
            <label htmlFor="isenable" className={labelClass}>
              Status
            </label>
            <select
              id="isenable"
              name="isenable"
              value={formState.isenable}
              onChange={handleChange}
              className={inputBaseClass}
            >
              <option value="enable">Enable</option>
              <option value="disable">Disable</option>
            </select>
          </div>
        </div>

        {/* Action buttons at the bottom of the form */}
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

export default AIInterfaceSettingsForm;
