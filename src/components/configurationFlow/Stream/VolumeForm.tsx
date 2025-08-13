import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import type {
  VolumeConfiguration,
  VolumeOperatingMode,
} from "../../../types/streamConfig";
import type globalStore from "../../../stores/GlobalStore";

const operatingModes = [
  { value: "modbus", label: "Modbus" },
  { value: "encoderOnly", label: "Encoder Only" },
  { value: "OnePulse", label: "One pulse input" },
  { value: "twoPulse1-1", label: "Two pulse inputs (1:1)" },
  { value: "twoPulseX-Y", label: "Two pulse inputs (x:y)" },
  { value: "encoderWithOnePulseInput", label: "Encoder with One Pulse Input" },
  { value: "onePulseInputWithEncoder", label: "One Pulse Input with Encoder" },
  {
    value: "encoderWithTwoPulseInputs",
    label: "Encoder with Two Pulse Inputs",
  },
  {
    value: "twoPulseInputsWithEncoder",
    label: "Two Pulse Inputs with Encoder",
  },
];

export const defaultVolumeConfig: VolumeConfiguration = {
  operating_mode: "",
  gas_meter_1: "Meter A",
  gas_meter_2: "",
  flow_rate: null,
  creep_time_seconds: null,
  max_total_volume: null,
  min_operating_volume: null,
  bidirectional: false,
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
    // --- MOBX-FRIENDLY STATE LOGIC ---
    // Sirf user ke direct actions ko track karein
    const [hasProceededOnce, setHasProceededOnce] = useState(false);
    const [isEditingMode, setIsEditingMode] = useState(false);

    // --- DERIVED VALUES ---
    // UI state ko props aur user actions se derive karein, na ke useEffect se set karein.
    const showDetails = hasProceededOnce || !!config.operating_mode;
    const isModeLocked = showDetails && !isEditingMode;

    const diDevices = store.get_all_di_devices;

    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value, type } = e.target;
      let updatedValue: any = value;

      if (name === "bidirectional") {
        updatedValue = value === "true";
      } else if (
        type === "number" ||
        ["flow_rate", "max_total_volume", "min_operating_volume"].includes(name)
      ) {
        updatedValue = value === "" ? null : Number(value);
      } else if (name === "operating_mode") {
        updatedValue = value as VolumeOperatingMode;
      }
      (config as any)[name] = updatedValue;
    };

    const handleNext = () => {
      setHasProceededOnce(true);
    };

    const handleUnlockMode = () => {
      setIsEditingMode(true);
    };

    const showTwoMeters =
      config.operating_mode === "twoPulse1-1" ||
      config.operating_mode === "twoPulseX-Y";

    const selectedModeLabel =
      operatingModes.find((mode) => mode.value === config.operating_mode)
        ?.label || "";

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
                name="operating_mode"
                value={config.operating_mode ?? ""}
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

          {showDetails && config.operating_mode && (
            <div className="animate-fade-in-up">
              {showTwoMeters ? (
                <div className="grid grid-cols-2 gap-x-3">
                  <div className="space-y-1">
                    <label className="block font-medium text-xs text-gray-700">
                      Select Gas Meter 1
                    </label>
                    <select
                      name="gas_meter_1"
                      value={config.gas_meter_1}
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 rounded-sm px-2 py-1 text-sm shadow-sm"
                    >
                      {diDevices.length > 0 ? (
                        diDevices.map((device) => (
                          <option key={device.id} value={device.id}>
                            {`${device.id} (${
                              device.config.tag_name || "No Tag"
                            })`}
                          </option>
                        ))
                      ) : (
                        <option value="">None</option>
                      )}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block font-medium text-xs text-gray-700">
                      Select Gas Meter 2
                    </label>
                    <select
                      name="gas_meter_2"
                      value={config.gas_meter_2}
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 rounded-sm px-2 py-1 text-sm shadow-sm"
                    >
                      {diDevices.length > 0 ? (
                        diDevices.map((device) => (
                          <option key={device.id} value={device.id}>
                            {`${device.id} (${
                              device.config.tag_name || "No Tag"
                            })`}
                          </option>
                        ))
                      ) : (
                        <option value="">None</option>
                      )}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="block font-medium text-xs text-gray-700">
                    Select Gas Meter
                  </label>
                  <select
                    name="gas_meter_1"
                    value={config.gas_meter_1}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-sm px-2 py-1 text-sm shadow-sm"
                  >
                    {diDevices.length > 0 ? (
                      diDevices.map((device) => (
                        <option key={device.id} value={device.id}>
                          {`${device.id} (${
                            device.config.tag_name || "No Tag"
                          })`}
                        </option>
                      ))
                    ) : (
                      <option value="">None</option>
                    )}
                  </select>
                </div>
              )}
            </div>
          )}
        </div>

        {/* === SECTION 2: VOLUME DETAILS === */}
        {showDetails && config.operating_mode && (
          <div className="border border-gray-200 rounded-md shadow-sm p-3 space-y-2.5 animate-fade-in-up">
            <h3 className="text-sm font-semibold text-gray-800">Volume</h3>
            <div className="grid grid-cols-2 gap-x-3 gap-y-3 text-xs">
              <div className="space-y-1">
                <label className="block font-medium">Max Flow Rate</label>
                <input
                  name="flow_rate"
                  value={config.flow_rate ?? ""}
                  onChange={handleInputChange}
                  type="number"
                  placeholder="Please add Value"
                  className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="block font-medium">Max Total Volume</label>
                <input
                  name="max_total_volume"
                  value={config.max_total_volume ?? ""}
                  onChange={handleInputChange}
                  type="number"
                  placeholder="Please add Value"
                  className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="block font-medium">
                  Min Operational Volume
                </label>
                <input
                  name="min_operating_volume"
                  value={config.min_operating_volume ?? ""}
                  onChange={handleInputChange}
                  type="number"
                  placeholder="Please add Value"
                  className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="block font-medium">Bi-Directional</label>
                <select
                  name="bidirectional"
                  value={String(config.bidirectional)}
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
              disabled={!config.operating_mode}
              className="px-5 py-1.5 rounded-full font-semibold text-xs text-black bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed"
            >
              Next
            </button>
          ) : (
            <button
              onClick={onSave}
              disabled={isSaving || !config.operating_mode}
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
