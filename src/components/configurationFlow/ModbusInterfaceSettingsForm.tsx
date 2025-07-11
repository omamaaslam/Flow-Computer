import React from "react";

interface ModbusInterfaceSettingsFormProps {
  onClose: () => void;
}

const ModbusInterfaceSettingsForm: React.FC<
  ModbusInterfaceSettingsFormProps
> = ({ onClose }) => {
  return (
    <>
      {/* Main grid with two-column layout, mirroring TemperatureForm */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm text-gray-800">
        {/* --- Left Column --- */}

        <div className="space-y-1">
          <label className="block font-medium text-xs">Baudrate</label>
          <input
            type="text"
            placeholder="Please add Value"
            className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>

        <div className="space-y-1">
          <label className="block font-medium text-xs">Data Bits</label>
          <select
            defaultValue="8"
            className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          >
            <option>8</option>
            <option>7</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block font-medium text-xs">Max Slaves</label>
          <input
            type="text"
            defaultValue="32"
            className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>

        <div className="space-y-1">
          <label className="block font-medium text-xs">Parity</label>
          <select
            defaultValue="Even"
            className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          >
            <option>Even</option>
            <option>Odd</option>
            <option>None</option>
          </select>
        </div>

        {/* Note: Duplicated Parity field as was present in your previous code */}
        <div className="space-y-1">
          <label className="block font-medium text-xs">Parity</label>
          <select
            defaultValue="Even"
            className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          >
            <option>Even</option>
            <option>Odd</option>
            <option>None</option>
          </select>
        </div>

        {/* --- Right Column --- */}

        <div className="space-y-1">
          <label className="block font-medium text-xs">Stop Bits</label>
          <select
            defaultValue="8"
            className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          >
            <option>8</option>
            <option>1</option>
            <option>2</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block font-medium text-xs">Pull-Up/Pull-Down</label>
          <select
            defaultValue="Enabled"
            className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          >
            <option>Enabled</option>
            <option>Disabled</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block font-medium text-xs">Time-out (ms)</label>
          <input
            type="text"
            placeholder="Time-out for read/write operations eg. 1000"
            className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>

        <div className="space-y-1">
          <label className="block font-medium text-xs">
            Poll Interval (ms)
          </label>
          <select
            defaultValue="5000"
            className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          >
            <option>5000</option>
            <option>1000</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block font-medium text-xs">Retry Count</label>
          <select
            defaultValue="3"
            className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          >
            <option>3</option>
            <option>2</option>
            <option>1</option>
          </select>
        </div>
      </div>

      {/* Footer Buttons, mirroring TemperatureForm styles */}
      <div className="flex justify-end gap-2 mt-4 pt-3">
        <button
          onClick={onClose}
          className="px-5 py-1.5 rounded-full font-semibold text-xs text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button className="px-5 py-1.5 rounded-full font-semibold text-xs text-black bg-yellow-500 hover:bg-yellow-600 transition-colors border-2 border-white">
          Save
        </button>
      </div>
    </>
  );
};

export default ModbusInterfaceSettingsForm;
