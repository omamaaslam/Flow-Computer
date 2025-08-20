import React from "react";
import { observer } from "mobx-react-lite";
import type { calculation_profile } from "../../../types/streamConfig";
import { toJS } from "mobx";

interface PipelineProfileFormProps {
  config: calculation_profile;
  onSave: () => void;
  onClose: () => void;
  isSaving: boolean;
}

const PipelineProfileForm: React.FC<PipelineProfileFormProps> = observer(
  ({ config, onSave, onClose, isSaving }) => {
    const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      config.active_profile_id = e.target.value;
    };
    console.log("incoming confguration", toJS(config));
    const handleSave = () => {
      onSave();
    };

    return (
      <>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">
          <div>
            <label className="block font-medium text-xs">Device</label>
            <select
              name="profile_name"
              value={config.active_profile_id ?? ""}
              onChange={handleDropdownChange}
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm"
            >
              <option value="">Select a pipeline</option>
              <option value="pipeline1">Pipeline 1</option>
              <option value="pipeline2">Pipeline 2</option>
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
            onClick={handleSave}
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
