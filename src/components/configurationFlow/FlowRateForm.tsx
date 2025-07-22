import { observer } from "mobx-react-lite";
import { useState } from "react";

// NOTE: A mock store is created here for demonstration purposes.
// You should replace this with your actual MobX store import.
class FlowRateFormStore {
  calculationMethod: string = "Software Based";
  device: string = "";
  minAlarmFlowrate: string = "";
  maxAlarmFlowrate: string = "";
  minWarningFlowrate: string = "";
  maxWarningFlowrate: string = "";
  creepMode: string = "Disable";
  creepFlowrate: string = "";
  creepTime: string = "";

  [key: string]: string | ((key: string, value: string) => void);

  setField(key: string, value: string) {
    if (typeof this[key] !== "function") {
      this[key] = value;
    }
  }
}

const flowRateFormStore = new FlowRateFormStore();

interface FlowRateFormProps {
  onClose: () => void;
}

const FlowRateForm = observer(({ onClose }: FlowRateFormProps) => {
  // Local state to manage UI visibility based on selections
  const [creepMode, setCreepMode] = useState(flowRateFormStore.creepMode);
  const [calculationMethod, setCalculationMethod] = useState(flowRateFormStore.calculationMethod);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Update local state for conditional UI
    if (name === 'creepMode') {
      setCreepMode(value);
    }
    if (name === 'calculationMethod') {
      setCalculationMethod(value);
    }
    
    // Update the MobX store
    flowRateFormStore.setField(name, value);
  };

  const handleSave = () => {
    console.log("Flow Rate Form Data:", { ...flowRateFormStore });
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-xs text-gray-700">
        {/* Row 0: Calculation Method */}
        <div className="space-y-1">
          <label className="block font-medium text-xs">Calculation method</label>
          <select
            name="calculationMethod"
            value={calculationMethod}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-sm px-2 py-1.5 text-xs shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          >
            <option value="Software Based">Software Based</option>
            <option value="Device Based">Device Based</option>
          </select>
        </div>
        <div className="space-y-1">
          {calculationMethod === 'Device Based' && (
            <>
              <label className="block font-medium text-xs">Device List</label>
              <select
                name="device"
                defaultValue={flowRateFormStore.device}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-sm px-2 py-1.5 text-xs shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
              >
                <option>Device 1</option>
                <option>Device 2</option>
                <option>Device 3</option>
              </select>
            </>
          )}
        </div>

        {/* Row 1: Alarms */}
        <div className="space-y-1">
          <label className="block font-medium text-xs">Qmin Alarm</label>
          <input
            name="minAlarmFlowrate"
            type="text"
            defaultValue={flowRateFormStore.minAlarmFlowrate}
            onChange={handleInputChange}
            placeholder="Please add Value"
            className="w-full border border-gray-300 rounded-sm px-2 py-1.5 text-xs shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>
        <div className="space-y-1">
          <label className="block font-medium text-xs">Qmax Alarm</label>
          <input
            name="maxAlarmFlowrate"
            type="text"
            defaultValue={flowRateFormStore.maxAlarmFlowrate}
            onChange={handleInputChange}
            placeholder="Please add Value"
            className="w-full border border-gray-300 rounded-sm px-2 py-1.5 text-xs shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>

        {/* Row 2: Warnings */}
        <div className="space-y-1">
          <label className="block font-medium text-xs">Qmin Warn</label>
          <input
            name="minWarningFlowrate"
            type="text"
            defaultValue={flowRateFormStore.minWarningFlowrate}
            onChange={handleInputChange}
            placeholder="Please add Value"
            className="w-full border border-gray-300 rounded-sm px-2 py-1.5 text-xs shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>
        <div className="space-y-1">
          <label className="block font-medium text-xs">Qmax Warn</label>
          <input
            name="maxWarningFlowrate"
            type="text"
            defaultValue={flowRateFormStore.maxWarningFlowrate}
            onChange={handleInputChange}
            placeholder="Please add Value"
            className="w-full border border-gray-300 rounded-sm px-2 py-1.5 text-xs shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>
        
        {/* Row 3: Creep Mode Dropdown */}
        <div className="space-y-1 col-span-2">
            <label className="block font-medium text-xs">Creep Mode</label>
            <select
                name="creepMode"
                value={creepMode}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-sm px-2 py-1.5 text-xs shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            >
                <option value="Disable">Disable</option>
                <option value="Enable">Enable</option>
            </select>
        </div>

        {/* Conditional Row 4: Creep Fields */}
        {creepMode === 'Enable' && (
            <>
                <div className="space-y-1">
                    <label className="block font-medium text-xs">Creep flowrate</label>
                    <input
                        name="creepFlowrate"
                        type="text"
                        defaultValue={flowRateFormStore.creepFlowrate}
                        onChange={handleInputChange}
                        placeholder="Please add Value"
                        className="w-full border border-gray-300 rounded-sm px-2 py-1.5 text-xs shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                </div>
                <div className="space-y-1">
                    <label className="block font-medium text-xs">Creep Time</label>
                    <input
                        name="creepTime"
                        type="text"
                        defaultValue={flowRateFormStore.creepTime}
                        onChange={handleInputChange}
                        placeholder="Please add Value"
                        className="w-full border border-gray-300 rounded-sm px-2 py-1.5 text-xs shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                </div>
            </>
        )}
      </div>

     <div className="flex justify-end gap-2 pt-3">
        <button
          onClick={handleCancel}
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
});

export default FlowRateForm;