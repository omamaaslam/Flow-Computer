// src/components/configurationFlow/ModbusInterfaceSettingsForm.tsx
import React from "react";
import { observer } from "mobx-react-lite";
import type { InterfaceConfig } from "../../types/interfaceConfig";

interface ModbusInterfaceSettingsFormProps {
  currentConfig: InterfaceConfig;
  onSave: (config: InterfaceConfig) => void;
  onClose: () => void;
}

const ModbusInterfaceSettingsForm: React.FC<ModbusInterfaceSettingsFormProps> =
  observer(({ currentConfig, onSave, onClose }) => {
    const defaultConfig: InterfaceConfig = {
      baud_rate: "",
      dataBits: 8,
      max_slaves: 32,
      parity: "Even",
      stop_bits: 1,
      pull_up_enabled: "Enabled",
      timeout_ms: 1000,
      poll_interval_ms: 5000,
      retryCount: 3,
    };

    const [formData, setFormData] = React.useState<InterfaceConfig>({
      ...defaultConfig,
      ...currentConfig,
    });

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
      const key = name as keyof InterfaceConfig;
      const processedValue =
        key === "dataBits" ||
        key === "max_slaves" ||
        key === "timeout_ms" ||
        key === "poll_interval_ms" ||
        key === "retryCount"
          ? Number(value)
          : value;

      setFormData((prev) => ({
        ...prev,
        [key]: processedValue,
      }));
    };

    const handleSave = () => {
      console.log("Saving config:", formData);
      onSave(formData);
    };

    return (
      <>
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm text-gray-800">
          {/* Left Column */}
          <div className="space-y-1">
            <label className="block font-medium text-xs">Baud Rate</label>
            <input
              name="baud_rate"
              type="text"
              value={formData.baud_rate}
              onChange={handleChange}
              placeholder="Please add Value"
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block font-medium text-xs">Data Bits</label>
            <select
              name="dataBits"
              value={formData.dataBits || 8}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option value={8}>8</option>
              <option value={7}>7</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block font-medium text-xs">Max Slaves</label>
            <input
              name="max_slaves"
              type="number"
              value={formData.max_slaves}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block font-medium text-xs">Parity</label>
            <select
              name="parity"
              value={formData.parity || "Even"}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option value="Even">Even</option>
              <option value="Odd">Odd</option>
              <option value="None">None</option>
            </select>
          </div>

          {/* Right Column */}
          <div className="space-y-1">
            <label className="block font-medium text-xs">Stop Bits</label>
            <select
              name="stop_bits"
              value={formData.stop_bits}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block font-medium text-xs">
              Pull-Up/Pull-Down
            </label>
            <select
              name="pull_up_enabled"
              value={formData.pull_up_enabled}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option value="Enabled">Enabled</option>
              <option value="Disabled">Disabled</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block font-medium text-xs">Time-out (ms)</label>
            <input
              name="timeout_ms"
              type="number"
              value={formData.timeout_ms}
              onChange={handleChange}
              placeholder="Time-out for read/write operations eg. 1000"
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block font-medium text-xs">
              Poll Interval (ms)
            </label>
            <input
              name="poll_interval_ms"
              type="number"
              value={formData.poll_interval_ms}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block font-medium text-xs">Retry Count</label>
            <select
              name="retryCount"
              value={formData.retryCount || 3}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option value={3}>3</option>
              <option value={2}>2</option>
              <option value={1}>1</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4 pt-3">
          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-full font-semibold text-xs text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-1.5 rounded-full font-semibold text-xs text-black bg-yellow-500 hover:bg-yellow-600 transition-colors border-2 border-white"
          >
            Save
          </button>
        </div>
      </>
    );
  });

export default ModbusInterfaceSettingsForm;
