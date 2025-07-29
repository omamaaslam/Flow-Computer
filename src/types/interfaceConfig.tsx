import type { Device, DeviceProtocolConfig } from "./device";

export interface InterfaceConfig {
  // --- Modbus Specific Fields ---
  baud_rate?: string;
  dataBits?: number;
  max_slaves?: number;
  parity?: "Even" | "Odd" | "None";
  stop_bits?: 1 | 2;
  pull_up_enabled?: "Enabled" | "Disabled";
  timeout_ms?: number;
  poll_interval_ms?: number;
  retryCount?: 1 | 2 | 3;

  // --- RTD Specific Fields ---
  wire_type?: "2-wire" | "3-wire" | "4-wire";
  excitation_current_ma?: number;
  measurement_mode?: "Continuous" | "On-Demand";
  sampling_interval_ms?: number;
  reference_resistor_ohms?: number;

  // --- HART1 Specific Fields ---
  scan_interval_ms?: number;
  retry_count?: number;
  max_devices?: number;
  hartPhysicalLayer?: "RS-485" | "RS-232";

  // --- DI Configuration Specific Fields ---
  interface_type?: string;
  diDebounceTime?: number;
  signal_logic?: "Active High" | "Active Low";
  edge_detection?: "Rising" | "Falling" | "Both";
  pull_config?: "Pull-up" | "Pull-down";
}


// ===================================================================
// NEW TYPES ADDED BELOW TO DESCRIBE THE FULL STRUCTURE
// ===================================================================

// This describes the structure for one complete interface (e.g., HART1)
// It uses Record<string, T> for our key-mapped objects.
export interface ConfiguredInterface {
  id: number;
  name: string;
  config: InterfaceConfig;
  
  list: Record<string, DeviceProtocolConfig>;
  devices: Record<string, Device>;
}

// This is the type for the entire JSON payload from your backend.
export interface FullConfiguration {
  interfaces: Record<string, ConfiguredInterface>;
}