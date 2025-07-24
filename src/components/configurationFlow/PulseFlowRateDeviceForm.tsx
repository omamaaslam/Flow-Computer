import { useState } from "react";

// A simple, error-free UI component for the Pulse Flow Rate Device Form.
const PulseFlowRateDeviceForm = () => {
  const [activeTab, setActiveTab] = useState<"general" | "parameters">("general");
  // State to manage the selected frequency type for the conditional dropdown
  const [frequencyType, setFrequencyType] = useState<"LF" | "HF">("LF");

  // Define options for the conditional Frequency dropdown
  const lfOptions = [2, 5];
  const hfOptions = [5, 20, 50, 100, 250, 500, 1000, 1500, 2000, 3000, 4000];
  const frequencyOptions = frequencyType === "LF" ? lfOptions : hfOptions;

  return (
    <div className="flex flex-col space-y-6 p-4">
      {/* Tab Switcher */}
      <div className="flex bg-gray-200 p-1 rounded-lg">
        <button 
          onClick={() => setActiveTab("general")} 
          className={`w-1/2 py-2.5 text-sm font-semibold rounded-md transition-all duration-300 ${ activeTab === "general" ? "bg-yellow-400 text-black shadow-md" : "text-gray-500 hover:bg-gray-300" }`}
        >
          General
        </button>
        <button 
          onClick={() => setActiveTab("parameters")} 
          className={`w-1/2 py-2.5 text-sm font-semibold rounded-md transition-all duration-300 ${ activeTab === "parameters" ? "bg-yellow-400 text-black shadow-md" : "text-gray-500 hover:bg-gray-300" }`}
        >
          Parameters
        </button>
      </div>
      
      {/* Form Fields based on active tab */}
      <div>
        {activeTab === "general" && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {/* Device Manufacturer */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">Device Manufacturer</label>
              <select className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm text-gray-400 bg-white shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500">
                <option value="" disabled selected>Please set device manufacturer</option>
                <option value="RMA">RMA</option>
                <option value="Siemens">Siemens</option>
              </select>
            </div>

            {/* Serial Number */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">Serial Number</label>
              <input type="text" placeholder="Please set serial number" className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm placeholder:text-gray-400 shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500" />
            </div>

            {/* Model */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">Model</label>
              <input type="text" placeholder="Please set Device model" className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm placeholder:text-gray-400 shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500" />
            </div>

            {/* Tag Name */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">Tag Name</label>
              <input type="text" placeholder="Please set tag name" className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm placeholder:text-gray-400 shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500" />
            </div>

            {/* G-Size */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">G-Size</label>
              <input type="text" placeholder="Please set G-size" className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm placeholder:text-gray-400 shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500" />
            </div>
          </div>
        )}

        {activeTab === "parameters" && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {/* Frequency Type */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">Frequency Type</label>
              <select 
                value={frequencyType}
                onChange={(e) => setFrequencyType(e.target.value as "LF" | "HF")}
                className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm bg-white shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
              >
                <option value="LF">Low Frequency (LF)</option>
                <option value="HF">High Frequency (HF)</option>
              </select>
            </div>

            {/* Frequency */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">Frequency (Hz)</label>
              <select className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm bg-white shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500">
                {frequencyOptions.map(freq => (
                  <option key={freq} value={freq}>{`${freq}${frequencyType === 'HF' ? ' Hz' : ''}`}</option>
                ))}
              </select>
            </div>

            {/* Pulse Duration */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">Pulse Duration (ms)</label>
              <input type="text" placeholder="Please set value" className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm placeholder:text-gray-400 shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500" />
            </div>

            {/* Pulse Pause */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">Pulse Pause (ms)</label>
              <input type="text" placeholder="Please set value" className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm placeholder:text-gray-400 shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500" />
            </div>
            
            {/* F-Factor */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">Scaling Factor (Imp/Q)</label>
              <input type="text" placeholder="Please set value" className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm placeholder:text-gray-400 shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500" />
            </div>

            {/* F-Offset */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">Offset</label>
              <input type="text" placeholder="Please set value" className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm placeholder:text-gray-400 shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500" />
            </div>
             {/* Minimum Flowrate */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">Minimum Flowrate</label>
              <input type="text" placeholder="Please set Minimum Flowrate" className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm placeholder:text-gray-400 shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500" />
            </div>

            {/* Maximum Flowrate */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">Maximum Flowrate</label>
              <input type="text" placeholder="Please set Maximum Flowrate" className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm placeholder:text-gray-400 shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500" />
            </div>
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button className="px-6 py-2 rounded-full font-semibold text-sm bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors shadow-sm">Cancel</button>
        <button className="px-6 py-2 rounded-full font-semibold text-sm bg-yellow-400 text-black hover:bg-yellow-500 transition-colors shadow-sm">Save</button>
      </div>
    </div>
  );
};

export default PulseFlowRateDeviceForm;