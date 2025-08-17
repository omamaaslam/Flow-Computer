import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import type { pressure_config } from "../../../types/streamConfig";
import type globalStore from "../../../stores/GlobalStore";

interface PressureFormProps {
  config: pressure_config;
  onSave: () => void;
  onClose: () => void;
  isSaving: boolean;
  store: typeof globalStore;
}

const PressureForm: React.FC<PressureFormProps> = observer(
  ({ store, config, onSave, onClose, isSaving }) => {
    // STEP 1: Form ke liye local state banayein aur usko initial value `config` prop se dein.
    const [formData, setFormData] = useState<pressure_config>(config);

    const available_pressure_devices = store.pressureDevices;

    // STEP 2: Ab yeh function local `formData` ko update karega, direct `config` ko nahi.
    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;

      let finalValue: string | number | null = value;

      // Numeric fields ko number mein convert karein
      if (name !== "pressure_linked_device_id" && name !== "unit") {
        if (value.trim() === "") {
          finalValue = null;
        } else if (!isNaN(Number(value))) {
          finalValue = Number(value);
        }
      }

      // Local state ko update karein
      setFormData((prevData) => ({
        ...prevData,
        [name]: finalValue,
      }));
    };

    // STEP 3: Ek naya function banayein jo save par click hone par chalega.
    const handleSave = () => {
      // Pehle, MobX store (`config` prop) ko local state (`formData`) se update karein.
      // `Object.assign` saari properties ko `formData` se `config` mein copy kar dega.
      Object.assign(config, formData);

      // Ab original `onSave` function ko call karein.
      onSave();
    };

    return (
      <>
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm text-gray-800">
          {/* STEP 4: Saare inputs ki `value` ab local `formData` se aayegi. */}
          <div className="space-y-1">
            <label className="block font-medium text-xs">
              Substitute Pressure (P)
            </label>
            <input
              name="substitute_pressure"
              type="text"
              value={formData.substitute_pressure ?? ""}
              onChange={handleInputChange}
              placeholder="Please add Value"
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="block font-medium text-xs">Device</label>
            <select
              name="pressure_linked_device_id"
              value={formData.pressure_linked_device_id || ""}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm"
            >
              <option value="">None</option>
              {available_pressure_devices.map((device) => (
                <option key={device.id} value={device.id}>
                  {`${device.id} (${device.config.tag_name || "No Tag"})`}
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
              value={formData.min_operating_pressure ?? ""}
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
              value={formData.base_pressure ?? ""}
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
              value={formData.max_operating_pressure ?? ""}
              onChange={handleInputChange}
              placeholder="Please add Value"
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="block font-medium text-xs">Pressure Unit</label>
            <select
              name="unit"
              value={formData.unit}
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
            onClick={onClose} // Cancel par kuch change nahi karna, woh pehle jaisa hi hai
            disabled={isSaving}
            className="px-5 py-1.5 rounded-full font-semibold text-xs text-gray-700 bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave} // STEP 5: Save button ab naye `handleSave` function ko call karega
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
