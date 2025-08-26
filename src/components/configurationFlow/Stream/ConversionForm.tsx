// File: ConversionForm.tsx

import React from "react";
import { observer, useLocalObservable } from "mobx-react-lite"; // --- MODIFICATION: Imported useLocalObservable
import type globalStore from "../../../stores/GlobalStore";
import type { GasComponent } from "../../../types/streamConfig";
import type { Stream } from "../../../stores/Stream";

type Device = { id: string; name: string };

interface ConversionFormProps {
  store: typeof globalStore;
  stream: Stream;
  onSave: () => void;
  onClose: () => void;
  isSaving: boolean;
}

// --- MODIFICATION START: Row logic extracted into its own component ---
interface ComponentRowProps {
  component: GasComponent;
  availableDevices: Device[];
  resultForStream: any; // Assuming 'any' type for simplicity based on original code
  onInputChange: (
    componentKey: string,
    field: keyof GasComponent,
    value: string | number
  ) => void;
}

const ComponentRow: React.FC<ComponentRowProps> = observer(
  ({ component, availableDevices, resultForStream, onInputChange }) => {
    // useLocalObservable is the modern MobX way to handle component-local state.
    // This state is temporary and only exists for this row's input field.
    const localState = useLocalObservable(() => ({
      inputValue: component.value.toString(),
      setInputValue(value: string) {
        this.inputValue = value;
      },
    }));

    const relevantDevices = availableDevices.filter(
      (device) => device.name.toLowerCase() === component.key.toLowerCase()
    );

    let liveValue: string | number = "0.0000";
    if (resultForStream && resultForStream[component.key] !== undefined) {
      const val = resultForStream[component.key];
      liveValue = typeof val === "number" ? val.toFixed(4) : val;
    }

    return (
      <div className="grid grid-cols-[2fr_1.5fr_2.5fr_2.5fr] items-center text-xs border-b last:border-b-0">
        <div className="font-medium text-gray-800 px-3 py-1.5">
          {component.display_name}
        </div>
        <div className="font-medium text-gray-800 px-3 py-1.5">{liveValue}</div>
        <div className="px-2 py-1.5">
          <select
            value={component.linked_device_id || ""}
            onChange={(e) =>
              onInputChange(component.key, "linked_device_id", e.target.value)
            }
            className="w-full border border-gray-300 rounded-sm px-2 py-1 text-xs shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          >
            <option value="">None</option>
            {relevantDevices.map((device: Device) => (
              <option key={device.id} value={device.id}>
                {device.name} ({device.id})
              </option>
            ))}
          </select>
        </div>
        <div className="px-2 py-1.5">
          <input
            type="number"
            value={localState.inputValue}
            onChange={(e) => localState.setInputValue(e.target.value)} // Updates fast, local state
            onBlur={
              () => onInputChange(component.key, "value", localState.inputValue) // Updates global store on blur
            }
            placeholder="Enter value"
            className="w-full border border-gray-300 rounded-sm px-2 py-1 text-xs shadow-sm focus:ring-1 focus:ring-yellow-500"
          />
        </div>
      </div>
    );
  }
);
// --- MODIFICATION END ---

const ConversionForm: React.FC<ConversionFormProps> = observer(
  ({ store, stream, onSave, onClose, isSaving }) => {
    const config = stream.stream_config.compressibility_kfactor_config;
    const availableDevices = store.allDevices;

    const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      config.active_method = e.target.value;
    };

    const handleComponentInputChange = (
      componentKey: string,
      field: keyof GasComponent,
      value: string | number
    ) => {
      const activeMethodData = config.methods[config.active_method];
      if (!activeMethodData) return;
      const component = activeMethodData[componentKey];
      if (component) {
        if (field === "value") {
          const parsedValue = parseFloat(value as string);
          component.value = isNaN(parsedValue) ? 0 : parsedValue;
        } else if (field === "linked_device_id") {
          component.linked_device_id = value as string;
        }
      }
    };

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
            {Object.keys(config.methods).map((methodName) => (
              <option key={methodName} value={methodName}>
                {methodName}
              </option>
            ))}
          </select>
        </div>

        {stream.showComponentTable && (
          <div className="border border-gray-200 rounded-md overflow-hidden shadow-sm">
            <div className="grid grid-cols-[3fr_1.5fr_2.5fr_2.5fr] items-center border-b bg-gray-50 font-semibold text-xs text-gray-700">
              <div className="px-3 py-2">Component</div>
              <div className="px-3 py-2">Live Value</div>
              <div className="px-3 py-2">Link Device</div>
              <div className="px-3 py-2">Subsitute Value</div>
            </div>
            <div>
              {stream.componentsForActiveMethod.map(
                (component: GasComponent) => {
                  const resultForStream = store.results.find(
                    (r) => r.stream_id === stream.id
                  );
                  // --- MODIFICATION: Render the new ComponentRow ---
                  return (
                    <ComponentRow
                      key={component.key}
                      component={component}
                      availableDevices={availableDevices}
                      resultForStream={resultForStream}
                      onInputChange={handleComponentInputChange}
                    />
                  );
                }
              )}
            </div>
          </div>
        )}

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
