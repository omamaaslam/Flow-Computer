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
}