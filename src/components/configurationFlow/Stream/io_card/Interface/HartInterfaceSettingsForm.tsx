// src/components/configurationFlow/Stream/io_card/Interface/HartInterfaceSettingsForm.tsx

import React, { useState, useEffect, useRef } from "react";
import type { HartConfig } from "../../../../../types/interfaceConfig";

interface HartInterfaceSettingsFormProps {
  currentConfig: HartConfig;
  onSave: (config: HartConfig) => void;
  onClose: () => void;
}

const validate = (data: Partial<HartConfig>) => {
  const errors: { [key: string]: string } = {};
  if (data.baud_rate == null || data.baud_rate <= 0)
    errors.baud_rate = "Required";
  if (data.scan_interval_ms == null || data.scan_interval_ms <= 0)
    errors.scan_interval_ms = "Required";
  if (data.retry_count == null || data.retry_count < 0)
    errors.retry_count = "Required";
  if (data.max_devices == null || data.max_devices <= 0)
    errors.max_devices = "Required";
  return errors;
};

const HartInterfaceSettingsForm: React.FC<HartInterfaceSettingsFormProps> = ({
  currentConfig,
  onSave,
  onClose,
}) => {
  const [formState, setFormState] = useState({
    ...currentConfig,
    baud_rate: String(currentConfig.baud_rate),
    scan_interval_ms: String(currentConfig.scan_interval_ms),
    retry_count: String(currentConfig.retry_count),
    max_devices: String(currentConfig.max_devices),
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isDirty, setIsDirty] = useState(false);

  const initialFormStateRef = useRef(JSON.stringify(formState));
  const isInitiallyConfigured = currentConfig.enabled;

  useEffect(() => {
    const validationData = { ...formState /* convert for validation */ };
    const validationErrors = validate(validationData as any);
    setErrors(validationErrors);
    setIsDirty(JSON.stringify(formState) !== initialFormStateRef.current);
  }, [formState]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const finalConfig: HartConfig = {
      ...formState,
      baud_rate: Number(formState.baud_rate),
      scan_interval_ms: Number(formState.scan_interval_ms),
      retry_count: Number(formState.retry_count),
      max_devices: Number(formState.max_devices),
    };
    if (Object.keys(validate(finalConfig)).length === 0) {
      onSave(finalConfig);
    }
  };

  const isSaveDisabled =
    Object.keys(errors).length > 0 || (isInitiallyConfigured && !isDirty);

  return (
    <>
      <div className="flex flex-col space-y-4">
        <div>
          <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
            Baudrate
          </label>
          <input
            name="baud_rate"
            type="number"
            placeholder="Please add Value"
            value={formState.baud_rate}
            onChange={handleChange}
            className={`w-full border rounded-md py-2 px-3 text-[12px] shadow-sm ${
              errors.baud_rate ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.baud_rate && (
            <p className="text-red-500 text-xs mt-1">{errors.baud_rate}</p>
          )}
        </div>
        <div>
          <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
            Scan Interval (ms)
          </label>
          <input
            name="scan_interval_ms"
            type="number"
            placeholder="e.g., 1000"
            value={formState.scan_interval_ms}
            onChange={handleChange}
            className={`w-full border rounded-md py-2 px-3 text-[12px] shadow-sm ${
              errors.scan_interval_ms ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.scan_interval_ms && (
            <p className="text-red-500 text-xs mt-1">
              {errors.scan_interval_ms}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
              Retry Count
            </label>
            <input
              name="retry_count"
              type="number"
              value={formState.retry_count}
              onChange={handleChange}
              className={`w-full border rounded-md py-2 px-3 text-[12px] shadow-sm ${
                errors.retry_count ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.retry_count && (
              <p className="text-red-500 text-xs mt-1">{errors.retry_count}</p>
            )}
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
              Max Devices
            </label>
            <input
              name="max_devices"
              type="number"
              value={formState.max_devices}
              onChange={handleChange}
              className={`w-full border rounded-md py-2 px-3 text-[12px] shadow-sm ${
                errors.max_devices ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.max_devices && (
              <p className="text-red-500 text-xs mt-1">{errors.max_devices}</p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
            Physical Layer
          </label>
          <select
            name="hartPhysicalLayer"
            value={formState.hartPhysicalLayer || ""}
            onChange={handleChange}
            className={`w-full border border-gray-300 rounded-md py-2 px-3 text-[12px] shadow-sm ${
              !formState.hartPhysicalLayer ? "text-gray-400" : "text-black"
            }`}
          >
            <option value="" disabled>
              Select a physical layer
            </option>
            <option value="RS-485" className="text-black">
              RS-485
            </option>
            <option value="RS-232" className="text-black">
              RS-232
            </option>
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={onClose}
          className="px-6 py-2 rounded-full font-semibold text-sm bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors shadow-sm"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isSaveDisabled}
          className={`px-6 py-2 rounded-full font-semibold text-sm text-black transition-colors shadow-sm ${
            isSaveDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-yellow-400 hover:bg-yellow-500"
          }`}
        >
          Save
        </button>
      </div>
    </>
  );
};

export default HartInterfaceSettingsForm;
