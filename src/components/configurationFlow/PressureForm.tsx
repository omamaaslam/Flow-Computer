import { Gauge } from "lucide-react";

interface PressureFormProps {
  onClose: () => void;
}

const PressureForm = ({ onClose }: PressureFormProps) => {
  return (
    <>
      {/* Main grid with persistent two-column layout and reduced gaps */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm text-gray-800">
        {/* --- COLUMN 1 --- */}

        {/* Live Operating Pressure (Compact) */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 p-2 border border-dashed border-yellow-400 bg-white rounded-md shadow-sm">
            <label className="block font-medium text-xs">
              Live Operating Pressure (P)
            </label>
            <Gauge className="text-yellow-500" size={16} />
            <span className="font-semibold text-xs text-yellow-500">
              1.5 bar{" "}
            </span>
          </div>
        </div>

        {/* Substitute Pressure (Compact) */}
        <div className="space-y-1">
          <label className="block font-medium text-xs">
            Substitute Pressure (P)
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
            <option>Pressure S1</option>
            <option>Pressure S2</option>
            <option>Pressure S3</option>
          </select>
        </div>

        {/* Min Op Pressure (Compact) */}
        <div className="space-y-1">
          <label className="block font-medium text-xs">
            Min Op. Pressure (Pmin)
          </label>
          <input
            type="text"
            placeholder="Please add Value"
            className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>

        {/* Base Pressure (Compact) */}
        <div className="space-y-1">
          <label className="block font-medium text-xs">
            Base Pressure (BP)
          </label>
          <input
            type="text"
            placeholder="Please add Value"
            className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>

        {/* Max Op Pressure (Compact) */}
        <div className="space-y-1">
          <label className="block font-medium text-xs">
            Max Op. Pressure (Pmax)
          </label>
          <input
            type="text"
            placeholder="Please add Value"
            className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>

        {/* Pressure Unit (Compact) */}
        <div className="space-y-1">
          <label className="block font-medium text-xs">Pressure Unit</label>
          <select className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500">
            <option>bar</option>
            <option>psi</option>
            <option>kPa</option>
            <option>atm</option>
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

export default PressureForm;
