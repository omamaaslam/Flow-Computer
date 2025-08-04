import React from "react";
import { observer } from "mobx-react-lite";
import { Gauge } from "lucide-react";
import type { PressureConfig } from "../../../interfaces/Stream";

interface PressureFormProps {
  config: PressureConfig;
  onCommit: () => void;
  onClose: () => void;
}

const PressureForm: React.FC<PressureFormProps> = observer(
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
                Live Operating Pressure (P)
              </label>
              <Gauge className="text-yellow-500" size={16} />
              <span className="font-semibold text-xs text-yellow-500">
                {"N/A"}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <label className="block font-medium text-xs">
              Substitute Pressure (P)
            </label>
            <input
              name="substitute_pressure"
              type="text"
              // FIX: Handle null value
              value={config.substitute_pressure ?? ""}
              onChange={handleInputChange}
              placeholder="Please add Value"
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
          <div className="space-y-1">
            <label className="block font-medium text-xs">Device</label>
            <select
              // FIX: The name attribute must match the property in the config object
              name="device_id"
              // FIX: Handle null value
              value={config.device_id ?? ""}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option>Pressure S1</option>
              <option>Pressure S2</option>
              <option>Pressure S3</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="block font-medium text-xs">
              Min Op. Pressure (Pmin)
            </label>
            <input
              name="min_operating_pressure"
              type="text"
              // FIX: Handle null value
              value={config.min_operating_pressure ?? ""}
              onChange={handleInputChange}
              placeholder="Please add Value"
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
          <div className="space-y-1">
            <label className="block font-medium text-xs">
              Base Pressure (BP)
            </label>
            <input
              name="base_pressure"
              type="text"
              // FIX: Handle null value
              value={config.base_pressure ?? ""}
              onChange={handleInputChange}
              placeholder="Please add Value"
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
          <div className="space-y-1">
            <label className="block font-medium text-xs">
              Max Op. Pressure (Pmax)
            </label>
            <input
              name="max_operating_pressure"
              type="text"
              // FIX: Handle null value
              value={config.max_operating_pressure ?? ""}
              onChange={handleInputChange}
              placeholder="Please add Value"
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
          <div className="space-y-1">
            <label className="block font-medium text-xs">Pressure Unit</label>
            <select
              // FIX: The name attribute must match the property 'unit'
              name="unit"
              // FIX: The property is 'unit', not 'pressureUnit'
              value={config.unit}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            >
              {/* FIX (Bug): Option values must match PressureUnit type ('bar', 'psi', 'kPa', 'atm') */}
              <option value="bar">Bar</option>
              <option value="psi">PSI</option>
              <option value="kPa">kPa</option>
              <option value="atm">atm</option>
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

export default PressureForm;
