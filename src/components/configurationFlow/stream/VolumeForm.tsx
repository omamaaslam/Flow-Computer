import { observer } from "mobx-react-lite";
import { volumeFormStore } from "../../../stores/VolumeForm";

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

const VolumeForm = observer(({ onClose }: VolumeFormProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    volumeFormStore.setField(name as keyof typeof volumeFormStore, value);
  };

  const handleSave = () => {
    console.log("Form Data:", volumeFormStore.formData);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="flex flex-col gap-3 p-4">
      <h2 className="text-lg font-semibold text-gray-800">Configure Volume</h2>

      <div className="border border-gray-200 rounded-md shadow-sm p-4 space-y-4">
        <div className="space-y-2">
          <label className="block font-medium text-sm text-gray-700">
            Operating Mode
          </label>
          <select
            value={volumeFormStore.operatingMode}
            onChange={(e) => volumeFormStore.setField("operatingMode", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          >
            {operatingModes.map((mode) => (
              <option key={mode.value} value={mode.value}>
                {mode.label}
              </option>
            ))}
          </select>
        </div>

        {volumeFormStore.operatingMode === "encoderOnly" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block font-medium text-sm text-gray-700">
                Select Gas Meter
              </label>
              <select
                name="gasMeter"
                value={volumeFormStore.gasMeter}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500"
              >
                <option>Encoder only</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block font-medium text-sm text-gray-700">
                  Qmin Alarm
                </label>
                <input
                  name="qminAlarm"
                  type="number"
                  value={volumeFormStore.qminAlarm}
                  onChange={handleInputChange}
                  placeholder="Please add Value"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-medium text-sm text-gray-700">
                  Qmax Alarm
                </label>
                <input
                  name="qmaxAlarm"
                  type="number"
                  value={volumeFormStore.qmaxAlarm}
                  onChange={handleInputChange}
                  placeholder="Please add Value"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-medium text-sm text-gray-700">
                  Qmin Warn
                </label>
                <input
                  name="qminWarn"
                  type="number"
                  value={volumeFormStore.qminWarn}
                  onChange={handleInputChange}
                  placeholder="Please add Value"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-medium text-sm text-gray-700">
                  Qmax Warn
                </label>
                <input
                  name="qmaxWarn"
                  type="number"
                  value={volumeFormStore.qmaxWarn}
                  onChange={handleInputChange}
                  placeholder="Please add Value"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block font-medium text-sm text-gray-700">
                  Creep Mode
                </label>
                <select
                  name="creepMode"
                  value={volumeFormStore.creepMode}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500"
                >
                  <option>Time Limited</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block font-medium text-sm text-gray-700">
                  m³/h
                </label>
                <input
                  name="m3h"
                  type="number"
                  value={volumeFormStore.m3h}
                  onChange={handleInputChange}
                  placeholder="Please add Value"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-medium text-sm text-gray-700">
                  Time Second(s)
                </label>
                <input
                  name="timeSeconds"
                  type="number"
                  value={volumeFormStore.timeSeconds}
                  onChange={handleInputChange}
                  placeholder="Please add Value"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={handleCancel}
          className="px-6 py-2 rounded-md font-medium text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 rounded-md font-medium text-sm text-white bg-yellow-500 hover:bg-yellow-600 transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  );
});

export default VolumeForm;