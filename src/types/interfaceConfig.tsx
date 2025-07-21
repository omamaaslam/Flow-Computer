// src/types/InterfaceConfig.tsx

import type { Device, DeviceProtocolConfig } from "./device";

// Import the necessary device types from the other file

// NO CHANGE to this interface itself. It remains the same.
export interface InterfaceConfig {
  // --- Modbus Specific Fields ---
  baudrate?: string;
  dataBits?: number;
  maxSlaves?: number;
  parity?: "Even" | "Odd" | "None";
  stopBits?: 1 | 2;
  pullUpDown?: "Enabled" | "Disabled";
  timeoutMs?: number;
  pollIntervalMs?: number;
  retryCount?: 1 | 2 | 3;

  // --- RTD Specific Fields ---
  wireType?: "2-wire" | "3-wire" | "4-wire";
  excitationCurrent?: number;
  measurementMode?: "Continuous" | "On-Demand";
  samplingInterval?: number;
  referenceResistor?: number;

  // --- HART1 Specific Fields ---
  hartBaudrate?: number;
  hartScanInterval?: number;
  hartRetryCount?: number;
  hartMaxDevices?: number;
  hartPhysicalLayer?: "RS-485" | "RS-232";

  // --- DI Configuration Specific Fields ---
  diInputType?: string;
  diDebounceTime?: number;
  diSignalLogic?: "Active High" | "Active Low";
  diEdgeDetection?: "Rising" | "Falling" | "Both";
  diPullUpDown?: "Pull-up" | "Pull-down";
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