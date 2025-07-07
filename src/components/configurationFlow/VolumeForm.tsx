import { useState, useEffect } from "react";

// --- Data for the dropdown ---
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
  onClose: () => void;
}

const VolumeForm = ({ onClose }: VolumeFormProps) => {
  const [operatingMode, setOperatingMode] = useState("");

  useEffect(() => {
    const titleElement = document.getElementById("modal-title");
    const headerDivider = titleElement?.nextElementSibling;

    if (titleElement) {
      const headerContainer = titleElement.parentElement;
      if (headerContainer) {
        if (operatingMode) {
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
  }, [operatingMode]);

  return (
    // --- Overall gap between sections reduced ---
    <div className="flex flex-col gap-3">
      {/* --- Card 1: Made more compact --- */}
      <div className="border border-gray-200 rounded-md shadow-sm p-3 space-y-3">
        <div className="space-y-1">
          <label className="block font-medium text-xs text-gray-700">
            Operating Mode
          </label>
          <select
            value={operatingMode}
            onChange={(e) => setOperatingMode(e.target.value)}
            // --- Input height and font size reduced ---
            className={`w-full border border-gray-200 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 ${
              !operatingMode ? "text-gray-400" : "text-gray-800"
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

        {operatingMode && (
          <div className="animate-fade-in-up">
            {operatingMode === "twoPulse1-1" && (
              <div className="grid grid-cols-2 gap-x-3">
                <div className="space-y-1">
                  <label className="block font-medium text-xs text-gray-700">
                    Select Gas Meter
                  </label>
                  <select className="w-full border border-gray-200 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500">
                    <option>Encoder only</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block font-medium text-xs text-gray-700">
                    Select Gas Meter
                  </label>
                  <select className="w-full border border-gray-200 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500">
                    <option>Encoder only</option>
                  </select>
                </div>
              </div>
            )}
            {operatingMode !== "twoPulse1-1" && (
              <div className="space-y-1">
                <label className="block font-medium text-xs text-gray-700">
                  Select Gas Meter
                </label>
                <select className="w-full border border-gray-200 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500">
                  <option>Encoder only</option>
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- Card 2: Made more compact --- */}
      {operatingMode && (
        <div className="border border-gray-200 rounded-md shadow-sm p-3 space-y-2.5 animate-fade-in-up">
          <h3 className="text-sm font-semibold text-gray-800">Volume</h3>
          <div className="grid grid-cols-2 gap-x-3 gap-y-3 text-xs">
            {/* All items updated for compact layout */}
            <div className="space-y-1">
              <label className="block font-medium">Qmin Alarm</label>
              <input
                type="text"
                placeholder="Please add Value"
                className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500"
              />
            </div>
            <div className="space-y-1">
              <label className="block font-medium">Qmax Alarm</label>
              <input
                type="text"
                placeholder="Please add Value"
                className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500"
              />
            </div>
            <div className="space-y-1">
              <label className="block font-medium">Qmin Warn</label>
              <input
                type="text"
                placeholder="Please add Value"
                className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500"
              />
            </div>
            <div className="space-y-1">
              <label className="block font-medium">Qmax Warn</label>
              <input
                type="text"
                placeholder="Please add Value"
                className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500"
              />
            </div>
            <div className="space-y-1">
              <label className="block font-medium">Creep Mode</label>
              <select className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500">
                <option>Time Limited</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block font-medium">Flow-rate label</label>
              <select className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500">
                <option>Time Limited</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block font-medium">m³/h</label>
              <input
                type="text"
                placeholder="Please add Value"
                className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500"
              />
            </div>
            <div className="space-y-1">
              <label className="block font-medium">Time Second(s)</label>
              <input
                type="text"
                placeholder="Please add Value"
                className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* --- Footer Buttons: Made more compact --- */}
      <div className="flex justify-end gap-2 pt-1">
        <button
          onClick={onClose}
          className="px-5 py-1.5 rounded-full font-semibold text-xs text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button className="px-5 py-1.5 rounded-full font-semibold text-xs text-black bg-yellow-500 hover:bg-yellow-600 transition-colors">
          Save
        </button>
      </div>
    </div>
  );
};

export default VolumeForm;
