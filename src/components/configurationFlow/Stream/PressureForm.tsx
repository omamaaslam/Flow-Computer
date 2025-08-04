// src/components/configurationFlow/Stream/PressureForm.tsx

import React from "react";
import { observer } from "mobx-react-lite";
import { Gauge } from "lucide-react";
import type { PressureCalculatorConfig } from "../../../types/streamConfig"; // Nayi type import karein

interface PressureFormProps {
  config: PressureCalculatorConfig;
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
              <span className="font-semibold text-xs text-yellow-500">N/A</span>
            </div>
          </div>
          <div className="space-y-1">
            <label className="block font-medium text-xs">
              Substitute Pressure (P)
            </label>
            <input
              name="substitute_pressure"
              type="text"
              value={config.substitute_pressure ?? ""}
              onChange={handleInputChange}
              placeholder="Please add Value"
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="block font-medium text-xs">Device</label>
            <select
              name="pressure_linked_device_id" // Sahi property name JSON ke mutabiq
              value={config.pressure_linked_device_id ?? ""}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm"
            >
              <option value="">None</option>
              <option value="HI1T1S">HI1T1S (HART)</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="block font-medium text-xs">
              Min Op. Pressure (Pmin)
            </label>
            <input
              name="min_operating_pressure"
              type="text"
              value={config.min_operating_pressure ?? ""}
              onChange={handleInputChange}
              placeholder="Please add Value"
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="block font-medium text-xs">
              Base Pressure (BP)
            </label>
            <input
              name="base_pressure"
              type="text"
              value={config.base_pressure ?? ""}
              onChange={handleInputChange}
              placeholder="Please add Value"
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="block font-medium text-xs">
              Max Op. Pressure (Pmax)
            </label>
            <input
              name="max_operating_pressure"
              type="text"
              value={config.max_operating_pressure ?? ""}
              onChange={handleInputChange}
              placeholder="Please add Value"
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="block font-medium text-xs">Pressure Unit</label>
            <select
              name="unit"
              value={config.unit}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm"
            >
              <option value="Bar">Bar</option>
              <option value="Psi">PSI</option>
              <option value="Kpa">kPa</option>
              <option value="Atm">atm</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4 pt-3">
          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-full font-semibold text-xs text-gray-700 bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onCommit}
            className="px-5 py-1.5 rounded-full font-semibold text-xs text-black bg-yellow-500 hover:bg-yellow-600"
          >
            Save
          </button>
        </div>
      </>
    );
  }
);

export default PressureForm;
