// src/components/configurationFlow/PressureForm.tsx
import React, { useState, useEffect } from "react";
import { Gauge } from "lucide-react";
import type { PressureConfig } from "../../types/streamConfig";

interface PressureFormProps {
  initialData: PressureConfig;
  onSave: (config: PressureConfig) => void;
  onClose: () => void;
}

const PressureForm: React.FC<PressureFormProps> = ({
  initialData,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<PressureConfig>(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm text-gray-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 p-2 border border-dashed border-yellow-400 bg-white rounded-md shadow-sm">
            <label className="block font-medium text-xs">
              Live Operating Pressure (P)
            </label>
            <Gauge className="text-yellow-500" size={16} />
            <span className="font-semibold text-xs text-yellow-500">
              {formData.livePressure}
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <label className="block font-medium text-xs">
            Substitute Pressure (P)
          </label>
          <input
            name="substitutePressure"
            type="text"
            value={formData.substitutePressure}
            onChange={handleInputChange}
            placeholder="Please add Value"
            className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>
        <div className="space-y-1">
          <label className="block font-medium text-xs">Device</label>
          <select
            name="device"
            value={formData.device}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          >
            <option>Pressure S1</option>
            <option>Pressure S2</option>
            <option>Pressure S3</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="block font-medium text-xs">
            Min Op. Pressure (Pmin)
          </label>
          <input
            name="minOpPressure"
            type="text"
            value={formData.minOpPressure}
            onChange={handleInputChange}
            placeholder="Please add Value"
            className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>
        <div className="space-y-1">
          <label className="block font-medium text-xs">
            Base Pressure (BP)
          </label>
          <input
            name="basePressure"
            type="text"
            value={formData.basePressure}
            onChange={handleInputChange}
            placeholder="Please add Value"
            className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>
        <div className="space-y-1">
          <label className="block font-medium text-xs">
            Max Op. Pressure (Pmax)
          </label>
          <input
            name="maxOpPressure"
            type="text"
            value={formData.maxOpPressure}
            onChange={handleInputChange}
            placeholder="Please add Value"
            className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>
        <div className="space-y-1">
          <label className="block font-medium text-xs">Pressure Unit</label>
          <select
            name="pressureUnit"
            value={formData.pressureUnit}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          >
            <option value="bar">bar</option>
            <option value="psi">psi</option>
            <option value="kPa">kPa</option>
            <option value="atm">atm</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4 pt-3">
        <button
          onClick={onClose}
          className="px-5 py-1.5 rounded-full font-semibold text-xs text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-5 py-1.5 rounded-full font-semibold text-xs text-black bg-yellow-500 hover:bg-yellow-600 transition-colors"
        >
          Save
        </button>
      </div>
    </>
  );
};

export default PressureForm;
