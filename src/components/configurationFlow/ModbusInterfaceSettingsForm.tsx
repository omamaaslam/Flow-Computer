import React from "react";
import { observer } from "mobx-react-lite";
import type { ModbusConfig } from "../../types/interfaceConfig";

interface ModbusInterfaceSettingsFormProps {
  currentConfig: ModbusConfig;
  onSave: (config: ModbusConfig) => void;
  onClose: () => void;
}

const ModbusInterfaceSettingsForm: React.FC<ModbusInterfaceSettingsFormProps> =
  observer(({ currentConfig, onSave, onClose }) => {
    const [formData, setFormData] = React.useState<ModbusConfig>(currentConfig);

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;

      let processedValue: string | number | boolean = value;

      if (name === "pull_up_enabled") {
        processedValue = value === "true";
      } else if (
        [
          "baud_rate",
          "data_bits",
          "max_slaves",
          "stop_bits",
          "timeout_ms",
          "poll_interval_ms",
          "retry_count",
        ].includes(name)
      ) {
        processedValue = Number(value);
      }

      setFormData((prev) => ({
        ...prev,
        [name]: processedValue,
      }));
    };

    const handleSave = () => {
      onSave(formData);
    };

    return (
      <>
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm text-gray-800">
          <div className="space-y-1">
            <label className="block font-medium text-xs">Baud Rate</label>
            <input
              name="baud_rate"
              type="number"
              value={formData.baud_rate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
          <div className="space-y-1">
            <label className="block font-medium text-xs">Data Bits</label>
            <select
              name="data_bits"
              value={formData.data_bits}
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
              value={formData.parity}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option value="Even">Even</option>
              <option value="Odd">Odd</option>
              <option value="None">None</option>
            </select>
          </div>
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
              value={String(formData.pull_up_enabled)}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="block font-medium text-xs">Time-out (ms)</label>
            <input
              name="timeout_ms"
              type="number"
              value={formData.timeout_ms}
              onChange={handleChange}
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
              name="retry_count"
              value={formData.retry_count}
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
