import React, { useState } from "react";

// Update props: onClose stays, onNext is added to trigger the next step
interface AddDeviceFormProps {
  onClose: () => void;
  onNext: (deviceType: string) => void;
}

const AddDeviceForm: React.FC<AddDeviceFormProps> = ({ onClose, onNext }) => {
  // Add state to track the selected device type
  const [selectedType, setSelectedType] = useState<string>("");

  const handleNextClick = () => {
    // Only proceed if a type has been selected
    if (selectedType) {
      onNext(selectedType);
    }
  };

  return (
    <>
      {/* Form Section */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Device Type
        </label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
        >
          <option value="" disabled>
            Please select
          </option>
          <option value="Temperature">Temperature</option>
          <option value="Pressure">Pressure</option>
          <option value="Volume">Volume</option>
          <option value="Conversion">Conversion</option>
        </select>
      </div>

      {/* Buttons Section */}
      <div className="flex justify-end gap-3 pt-8">
        <button
          onClick={onClose}
          className="px-6 py-2 rounded-full font-semibold text-sm bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors shadow-sm"
        >
          Cancel
        </button>
        {/* Changed button to "Next" */}
        <button
          onClick={handleNextClick}
          disabled={!selectedType} // Button is disabled until a selection is made
          className="px-6 py-2 rounded-full font-semibold text-sm bg-yellow-400 text-black hover:bg-yellow-500 transition-colors shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </>
  );
};

export default AddDeviceForm;
