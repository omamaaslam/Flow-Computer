// src/components/configurationFlow/Stream/io_card/Interface/DI_InterfaceSettingsForm.tsx
import React from "react";
import { observer } from "mobx-react-lite";
// Import the specific config type, not the union
import type { DigitalInputConfig } from "../../../../../types/interfaceConfig";

interface DIInterfaceSettingsFormProps {
  // Use the specific type for props
  currentConfig: DigitalInputConfig;
  onSave: (config: DigitalInputConfig) => void;
  onClose: () => void;
}

const DIInterfaceSettingsForm: React.FC<DIInterfaceSettingsFormProps> = observer(({
  currentConfig,
  onSave,
  onClose
}) => {
  // Use the specific type for state, which resolves all access errors
  const [formData, setFormData] = React.useState<DigitalInputConfig>(currentConfig);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // The key is now correctly typed as keyof DigitalInputConfig
    const key = name as keyof DigitalInputConfig;

    // The comparison is now valid. Convert debounce_time_ms to a number.
    const processedValue =
      key === "debounce_time_ms"
        ? (value === "" ? 0 : Number(value)) // Default to 0 if empty
        : value;

    setFormData(prev => ({
      ...prev,
      [key]: processedValue,
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  // Common styling for form inputs
  const inputBaseClass = "w-full border border-gray-300 rounded-sm px-3 py-2 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 bg-white placeholder-gray-400";
  const selectClass = `${inputBaseClass} appearance-none`;
  const labelClass = "block font-medium text-sm text-gray-700";

  const DropdownArrow = () => (
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
      </svg>
    </div>
  );

  return (
    <>
      <h2 className="text-xl font-bold text-gray-800 mb-6">DI Configuration</h2>
      <div className="space-y-5">

        {/* Input Type - Corrected name and value binding */}
        <div className="space-y-1">
          <label htmlFor="input_type" className={labelClass}>Input Type</label>
          <div className="relative">
            <select
              id="input_type"
              name="input_type" // Corrected: This field corresponds to 'input_type'
              value={formData.input_type} // No error: input_type exists on DigitalInputConfig
              onChange={handleChange}
              className={selectClass}
            >
              <option value="Dry Contact">Dry Contact</option>
              <option value="Wet Contact">Wet Contact</option>
            </select>
            <DropdownArrow />
          </div>
        </div>

        {/* Debounce Time - Corrected name, value binding, and unit */}
        <div className="space-y-1">
          <label htmlFor="debounce_time_ms" className={labelClass}>Debounce Time</label>
          <div className="relative">
            <input
              id="debounce_time_ms"
              name="debounce_time_ms" // Corrected: was diDebounceTime
              type="number"
              value={formData.debounce_time_ms || ""} // No error: debounce_time_ms exists
              onChange={handleChange}
              placeholder="Please enter value between 0-10,000"
              className={inputBaseClass}
              min="0"
              max="10000"
            />
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-500 pointer-events-none">
              ms {/* Corrected unit: was mA */}
            </span>
          </div>
        </div>

        {/* Signal Logic - Corrected value binding */}
        <div className="space-y-1">
          <label htmlFor="signal_logic" className={labelClass}>Signal Logic</label>
          <div className="relative">
            <select
              id="signal_logic"
              name="signal_logic"
              value={formData.signal_logic} // No error: signal_logic exists
              onChange={handleChange}
              className={selectClass}
            >
              <option>Active High</option>
              <option>Active Low</option>
            </select>
            <DropdownArrow />
          </div>
        </div>

        {/* Edge Detection - Corrected value binding */}
        <div className="space-y-1">
          <label htmlFor="edge_detection" className={labelClass}>Edge Detection</label>
          <div className="relative">
            <select
              id="edge_detection"
              name="edge_detection"
              value={formData.edge_detection} // No error: edge_detection exists
              onChange={handleChange}
              className={selectClass}
            >
              <option>Rising</option>
              <option>Falling</option>
              <option>Both</option>
            </select>
            <DropdownArrow />
          </div>
        </div>

        {/* Pull-up/Pull-down - Corrected value binding */}
        <div className="space-y-1">
          <label htmlFor="pull_config" className={labelClass}>Pull-up/Pull-down</label>
          <div className="relative">
            <select
              id="pull_config"
              name="pull_config"
              value={formData.pull_config} // No error: pull_config exists
              onChange={handleChange}
              className={selectClass}
            >
              <option>Pull-down</option>
              <option>Pull-up</option>
              <option>None</option>
            </select>
            <DropdownArrow />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8 pt-4">
        <button
          onClick={onClose}
          className="px-5 py-2 rounded-full font-semibold text-sm text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-5 py-2 rounded-full font-semibold text-sm text-black bg-yellow-500 hover:bg-yellow-600 transition-colors"
        >
          Save
        </button>
      </div>
    </>
  );
});

export default DIInterfaceSettingsForm;