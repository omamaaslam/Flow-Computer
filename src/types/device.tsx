// src/types/DeviceConfig.tsx

// NEW: This interface holds the communication settings for ONE device.
// This is for the items that will go inside the "list" object.
export interface DeviceProtocolConfig {
  deviceId: number;

  // --- Modbus Specific Fields ---
  slaveId?: number | null;
  registerCount?: number | null;
  registerAddress?: number | null;
  dataType?: "INT16" | "INT32" | "FLOAT" | "DOUBLE" | "STRING";

  // --- HART Specific Fields ---
  pollingAddress?: number | null;
  commandSet?: "Universal" | "Common Practice" | "Device-Specific";
  variableType?: "PV" | "SV" | "TV" | "QV";
}

// UPDATED: This is now clean and only has general info.
export interface GeneralDeviceConfig {
  // REMOVED: slaveId, registerCount, registerAddress, dataType
  manufacturer: string;
  model: string;
  serialNumber: string;
  tagName: string;
  deviceId: string;
  buildYear: number | null;
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
    // REMOVED: slaveId, registerCount, registerAddress, etc.
    manufacturer: "",
    model: "",
    serialNumber: "",
    tagName: "",
    deviceId: "",
    buildYear: null,
    version: "",
  },
  parameters: {},
});
