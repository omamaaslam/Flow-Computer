export interface InterfaceConfig {
  buadrate: number;
  dataBits: number;
  stopBits: number;
  parity: string;
  pollInterval: number;
  pullUpDown: boolean;
  retryCount: number;
  timeout: number;
  maxSlaves: number;
}
