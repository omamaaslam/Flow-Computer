// src/types/DeviceConfig.tsx

// NEW: This interface holds the communication settings for ONE device.
// This is for the items that will go inside the "list" object.
export interface DeviceProtocolConfig {
  device_id: number;

  // --- Modbus Specific Fields ---
  slaveId?: number | null;
  register_count?: number | null;
  register_address?: number | null;
  data_type?: "INT16" | "INT32" | "FLOAT" | "DOUBLE" | "STRING";

  // --- HART Specific Fields ---
  pollingAddress?: number | null;
  commandSet?: "Universal" | "Common Practice" | "Device-Specific";
  variableType?: "PV" | "SV" | "TV" | "QV";
}

// UPDATED: This is now clean and only has general info.
export interface GeneralDeviceConfig {
  // REMOVED: slaveId, register_count, register_address, data_type
  manufacturer: string;
  model: string;
  serial_number: string;
  tag_name: string;
  device_id: string;
  build_year: string;
  g_size: string;
  version: string;
}

// NEW: This is for extra parameters like G-Size, tmin, tmax etc.
export interface DeviceParameters {
  [key: string]: any;
}

// UPDATED: The main config object for a device.
export interface DeviceConfig {
  general: GeneralDeviceConfig;
  parameters?: DeviceParameters;
}

// NEW: This type describes a single device in the "devices" dictionary
export interface Device {
  id: number;
  name: string;
  config: DeviceConfig;
}

// UPDATED: The helper function now creates the new, cleaner config.
export const createDefaultDeviceConfig = (): DeviceConfig => ({
  general: {
    // REMOVED: slaveId, register_count, register_address, etc.
    manufacturer: "",
    model: "",
    serial_number: "",
    tag_name: "",
    device_id: "",
    build_year: "",
    g_size: "",
    version: "",
  },
  parameters: {},
});
