export interface InterfaceConfig {
  baudrate?: string;
  dataBits?: number;
  maxSlaves?: number;
  parity?: string;
  stopBits?: number;
  pullUpDown?: string;
  timeoutMs?: number;
  pollIntervalMs?: number;
  retryCount?: number;
}