// src/types/interfaceConfig.tsx

// A base interface for properties that are common to all interface types.
interface BaseInterfaceConfig {
  enabled: boolean;
  interface_id: number;
}

// Specific configuration for Digital Input (DI1)
export interface DigitalInputConfig extends BaseInterfaceConfig {
  interface_type: "DigitalInputInterface";
  debounce_time_ms: number;
  edge_detection: number;
  input_type: number;
  pull_config: number;
  signal_logic: number;
}

// Specific configuration for HART (HI1)
export interface HartConfig extends BaseInterfaceConfig {
  interface_type: "HartInterface";
  baud_rate: number;
  max_devices: number;
  retry_count: number;
  scan_interval_ms: number;
}

// Specific configuration for Modbus (MOD1)
export interface ModbusConfig extends BaseInterfaceConfig {
  interface_type: "ModbusInterface";
  baud_rate: number;
  data_bits: number;
  max_slaves: number;
  parity: "Even" | "Odd" | "None";
  poll_interval_ms: number;
  pull_up_enabled: boolean;
  retry_count: number;
  stop_bits: number;
  timeout_ms: number;
  list?: { [key: string]: any }; // <-- YEH LINE ADD KI GAI HAI
}

// Specific configuration for RTD (TI1)
export interface RtdConfig extends BaseInterfaceConfig {
  interface_type: "RtdInterface";
  excitation_current_ma: number;
  measurement_mode: "Continuous" | "On-Demand";
  reference_resistor_ohms: number;
  sampling_interval_ms: number;
  wire_type: "ThreeWire" | "TwoWire" | "FourWire";
}

// The main export: InterfaceConfig can be any one of the specific config types.
export type InterfaceConfig =
  | DigitalInputConfig
  | HartConfig
  | ModbusConfig
  | RtdConfig;