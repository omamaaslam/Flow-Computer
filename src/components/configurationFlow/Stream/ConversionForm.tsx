import React from "react";
import { observer } from "mobx-react-lite";
import type globalStore from "../../../stores/GlobalStore";
import type {
  CompressibilityKFactorConfig,
  GasComponent,
} from "../../../types/streamConfig";

interface ConversionFormProps {
  store: typeof globalStore;
  config: CompressibilityKFactorConfig;
  onSave: () => void;
  onClose: () => void;
  isSaving: boolean;
}

const ConversionForm: React.FC<ConversionFormProps> = observer(
  ({ store, config, onSave, onClose, isSaving }) => {
    const availableDevices = store.allDevices;
    const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      config.k_factor_method = e.target.value;
    };

    const handleComponentInputChange = (
      index: number,
      field: keyof GasComponent,
      value: string
    ) => {
      const component = config.gas_components[index];
      if (field === "value") {
        component[field] = parseFloat(value) || 0;
      } else {
        (component[field] as string) = value;
      }
    };

    return (
      <div className="flex flex-col gap-4">
        <div className="space-y-1">
          <label className="block font-medium text-xs text-gray-700">
            K-Factor Method
          </label>
          <select
            value={config.k_factor_method}
            onChange={handleMethodChange}
            className="w-full max-w-xs border border-gray-200 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          >
            <option value="AGA8_DC92">AGA8_DC92</option>
            <option value="GERG88_1">GERG88_1</option>
            <option value="ISO6976_2">ISO6976_2</option>
          </select>
        </div>
        <div className="border border-gray-200 rounded-md overflow-hidden shadow-sm">
          <div className="grid grid-cols-[3fr_1.5fr_2.5fr_2.5fr] items-center border-b bg-gray-50 font-semibold text-xs text-gray-700">
            <div className="px-3 py-2">Component</div>
            <div className="px-3 py-2">Unit</div>
            <div className="px-3 py-2">Link Device</div>
            <div className="px-3 py-2">Value</div>
          </div>
          <div>
            {config.gas_components.map(
              (component: GasComponent, index: number) => (
                <div
                  key={component.key}
                  className="grid grid-cols-[3fr_1.5fr_2.5fr_2.5fr] items-center text-xs border-b last:border-b-0"
                >
                  <div className="font-medium text-gray-800 px-3 py-1.5">
                    {component.display_name} ({component.key})
                  </div>
                  <div className="text-gray-700 px-3 py-1.5">
                    {component.unit}
                  </div>
                  <div className="px-2 py-1.5">
                    <select
                      value={component.linked_device_id}
                      onChange={(e) =>
                        handleComponentInputChange(
                          index,
                          "linked_device_id",
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-300 rounded-sm px-2 py-1 text-xs shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                    >
                      <option value="">None</option>
                      {availableDevices.map((device) => (
                        <option key={device.id} value={device.id}>
                          {device.name} ({device.id})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="px-2 py-1.5">
                    <input
                      type="number"
                      value={component.value}
                      disabled={!!component.linked_device_id}
                      onChange={(e) =>
                        handleComponentInputChange(
                          index,
                          "value",
                          e.target.value
                        )
                      }
                      placeholder="Enter value"
                      className="w-full border border-gray-300 rounded-sm px-2 py-1 text-xs shadow-sm focus:ring-1 focus:ring-yellow-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-5 py-1.5 rounded-full font-semibold text-xs text-gray-700 bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="px-5 py-1.5 rounded-full font-semibold text-xs text-black bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 disabled:cursor-wait"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    );
  }
);

export default ConversionForm;
