import React from "react";
import { observer } from "mobx-react-lite";
import type { PressureCalculatorConfig } from "../../../types/streamConfig";
import type globalStore from "../../../stores/GlobalStore";

interface PressureFormProps {
  config: PressureCalculatorConfig;
  onSave: () => void;
  onClose: () => void;
  isSaving: boolean;
  store: typeof globalStore;
}

const PressureForm: React.FC<PressureFormProps> = observer(
  ({ store, config, onSave, onClose, isSaving }) => {
    const available_pressure_devices = store.pressureDevices;
    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value, type } = e.target;
      let finalValue: string | number = value;

      if (type === "text" && name !== "pressure_linked_device_id") {
        if (value.trim() !== "" && !isNaN(Number(value))) {
          finalValue = Number(value);
        }
      }
      (config as any)[name] = finalValue;
    };

    return (
      <>
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm text-gray-800">
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
              name="pressure_linked_device_id"
              value={config.pressure_linked_device_id ?? ""}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm"
            >
              {available_pressure_devices.length === 0 && (
                <option value="">None</option>
              )}

              {available_pressure_devices.map((device) => (
                <option key={device.id} value={device.id}>
                  {`${device.id}`}
                </option>
              ))}
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

export default PressureForm;
