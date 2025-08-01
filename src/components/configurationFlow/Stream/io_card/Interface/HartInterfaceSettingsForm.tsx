import React, { useState } from 'react';
import type { HartConfig } from '../../../../../types/interfaceConfig';

interface HartInterfaceSettingsFormProps {
    currentConfig: HartConfig;
    onSave: (config: HartConfig) => void;
    onClose: () => void;
}

const HartInterfaceSettingsForm: React.FC<HartInterfaceSettingsFormProps> = ({
    currentConfig,
    onSave,
    onClose,
}) => {
    const [formData, setFormData] = useState<HartConfig>(currentConfig);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        const isNumeric = [
            "baud_rate",
            "scan_interval_ms",
            "retry_count",
            "max_devices"
        ].includes(name);

        setFormData((prev) => ({
            ...prev,
            [name]: isNumeric && value !== "" ? Number(value) : value,
        }));
    };

    const handleSave = () => {
        onSave(formData);
        console.log("Saving config:", formData);
    };

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
                        value={formData.baud_rate}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 text-[12px] shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                </div>

                <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                        Scan Interval (ms)
                    </label>
                    <input
                        name="scan_interval_ms"
                        type="number"
                        placeholder="How often to poll devices, e.g., 1000"
                        value={formData.scan_interval_ms}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 text-[12px] shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                            Retry Count
                        </label>
                        <input
                            name="retry_count"
                            type="number"
                            value={formData.retry_count}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 text-[12px] shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                        />
                    </div>
                    <div>
                        <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                            Max Devices
                        </label>
                        <input
                            name="max_devices"
                            type="number"
                            value={formData.max_devices}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 text-[12px] shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                        Physical Layer
                    </label>
                    <select
                        name="hartPhysicalLayer"
                        value={formData.hartPhysicalLayer || ""}
                        onChange={handleChange}
                        className={`w-full border border-gray-300 rounded-md py-2 px-3 text-[12px] shadow-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 ${!formData.hartPhysicalLayer ? 'text-gray-400' : 'text-black'}`}
                    >
                        <option value="" disabled>Select a physical layer</option>
                        <option value="RS-485" className="text-black">RS-485</option>
                        <option value="RS-232" className="text-black">RS-232</option>
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
                    className="px-6 py-2 rounded-full font-semibold text-sm bg-yellow-400 text-black hover:bg-yellow-500 transition-colors shadow-sm"
                >
                    Save
                </button>
            </div>
        </>
    );
};

export default HartInterfaceSettingsForm;