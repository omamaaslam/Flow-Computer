import React from "react";
import { observer } from "mobx-react-lite";
import type { FlowRateConfig } from  "../../../types/streamConfig";

interface FlowRateFormProps {
  config: FlowRateConfig;
  onCommit: () => void;
  onClose: () => void;
}

const FlowRateForm: React.FC<FlowRateFormProps> = observer(
  ({ config, onCommit, onClose }) => {
    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
      (config as any)[name] = value;
    };

    return (
      <>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-xs text-gray-700">
          <div className="space-y-1">
            <label className="block font-medium text-xs">
              Calculation method
            </label>
            <select
              name="calculationMethod"
              value={config.calculationMethod}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-sm px-2 py-1.5 text-xs shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option value="Software Based">Software Based</option>
              <option value="Device Based">Device Based</option>
            </select>
          </div>
          <div className="space-y-1">
            {config.calculationMethod === "Device Based" && (
              <>
                <label className="block font-medium text-xs">Device List</label>
                <select
                  name="device"
                  value={config.device}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-sm px-2 py-1.5 text-xs shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                >
                  <option>Device 1</option>
                  <option>Device 2</option>
                </select>
              </>
            )}
          </div>
          <div className="space-y-1">
            <label className="block font-medium text-xs">Qmin Alarm</label>
            <input
              name="min_alarm_flow_rate"
              type="text"
              value={config.min_alarm_flow_rate}
              onChange={handleInputChange}
              placeholder="Please add Value"
              className="w-full border border-gray-300 rounded-sm px-2 py-1.5 text-xs shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
          <div className="space-y-1">
            <label className="block font-medium text-xs">Qmax Alarm</label>
            <input
              name="max_alarm_flow_rate"
              type="text"
              value={config.max_alarm_flow_rate}
              onChange={handleInputChange}
              placeholder="Please add Value"
              className="w-full border border-gray-300 rounded-sm px-2 py-1.5 text-xs shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
          <div className="space-y-1">
            <label className="block font-medium text-xs">Qmin Warn</label>
            <input
              name="min_warning_flow_rate"
              type="text"
              value={config.min_warning_flow_rate}
              onChange={handleInputChange}
              placeholder="Please add Value"
              className="w-full border border-gray-300 rounded-sm px-2 py-1.5 text-xs shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
          <div className="space-y-1">
            <label className="block font-medium text-xs">Qmax Warn</label>
            <input
              name="max_warning_flow_rate"
              type="text"
              value={config.max_warning_flow_rate}
              onChange={handleInputChange}
              placeholder="Please add Value"
              className="w-full border border-gray-300 rounded-sm px-2 py-1.5 text-xs shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
          <div className="space-y-1 col-span-2">
            <label className="block font-medium text-xs">Creep Mode</label>
            <select
              name="creep_mode_enabled"
              value={config.creep_mode_enabled}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-sm px-2 py-1.5 text-xs shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option value="Disable">Disable</option>
              <option value="Enable">Enable</option>
            </select>
          </div>
          {config.creep_mode_enabled === "Enable" && (
            <>
              <div className="space-y-1">
                <label className="block font-medium text-xs">
                  Creep flowrate
                </label>
                <input
                  name="creep_flow_rate"
                  type="text"
                  value={config.creep_flow_rate}
                  onChange={handleInputChange}
                  placeholder="Please add Value"
                  className="w-full border border-gray-300 rounded-sm px-2 py-1.5 text-xs shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
              <div className="space-y-1">
                <label className="block font-medium text-xs">Creep Time</label>
                <input
                  name="creep_time_seconds"
                  type="text"
                  value={config.creep_time_seconds}
                  onChange={handleInputChange}
                  placeholder="Please add Value"
                  className="w-full border border-gray-300 rounded-sm px-2 py-1.5 text-xs shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
            </>
          )}
        </div>
        <div className="flex justify-end gap-2 pt-3">
          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-full font-semibold text-xs text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onCommit}
            className="px-5 py-1.5 rounded-full font-semibold text-xs text-black bg-yellow-500 hover:bg-yellow-600 transition-colors"
          >
            Save
          </button>
        </div>
      </>
    );
  }
);

export default FlowRateForm;
