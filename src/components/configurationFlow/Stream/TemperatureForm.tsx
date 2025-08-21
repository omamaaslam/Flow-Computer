import React from "react";
import { observer } from "mobx-react-lite";
import type { temperature_config } from "../../../types/streamConfig";
import type globalStore from "../../../stores/GlobalStore";

interface TemperatureFormProps {
  config: temperature_config;
  onSave: () => void;
  onClose: () => void;
  isSaving: boolean;
  store: typeof globalStore;
}

const TemperatureForm: React.FC<TemperatureFormProps> = observer(
  ({ store, config, onSave, onClose, isSaving }) => {
    const available_temperature_devices = store.temperatureDevices;

    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value, type } = e.target;
      let finalValue: string | number = value;

      if (type === "text" && name !== "temp_linked_device_id") {
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
              Substitute Temperature (T)
            </label>
            <input
              name="substitute_temperature"
              type="text"
              value={config.substitute_temperature ?? ""}
              onChange={handleInputChange}
              placeholder="Please add Value"
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm"
            />
          </div>

          <div className="space-y-1">
            <div className="space-y-1">
              <label className="block font-medium text-xs">Device</label>
              <select
                name="temp_linked_device_id"
                value={config.temp_linked_device_id ?? ""}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm"
              >
                <option value="">None</option>
                {available_temperature_devices.map((device) => (
                  <>
                    
                    <option key={device.id} value={device.id}>
                      {`${device.id}`}
                    </option>
                  </>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block font-medium text-xs">
              Min Op. Temp. (Tmin)
            </label>
            <input
              name="min_operating_temperature"
              type="text"
              value={config.min_operating_temperature ?? ""}
              onChange={handleInputChange}
              placeholder="Please add Value"
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="block font-medium text-xs">
              Base Temperature (BT)
            </label>
            <input
              name="base_temperature"
              type="text"
              value={config.base_temperature ?? ""}
              onChange={handleInputChange}
              placeholder="Please add Value"
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="block font-medium text-xs">
              Max Op. Temp. (Tmax)
            </label>
            <input
              name="max_operating_temperature"
              type="text"
              value={config.max_operating_temperature ?? ""}
              onChange={handleInputChange}
              placeholder="Please add Value"
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="block font-medium text-xs">
              Temperature Unit
            </label>
            <select
              name="unit"
              value={config.unit}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm"
            >
              <option value="Celsius">Celsius</option>
              <option value="Fahrenheit">Fahrenheit</option>
              <option value="Kelvin">Kelvin</option>
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

export default TemperatureForm;
