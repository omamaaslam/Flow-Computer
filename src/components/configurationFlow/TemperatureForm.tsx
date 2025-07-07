import { Thermometer } from "lucide-react";

interface TemperatureFormProps {
  onClose: () => void;
}

const TemperatureForm = ({ onClose }: TemperatureFormProps) => {
  return (
    <>
      {/* Main grid with persistent two-column layout and reduced gaps */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm text-gray-800">
        {/* --- COLUMN 1 --- */}

        {/* Live Operating Temp (Compact) */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 p-2 border border-dashed border-yellow-400 bg-white rounded-md shadow-sm">
            <label className="block font-medium text-xs">
              Live Operating Tem. (T)
            </label>
            <Thermometer className="text-yellow-500" size={16} />
            <span className="font-semibold text-xs text-yellow-500">
              220°F (90°C)
            </span>
          </div>
        </div>

        {/* Substitute Temperature (Compact) */}
        <div className="space-y-1">
          <label className="block font-medium text-xs">
            Substitute Temperature (T)
          </label>
          <input
            type="text"
            placeholder="Please add Value"
            className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>

        {/* Device (Compact) */}
        <div className="space-y-1">
          <label className="block font-medium text-xs">Device</label>
          <select className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500">
            <option>Temperature S1</option>
            <option>Temperature S2</option>
            <option>Temperature S3</option>
          </select>
        </div>

        {/* Min Op Temp (Compact) */}
        <div className="space-y-1">
          <label className="block font-medium text-xs">
            Min Op. Temp. (Tmin)
          </label>
          <input
            type="text"
            placeholder="Please add Value"
            className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>

        {/* Base Temp (Compact) */}
        <div className="space-y-1">
          <label className="block font-medium text-xs">
            Base Temperature (BT)
          </label>
          <input
            type="text"
            placeholder="Please add Value"
            className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>

        {/* Max Op Temp (Compact) */}
        <div className="space-y-1">
          <label className="block font-medium text-xs">
            Max Op. Temp. (Tmax)
          </label>
          <input
            type="text"
            placeholder="Please add Value"
            className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>

        {/* Temperature Unit (Normal state) */}
        <div className="space-y-1">
          <label className="block font-medium text-xs">Temperature Unit</label>
          <select className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500">
            <option>°C</option>
            <option>°F</option>
            <option>K</option>
          </select>
        </div>
      </div>

      {/* Footer Buttons (Compact) */}
      <div className="flex justify-end gap-2 mt-4 pt-3">
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
    </>
  );
};

export default TemperatureForm;
