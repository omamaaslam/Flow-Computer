// types/DeviceConfig.ts
export type DataType = "INT16" | "INT32" | "FLOAT" | "DOUBLE" | "STRING";

export interface GeneralDeviceConfig {
  slaveId: number | null;
  registerCount: number | null;
  registerAddress: number | null;
  dataType: DataType;
  manufacturer: string;
  model: string;
  serialNumber: string;
  tagName: string;
  deviceId: string;
  buildYear: number | null;
  version: string;
}

export interface DeviceConfig {
  general: GeneralDeviceConfig;
  // You can add specialized configs later like calibration, thresholds etc.
}

export const createDefaultDeviceConfig = (): DeviceConfig => ({
  general: {
    slaveId: null,
    registerCount: null,
    registerAddress: null,
    dataType: "INT16",
    manufacturer: "",
    model: "",
    serialNumber: "",
    tagName: "",
    deviceId: "",
    buildYear: null,
    version: "",
  },
});
