// src/types/interfaceConfig.ts

// Yeh type unn sabhi possible configuration properties ko define karta hai
// jo kisi bhi interface type (Modbus, RTD, HART, DI) se aa sakti hain.
// Sabhi properties optional hain (?) kyunki ek interface me sirf uske
// relevant properties hi hongi.

export interface InterfaceConfig {
  // Common property for all interfaces
  enabled?: boolean;

  // --- Modbus Specific Fields (JSON names ke mutabiq) ---
  baud_rate?: number;
  data_bits?: number;
  parity?: "Even" | "Odd" | "None";
  stop_bits?: number;
  timeout_ms?: number;
  retry_count?: number; // JSON me 'retry_count' hai, so it's ok
  max_slaves?: number;
  poll_interval_ms?: number;
  pull_up_enabled?: boolean;

  // --- RTD Specific Fields (JSON names ke mutabiq) ---
  wire_type?: "TwoWire" | "ThreeWire" | "FourWire"; // JSON se match karein
  excitation_current_ma?: number;
  measurement_mode?: "Continuous" | "On-Demand";
  sampling_interval_ms?: number;
  reference_resistor_ohms?: number;

  // --- HART Specific Fields (JSON names ke mutabiq) ---
  // `retry_count` aur `max_devices` Modbus ke saath common ho sakte hain
  scan_interval_ms?: number;
  // hartPhysicalLayer?: "RS-485" | "RS-232"; // Agar JSON me hai to rakhein

  // --- Digital Input (DI) Specific Fields (JSON names ke mutabiq) ---
  debounce_time_ms?: number;
  signal_logic?: number; // JSON me 0 hai (e.g., Active High)
  edge_detection?: number; // JSON me 0 hai (e.g., Disabled/None)
  pull_config?: number; // JSON me 0 hai (e.g., None)
  input_type?: number; // JSON me 0 hai (e.g., Dry Contact)
}
