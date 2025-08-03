// src/types/interfaceConfig.ts

// A base interface for properties that are common to all interface types.
interface BaseInterfaceConfig {
  enabled: boolean;
  interface_id: number;
}

// Specific configuration for Digital Input (DI1)
// REVISED: Using string literals for better type safety and simpler form handling.
export interface DigitalInputConfig extends BaseInterfaceConfig {
  interface_type: "DigitalInputInterface";
  debounce_time_ms: number;
  edge_detection: "Rising" | "Falling" | "Both";
  input_type: "Dry Contact" | "Wet Contact";
  pull_config: "Pull-down" | "Pull-up" | "None";
  signal_logic: "Active High" | "Active Low";
}

// Specific configuration for HART (HI1)
export interface HartConfig extends BaseInterfaceConfig {
  interface_type: "HartInterface";
  baud_rate: number;
  max_devices: number;
  retry_count: number;
  scan_interval_ms: number;
  hartPhysicalLayer?: "RS-485" | "RS-232";
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
  list?: { [key: string]: any };
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