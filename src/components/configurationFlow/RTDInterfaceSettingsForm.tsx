// src/components/configurationFlow/RTDInterfaceSettingsForm.tsx

import React, { useState } from "react";
import type { InterfaceConfig } from "../../types/interfaceConfig";

// 1. Define the props the component will receive from its parent.
//    - currentConfig: The existing settings from the MobX store.
//    - onSave: A function to call when the user clicks "Save".
//    - onClose: A function to call when the user clicks "Cancel".
interface RTDInterfaceSettingsFormProps {
  currentConfig: InterfaceConfig;
  onSave: (config: InterfaceConfig) => void;
  onClose: () => void;
}

const RTDInterfaceSettingsForm: React.FC<RTDInterfaceSettingsFormProps> = ({
  currentConfig,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<InterfaceConfig>(currentConfig);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    const isNumeric = [
      "excitationCurrent",
      "samplingInterval",
      "referenceResistor",
    ].includes(name);

    setFormData((prev) => ({
      ...prev,
      [name]: isNumeric && value !== "" ? Number(value) : value,
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <>
      <div className="flex flex-col space-y-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Wire Type
          </label>
          <select
            name="wireType"
            value={formData.wireType || "2-wire"}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          >
            <option>2-wire</option>
            <option>3-wire</option>
            <option>4-wire</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Excitation Current
          </label>
          <div className="relative">
            <input
              name="excitationCurrent"
              type="number"
              placeholder="Please enter value between 0.1-1.0"
              value={formData.excitationCurrent || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 pr-12 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            />
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 text-sm">
              mA
            </span>
          </div>
        </div>

        {/* Measurement Mode Field */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Measurement Mode
          </label>
          <select
            name="measurementMode"
            value={formData.measurementMode || "Continuous"}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          >
            <option>Continuous</option>
            <option>On-Demand</option>
          </select>
        </div>

        {/* Sampling Interval Field */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Sampling Interval
          </label>
          <div className="relative">
            <input
              name="samplingInterval"
              type="number"
              placeholder="Please enter value between 600-60,000"
              value={formData.samplingInterval || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 pr-12 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            />
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 text-sm">
              ms
            </span>
          </div>
        </div>

        {/* Reference Resistor Field */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Reference Resistor
          </label>
          <div className="relative">
            <input
              name="referenceResistor"
              type="number"
              placeholder="Please enter value between 10-10,000"
              value={formData.referenceResistor || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 pr-12 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            />
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 text-sm">
              Ω
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={onClose}
          className="px-5 py-2 rounded-full font-semibold text-sm bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-5 py-2 rounded-full font-semibold text-sm text-black bg-yellow-400 hover:bg-yellow-500 transition-colors"
        >
          Save
        </button>
      </div>
    </>
  );
};

export default RTDInterfaceSettingsForm;
