// types/device.ts

// A specific interface for the nested Modbus settings
export interface ModbusSettings {
  slave_address: string; // Changed from slave_id to slave_address for claritystring
  register_address: string;
  register_count: string;
  data_type: string;
}

// The main DeviceConfig, now including the nested object
export interface DeviceConfig {
  // General Info
  device_id: string;
  device_type: string;
  manufacturer: string;
  model: string;
  serial_number: string;
  tag_name: string;
  build_year: string;
  version: string;
  modbus_settings?: ModbusSettings;
  pollingAddress?: string; // Optional for HART devices
  commandSet?: string; // Optional for HART devices
  variableType?: string; // Optional for HART devices
  // Gas-specific value
  gas_value?: number;
  data?: {
    status?: string;
    timestamp?: string;
    value?: any;
  };

  // A fallback for any other property from other device types
  [key: string]: any;
}
