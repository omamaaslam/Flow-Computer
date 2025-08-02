
// UI component for the Gas Device Form.

const GasDeviceForm = () => {
  return (
    <div className="flex flex-col space-y-6 p-4">
      {/* Static "General" heading styled like an active tab */}
      
      
      {/* Form Fields */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        {/* Device Manufacturer */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-600">Device Manufacturer</label>
          <select 
            className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm text-gray-400 bg-white shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          >
            <option value="" disabled selected>Please set device manufacturer</option>
            <option value="RMA">RMA</option>
            <option value="Siemens">Siemens</option>
          </select>
        </div>

        {/* Serial Number */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-600">Serial Number</label>
          <input 
            type="text"
            placeholder="Please set serial number"
            className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm placeholder:text-gray-400 shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>

        {/* Model */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-600">Model</label>
          <input 
            type="text"
            placeholder="Please set Device model"
            className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm placeholder:text-gray-400 shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>

        {/* Tag Name */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-600">Tag Name</label>
          <input 
            type="text"
            placeholder="Please set tag name"
            className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm placeholder:text-gray-400 shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>

        {/* G-Size */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-600">G-Size</label>
          <input 
            type="text"
            placeholder="Please set G-size"
            className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm placeholder:text-gray-400 shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <button className="px-6 py-2 rounded-full font-semibold text-sm bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors shadow-sm">Cancel</button>
        <button className="px-6 py-2 rounded-full font-semibold text-sm bg-yellow-400 text-black hover:bg-yellow-500 transition-colors shadow-sm">Save</button>
      </div>
    </div>
  );
};

export default GasDeviceForm;