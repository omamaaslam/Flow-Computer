import React from "react";
import { observer } from "mobx-react-lite";
import type { pipeline_profile_config } from "../../../types/streamConfig";

interface PipelineProfileFormmProps {
  config: pipeline_profile_config;
  onSave: () => void;
  onClose: () => void;
  isSaving: boolean;
}

const PipelineProfileForm: React.FC<PipelineProfileFormmProps> = observer(
  ({ config, onSave, onClose, isSaving }) => {
    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value, type } = e.target;
      let finalValue: string | number = value;

      if (type === "text" && name !== "temp_linked_device_id") {
        if (value.trim() !== "" && !isNaN(Number(value))) {
          finalValue = Number(value);
        }
      }
      (config as any)[name] = finalValue;
    };

    return (
      <>
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm text-gray-800">
          <div className="space-y-1">
            <label className="block font-medium text-xs">Device</label>
            <select
              name="temp_linked_device_id"
              value={config.name ?? ""}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm"
            >
              <option value="pipe1">Pipe 1</option>
              <option value="pipe2">Pipe 2</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4 pt-3">
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
      </>
    );
  }
);

export default PipelineProfileForm;
