import React from "react";
import { observer } from "mobx-react-lite";
import type { FlowRateCalculatorConfig } from "../../../types/streamConfig";

interface FlowRateFormProps {
  config: FlowRateCalculatorConfig;
  onSave: () => void;
  onClose: () => void;
  isSaving: boolean;
}

const FlowRateForm: React.FC<FlowRateFormProps> = observer(
  ({ config, onSave, onClose, isSaving }) => {
    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value, type } = e.target;

      let finalValue: string | number | boolean = value;

      if (
        name === "software_flow_rate_enabled" ||
        name === "creep_mode_enabled"
      ) {
        finalValue = value === "true";
      } else if (type === "text" && name !== "flow_rate_device_id") {
        if (value.trim() !== "" && !isNaN(Number(value))) {
          finalValue = Number(value);
        }
      }

      (config as any)[name] = finalValue;
    };

    return (
      <>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-xs text-gray-700">
          <div className="space-y-1">
            <label className="block font-medium text-xs">
              Calculation method
            </label>
            <select
              name="software_flow_rate_enabled"
              value={String(config.software_flow_rate_enabled)}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-sm px-2 py-1.5 text-xs shadow-sm"
            >
              <option value="true">Software Based</option>
              <option value="false">Device Based</option>
            </select>
          </div>
          <div className="space-y-1">
            {!config.software_flow_rate_enabled && (
              <>
                <label className="block font-medium text-xs">Device List</label>
                <select
                  name="flow_rate_device_id"
                  value={config.flow_rate_device_id}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-sm px-2 py-1.5 text-xs shadow-sm"
                >
                  <option value="">Select Device</option>
                  <option value="DI1">DI1 (Pulse)</option>
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
              className="w-full border border-gray-300 rounded-sm px-2 py-1.5 text-xs shadow-sm"
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
              className="w-full border border-gray-300 rounded-sm px-2 py-1.5 text-xs shadow-sm"
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
              className="w-full border border-gray-300 rounded-sm px-2 py-1.5 text-xs shadow-sm"
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
              className="w-full border border-gray-300 rounded-sm px-2 py-1.5 text-xs shadow-sm"
            />
          </div>
          <div className="space-y-1 col-span-2">
            <label className="block font-medium text-xs">Creep Mode</label>
            <select
              name="creep_mode_enabled"
              value={String(config.creep_mode_enabled)}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-sm px-2 py-1.5 text-xs shadow-sm"
            >
              <option value="false">Disable</option>
              <option value="true">Enable</option>
            </select>
          </div>
          {config.creep_mode_enabled && (
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
                  className="w-full border border-gray-300 rounded-sm px-2 py-1.5 text-xs shadow-sm"
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
                  className="w-full border border-gray-300 rounded-sm px-2 py-1.5 text-xs shadow-sm"
                />
              </div>
            </>
          )}
        </div>
        <div className="flex justify-end gap-2 pt-3">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-5 py-1.5 rounded-full font-semibold text-xs text-gray-700 bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="px-5 py-1.5 rounded-full font-semibold text-xs text-black bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 disabled:cursor-wait"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </>
    );
  }
);

export default FlowRateForm;
