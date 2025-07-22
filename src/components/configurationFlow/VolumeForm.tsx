import React, { useState, useEffect } from "react";
import type { VolumeConfig } from "../../types/streamConfig";

const operatingModes = [
  { value: "encoderOnly", label: "Encoder Only" },
  { value: "onePulse", label: "One pulse input" },
  { value: "twoPulse1-1", label: "Two pulse inputs (1:1)" },
  { value: "twoPulseX-Y", label: "Two pulse inputs (x:y)" },
  { value: "encoderWithOnePulse", label: "Encoder with one pulse input" },
  { value: "onePulseWithEncoder", label: "One pulse input with encoder" },
  { value: "encoderWithTwoPulses", label: "Encoder with two pulse inputs" },
  { value: "twoPulsesWithEncoder", label: "Two pulse inputs with encoder" },
];

interface VolumeFormProps {
  initialData: VolumeConfig;
  onSave: (config: VolumeConfig) => void;
  onClose: () => void;
}

const VolumeForm: React.FC<VolumeFormProps> = ({
  initialData,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<VolumeConfig>(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  useEffect(() => {
    const titleElement = document.getElementById("modal-title");
    const headerDivider = titleElement?.nextElementSibling;

    if (titleElement) {
      const headerContainer = titleElement.parentElement;
      if (headerContainer) {
        if (formData.operatingMode) {
          headerContainer.style.display = "none";
          if (headerDivider instanceof HTMLElement)
            headerDivider.style.display = "none";
        } else {
          headerContainer.style.display = "flex";
          if (headerDivider instanceof HTMLElement)
            headerDivider.style.display = "block";
        }
      }
    }
    return () => {
      const titleOnCleanup = document.getElementById("modal-title");
      if (titleOnCleanup) {
        const headerContainerOnCleanup = titleOnCleanup.parentElement;
        const dividerOnCleanup = titleOnCleanup.nextElementSibling;
        if (headerContainerOnCleanup)
          headerContainerOnCleanup.style.display = "flex";
        if (dividerOnCleanup instanceof HTMLElement)
          dividerOnCleanup.style.display = "block";
      }
    };
  }, [formData.operatingMode]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const processedValue = type === "number" ? Number(value) : value;
    setFormData((prev) => ({ ...prev, [name]: processedValue }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="border border-gray-200 rounded-md shadow-sm p-3 space-y-3">
        <div className="space-y-1">
          <label className="block font-medium text-xs text-gray-700">
            Operating Mode
          </label>
          <select
            name="operatingMode"
            value={formData.operatingMode}
            onChange={handleInputChange}
            className={`w-full border border-gray-200 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 ${
              !formData.operatingMode ? "text-gray-400" : "text-gray-800"
            }`}
          >
            <option value="" disabled>
              Please select mode
            </option>
            {operatingModes.map((mode) => (
              <option key={mode.value} value={mode.value}>
                {mode.label}
              </option>
            ))}
          </select>
        </div>

        {formData.operatingMode && (
          <div className="animate-fade-in-up">
            {formData.operatingMode === "twoPulseX-Y" && (
              <div className="grid grid-cols-2 gap-x-3">
                <div className="space-y-1">
                  <label className="block font-medium text-xs text-gray-700">
                    Select Gas Meter
                  </label>
                  <select
                    name="gasMeter1"
                    value={formData.gasMeter1}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500"
                  >
                    <option>Encoder only</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block font-medium text-xs text-gray-700">
                    Select Gas Meter
                  </label>
                  <select
                    name="gasMeter2"
                    value={formData.gasMeter2}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500"
                  >
                    <option>Encoder only</option>
                  </select>
                </div>
              </div>
            )}
            {formData.operatingMode !== "twoPulseX-Y" && (
              <div className="space-y-1">
                <label className="block font-medium text-xs text-gray-700">
                  Select Gas Meter
                </label>
                <select
                  name="gasMeter1"
                  value={formData.gasMeter1}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500"
                >
                  <option>Encoder only</option>
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {formData.operatingMode && (
        <div className="border border-gray-200 rounded-md shadow-sm p-3 space-y-2.5 animate-fade-in-up">
          <h3 className="text-sm font-semibold text-gray-800">Volume</h3>
          <div className="grid grid-cols-2 gap-x-3 gap-y-3 text-xs">
            <div className="space-y-1">
              <label className="block font-medium">Max Flow Rate</label>
              <input
                name="maxFlowRate"
                value={formData.maxFlowRate}
                onChange={handleInputChange}
                type="number"
                placeholder="Please add Value"
                className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500"
              />
            </div>
            <div className="space-y-1">
              <label className="block font-medium">Max Total Volume</label>
              <input
                name="maxTotalVolume"
                value={formData.maxTotalVolume}
                onChange={handleInputChange}
                type="number"
                placeholder="Please add Value"
                className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500"
              />
            </div>
            <div className="space-y-1">
              <label className="block font-medium">
                Min Operational Volume
              </label>
              <input
                name="minOperationalVolume"
                value={formData.minOperationalVolume}
                onChange={handleInputChange}
                type="number"
                placeholder="Please add Value"
                className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500"
              />
            </div>
            <div className="space-y-1">
              <label className="block font-medium">Bi-Directional</label>
              <select
                name="isBiDirectional"
                value={formData.isBiDirectional}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500"
              >
                <option value="enable">Enable</option>
                <option value="disable">Disable</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-1">
        <button
          onClick={onClose}
          className="px-5 py-1.5 rounded-full font-semibold text-xs text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-5 py-1.5 rounded-full font-semibold text-xs text-black bg-yellow-500 hover:bg-yellow-600 transition-colors border-2 border-white"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default VolumeForm;
