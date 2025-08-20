// File: ConversionForm.tsx

import React from "react";
import { observer } from "mobx-react-lite";
import type globalStore from "../../../stores/GlobalStore";
import type {
  CompressibilityKFactorConfig,
  GasComponent,
} from "../../../types/streamConfig";
import { toJS } from "mobx";

interface ConversionFormProps {
  store: typeof globalStore;
  config: CompressibilityKFactorConfig;
  onSave: () => void;
  onClose: () => void;
  isSaving: boolean;
}

const ConversionForm: React.FC<ConversionFormProps> = observer(
  ({ store, config, onSave, onClose, isSaving }) => {
    console.log("Config in Form:", toJS(config));
    const availableDevices = store.allDevices;

    const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      config.active_method = e.target.value;
    };

    // UPDATED HANDLER: It now uses the component's key to modify the nested methods object
    const handleComponentInputChange = (
      componentKey: string,
      field: keyof GasComponent,
      value: string | number
    ) => {
      const activeMethodData = config.methods[config.active_method];
      if (!activeMethodData) return; // Safety check

      const component = activeMethodData[componentKey];
      if (component) {
        if (field === "value") {
          component[field] = parseFloat(value as string) || 0;
        } else {
          // This covers linked_device_id
          (component[field] as string) = value as string;
        }
      }
    };

    // NEW LOGIC: This creates the list for the UI by combining the base structure
    // with the actual data from the active method.
    const componentsToDisplay = React.useMemo(() => {
      const activeMethodComponents = config.methods[config.active_method];

      // If there's no data for the active method, return the base list with its default values.
      if (!activeMethodComponents) {
        return config.gas_components;
      }

      // Map over the base list to maintain order, but merge in values from the active method.
      return config.gas_components.map((baseComponent) => {
        const activeData = activeMethodComponents[baseComponent.key];
        return {
          ...baseComponent, // Takes key, display_name, unit from the base structure
          ...(activeData || {}), // Overwrites with value and linked_device_id from the live data
        };
      });
    }, [config.active_method, config.gas_components, config.methods]);

    return (
      <div className="flex flex-col gap-4">
        <div className="space-y-1">
          <label className="block font-medium text-xs text-gray-700">
            K-Factor Method
          </label>
          <select
            value={config.active_method}
            onChange={handleMethodChange}
            className="w-full max-w-xs border border-gray-200 rounded-sm px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          >
            {/* Dynamically generate options from the data */}
            {Object.keys(config.methods).map((methodName) => (
              <option key={methodName} value={methodName}>
                {methodName}
              </option>
            ))}
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
            {/* We now map over our new derived list */}
            {componentsToDisplay.map((component: GasComponent) => {
              // (Includes previous focus fix by creating an anonymous observer)
              const Row = observer(() => (
                <div className="grid grid-cols-[3fr_1.5fr_2.5fr_2.5fr] items-center text-xs border-b last:border-b-0">
                  <div className="font-medium text-gray-800 px-3 py-1.5">
                    {component.display_name} ({component.key})
                  </div>
                  <div className="text-gray-700 px-3 py-1.5">
                    {component.unit}
                  </div>
                  <div className="px-2 py-1.5">
                    <select
                      value={component.linked_device_id || ""} // Use empty string as fallback
                      onChange={(e) =>
                        handleComponentInputChange(
                          component.key, // Pass component key, not index
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
                      onChange={(e) =>
                        handleComponentInputChange(
                          component.key, // Pass component key, not index
                          "value",
                          e.target.value
                        )
                      }
                      placeholder="Enter value"
                      className="w-full border border-gray-300 rounded-sm px-2 py-1 text-xs shadow-sm focus:ring-1 focus:ring-yellow-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>
              ));
              return <Row key={component.key} />;
            })}
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
