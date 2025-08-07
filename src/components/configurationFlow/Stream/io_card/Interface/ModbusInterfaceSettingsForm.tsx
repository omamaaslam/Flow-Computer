// src/components/configurationFlow/Stream/io_card/Interface/ModbusInterfaceSettingsForm.tsx

import React, { useState, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import type { ModbusConfig } from "../../../../../types/interfaceConfig";

interface ModbusInterfaceSettingsFormProps {
  currentConfig: ModbusConfig;
  onSave: (config: ModbusConfig) => void;
  onClose: () => void;
  isSaving: boolean;
}

// Validation function specific to Modbus settings
const validate = (data: Partial<ModbusConfig>) => {
  const errors: { [key: string]: string } = {};
  if (data.baud_rate == null || data.baud_rate <= 0)
    errors.baud_rate = "Required";
  if (data.max_slaves == null || data.max_slaves <= 0)
    errors.max_slaves = "Required";
  if (data.poll_interval_ms == null || data.poll_interval_ms <= 0)
    errors.poll_interval_ms = "Required";
  if (data.timeout_ms == null || data.timeout_ms <= 0)
    errors.timeout_ms = "Required";
  if (data.retry_count == null || data.retry_count < 0)
    errors.retry_count = "Required";
  return errors;
};

const ModbusInterfaceSettingsForm: React.FC<ModbusInterfaceSettingsFormProps> =
  observer(({ currentConfig, onSave, onClose, isSaving }) => {
    // Store numeric fields as strings for better UX in input fields
      const [formState, setFormState] = useState({
      // Start with the base config to keep non-form properties
      ...currentConfig,
      // NOW, provide a valid string default for every form field
      baud_rate: String(currentConfig.baud_rate || '9600'),
      data_bits: String(currentConfig.data_bits || '8'),
      max_slaves: String(currentConfig.max_slaves || '5'),
      parity: currentConfig.parity || 'None',
      poll_interval_ms: String(currentConfig.poll_interval_ms || '1000'),
      pull_up_enabled: currentConfig.pull_up_enabled ?? false,
      retry_count: String(currentConfig.retry_count || '3'),
      stop_bits: String(currentConfig.stop_bits || '1'),
      timeout_ms: String(currentConfig.timeout_ms || '1000'),
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isDirty, setIsDirty] = useState(false);

    const initialFormStateRef = useRef(JSON.stringify(formState));
    const isInitiallyConfigured = currentConfig.enabled;

    useEffect(() => {
      const validationData = {
        ...formState /* convert necessary fields back to number for validation */,
      };
      const validationErrors = validate(validationData as any);
      setErrors(validationErrors);
      setIsDirty(JSON.stringify(formState) !== initialFormStateRef.current);
    }, [formState]);

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
      let finalValue = value;

      if (name === "pull_up_enabled") {
        setFormState((prev) => ({ ...prev, [name]: value === "true" }));
      } else {
        setFormState((prev) => ({ ...prev, [name]: finalValue }));
      }
    };

    const handleSave = () => {
      const finalConfig: ModbusConfig = {
        ...formState,
        baud_rate: Number(formState.baud_rate),
        data_bits: Number(formState.data_bits),
        max_slaves: Number(formState.max_slaves),
        poll_interval_ms: Number(formState.poll_interval_ms),
        retry_count: Number(formState.retry_count),
        stop_bits: Number(formState.stop_bits),
        timeout_ms: Number(formState.timeout_ms),
        port_name: "5173",
        physical_layer: "RS485",
      };

      if (Object.keys(validate(finalConfig)).length === 0) {
        console.warn(finalConfig);
        onSave(finalConfig);
      }
    };

    const isSaveDisabled =
      isSaving || // Disable if saving
      Object.keys(errors).length > 0 ||
      (isInitiallyConfigured && !isDirty);

    return (
      <>
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm text-gray-800">
          <div className="space-y-1">
            <label className="block font-medium text-xs">Baud Rate</label>
            <input
              name="baud_rate"
              type="number"
              value={formState.baud_rate}
              onChange={handleChange}
              className={`w-full border rounded-sm px-2 py-1 text-sm shadow-sm ${
                errors.baud_rate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.baud_rate && (
              <p className="text-red-500 text-xs mt-1">{errors.baud_rate}</p>
            )}
          </div>
          <div className="space-y-1">
            <label className="block font-medium text-xs">Data Bits</label>
            <select
              name="data_bits"
              value={formState.data_bits}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm"
            >
              <option value={8}>8</option>
              <option value={7}>7</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="block font-medium text-xs">Max Slaves</label>
            <input
              name="max_slaves"
              type="number"
              value={formState.max_slaves}
              onChange={handleChange}
              className={`w-full border rounded-sm px-2 py-1 text-sm shadow-sm ${
                errors.max_slaves ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.max_slaves && (
              <p className="text-red-500 text-xs mt-1">{errors.max_slaves}</p>
            )}
          </div>
          <div className="space-y-1">
            <label className="block font-medium text-xs">Parity</label>
            <select
              name="parity"
              value={formState.parity}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm"
            >
              <option value="Even">Even</option>
              <option value="Odd">Odd</option>
              <option value="None">None</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="block font-medium text-xs">Stop Bits</label>
            <select
              name="stop_bits"
              value={formState.stop_bits}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="block font-medium text-xs">Pull-Up Enabled</label>
            <select
              name="pull_up_enabled"
              value={String(formState.pull_up_enabled)}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm"
            >
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="block font-medium text-xs">Time-out (ms)</label>
            <input
              name="timeout_ms"
              type="number"
              value={formState.timeout_ms}
              onChange={handleChange}
              className={`w-full border rounded-sm px-2 py-1 text-sm shadow-sm ${
                errors.timeout_ms ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.timeout_ms && (
              <p className="text-red-500 text-xs mt-1">{errors.timeout_ms}</p>
            )}
          </div>
          <div className="space-y-1">
            <label className="block font-medium text-xs">
              Poll Interval (ms)
            </label>
            <input
              name="poll_interval_ms"
              type="number"
              value={formState.poll_interval_ms}
              onChange={handleChange}
              className={`w-full border rounded-sm px-2 py-1 text-sm shadow-sm ${
                errors.poll_interval_ms ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.poll_interval_ms && (
              <p className="text-red-500 text-xs mt-1">
                {errors.poll_interval_ms}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <label className="block font-medium text-xs">Retry Count</label>
            <select
              name="retry_count"
              value={formState.retry_count}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm shadow-sm"
            >
              <option value={3}>3</option>
              <option value={2}>2</option>
              <option value={1}>1</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4 pt-3">
          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-full font-semibold text-xs text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaveDisabled}
            className={`px-5 py-1.5 rounded-full font-semibold text-xs text-black transition-colors ${
              isSaveDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600"
            }`}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </>
    );
  });

export default ModbusInterfaceSettingsForm;
