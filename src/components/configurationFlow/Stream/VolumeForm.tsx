import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import type {
  VolumeConfiguration,
  VolumeOperatingMode,
} from "../../../types/streamConfig";
import type globalStore from "../../../stores/GlobalStore";

const operatingModes = [
  { value: "modbus", label: "Modbus" },
  { value: "EncoderOnlyVolumeConfig", label: "Encoder Only" },
  { value: "OnePulseVolumeConfig", label: "One pulse input" },
];

export const defaultVolumeConfig: VolumeConfiguration = {
  mode_type: "",
  encoder_device_id: "",
  max_total_volume_limit: null,
  min_operating_volume_limit: null,
  enable_bidirectional_volume: false,
};
interface VolumeFormProps {
  config: VolumeConfiguration;
  onSave: () => void;
  onClose: () => void;
  isSaving: boolean;
  store: typeof globalStore;
}

const VolumeForm: React.FC<VolumeFormProps> = observer(
  ({ store, config, onSave, onClose, isSaving }) => {
    const [hasProceededOnce, setHasProceededOnce] = useState(false);
    const [isEditingMode, setIsEditingMode] = useState(false);

    const showDetails = hasProceededOnce || !!config.mode_type;
    const isModeLocked = showDetails && !isEditingMode;

    const diDevices = store.get_all_di_devices;

    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value, type } = e.target;
      let updatedValue: any = value;

      // --- vvv CHANGED LOGIC vvv ---
      if (name === "enable_bidirectional_volume") {
        updatedValue = value === "true";
      } else if (
        type === "number" ||
        ["max_total_volume_limit", "min_operating_volume_limit"].includes(name)
      ) {
        updatedValue = value === "" ? null : Number(value);
      } else if (name === "mode_type") {
        updatedValue = value as VolumeOperatingMode;
      }
      // --- ^^^ CHANGED LOGIC ^^^ ---
      (config as any)[name] = updatedValue;
    };

    const handleNext = () => {
      setHasProceededOnce(true);
    };

    const handleUnlockMode = () => {
      setIsEditingMode(true);
    };

    const selectedModeLabel =
      operatingModes.find((mode) => mode.value === config.mode_type)?.label ||
      "";

    return (
      <div className="flex flex-col gap-3">
        {/* === SECTION 1: OPERATING MODE === */}
        <div className="border border-gray-200 rounded-md shadow-sm p-3 space-y-3">
          <div className="space-y-1">
            <label className="block font-medium text-xs text-gray-700">
              Operating Mode
            </label>
            {isModeLocked ? (
              <div className="flex items-center justify-between p-2 bg-gray-100 rounded-sm">
                <span className="text-sm font-semibold text-gray-800">
                  {selectedModeLabel}
                </span>
                <button
                  onClick={handleUnlockMode}
                  className="text-xs font-semibold text-yellow-600 hover:underline"
                >
                  Change
                </button>
              </div>
            ) : (
              <select
                name="mode_type" // <-- CHANGED from "operating_mode"
                value={config.mode_type ?? ""}
                onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 text-gray-800"
              >
                <option value="" disabled>
                  Select an Operating Mode...
                </option>
                {operatingModes.map((mode) => (
                  <option key={mode.value} value={mode.value}>
                    {mode.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* === SECTION 2: VOLUME DETAILS === */}
        {showDetails && config.mode_type && (
          <div className="border border-gray-200 rounded-md shadow-sm p-3 space-y-2.5 animate-fade-in-up">
            <h3 className="text-sm font-semibold text-gray-800">Volume</h3>
            <div className="grid grid-cols-2 gap-x-3 gap-y-3 text-xs">
              {config.mode_type === "modbus" && (
                <div className="space-y-1">
                  <label className="block font-medium">Link Device</label>
                  <select
                    name="encoder_device_id" // <-- CHANGED from "linked_device_id"
                    value={config.encoder_device_id ?? ""}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm"
                  >
                    <option value="">
                      {diDevices.length > 0
                        ? "Select a device..."
                        : "None available"}
                    </option>
                    {diDevices.map((device) => (
                      <option key={device.id} value={device.id}>
                        {`${device.id} (${device.config.tag_name || "No Tag"})`}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {config.mode_type === "OnePulseVolumeConfig" && (
                <div className="space-y-1">
                  <label className="block font-medium">
                    Pulse Input Device
                  </label>
                  <select
                    name="pulse_input_device_id"
                    value={config.pulse_input_device_id ?? ""}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm"
                  >
                    <option value="">
                      {diDevices.length > 0
                        ? "Select a device..."
                        : "None available"}
                    </option>
                    {diDevices.map((device) => (
                      <option key={device.id} value={device.id}>
                        {`${device.id} (${device.config.tag_name || "No Tag"})`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="block font-medium">
                  Min Operational Volume
                </label>
                <input
                  name="min_operating_volume_limit" // <-- CHANGED from "min_operating_volume"
                  value={config.min_operating_volume_limit ?? ""}
                  onChange={handleInputChange}
                  type="number"
                  placeholder="Please add Value"
                  className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-medium">Max Total Volume</label>
                <input
                  name="max_total_volume_limit" // <-- CHANGED from "max_total_volume"
                  value={config.max_total_volume_limit ?? ""}
                  onChange={handleInputChange}
                  type="number"
                  placeholder="Please add Value"
                  className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-medium">Bi-Directional</label>
                <select
                  name="enable_bidirectional_volume" // <-- CHANGED from "bidirectional"
                  value={String(config.enable_bidirectional_volume)}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm"
                >
                  <option value="true">Enable</option>
                  <option value="false">Disable</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* === SECTION 3: BUTTONS === */}
        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-5 py-1.5 rounded-full font-semibold text-xs text-gray-700 bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>

          {!showDetails ? (
            <button
              onClick={handleNext}
              disabled={!config.mode_type}
              className="px-5 py-1.5 rounded-full font-semibold text-xs text-black bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed"
            >
              Next
            </button>
          ) : (
            <button
              onClick={onSave}
              disabled={isSaving || !config.mode_type}
              className="px-5 py-1.5 rounded-full font-semibold text-xs text-black bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 disabled:cursor-wait"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          )}
        </div>
      </div>
    );
  }
);

export default VolumeForm;
