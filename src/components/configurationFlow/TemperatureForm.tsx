import React from "react";
import { observer } from "mobx-react-lite";
import { Thermometer } from "lucide-react";
import type { TemperatureConfig } from "../../types/streamConfig";

interface TemperatureFormProps {
  config: TemperatureConfig;
  onCommit: () => void;
  onClose: () => void;
}

const TemperatureForm: React.FC<TemperatureFormProps> = observer(
  ({ config, onCommit, onClose }) => {
    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
      (config as any)[name] = value;
    };

    return (
      <>
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm text-gray-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2 p-2 border border-dashed border-yellow-400 bg-white rounded-md shadow-sm">
              <label className="block font-medium text-xs">
                Live Operating Tem. (T)
              </label>
              <Thermometer className="text-yellow-500" size={16} />
              <span className="font-semibold text-xs text-yellow-500">
                {config.liveTemp}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <label className="block font-medium text-xs">
              Substitute Temperature (T)
            </label>
            <input
              name="substituteTemp"
              type="text"
              value={config.substituteTemp}
              onChange={handleInputChange}
              placeholder="Please add Value"
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
          <div className="space-y-1">
            <label className="block font-medium text-xs">Device</label>
            <select
              name="device"
              value={config.device}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option>Temperature S1</option>
              <option>Temperature S2</option>
              <option>Temperature S3</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="block font-medium text-xs">
              Min Op. Temp. (Tmin)
            </label>
            <input
              name="minOpTemp"
              type="text"
              value={config.minOpTemp}
              onChange={handleInputChange}
              placeholder="Please add Value"
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
          <div className="space-y-1">
            <label className="block font-medium text-xs">
              Base Temperature (BT)
            </label>
            <input
              name="baseTemp"
              type="text"
              value={config.baseTemp}
              onChange={handleInputChange}
              placeholder="Please add Value"
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
          <div className="space-y-1">
            <label className="block font-medium text-xs">
              Max Op. Temp. (Tmax)
            </label>
            <input
              name="maxOpTemp"
              type="text"
              value={config.maxOpTemp}
              onChange={handleInputChange}
              placeholder="Please add Value"
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
          <div className="space-y-1">
            <label className="block font-medium text-xs">
              Temperature Unit
            </label>
            <select
              name="tempUnit"
              value={config.tempUnit}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option value="°C">°C</option>
              <option value="°F">°F</option>
              <option value="K">K</option>
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

export default TemperatureForm;
