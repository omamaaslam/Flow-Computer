// types/InterfaceConfig.ts
export type Parity = "None" | "Even" | "Odd";
export type PullResistance = "Pull-Up" | "Pull-Down" | "None";

export interface InterfaceConfig {
  baudRate: number | null;
  dataBits: 5 | 6 | 7 | 8;
  maxSlaves: number | null;
  parity: Parity;
  stopBits: 1 | 2;
  pullResistance: PullResistance;
  timeoutMs: number | null;
  pollIntervalMs: number | null;
  retryCount: number | null;
}

export const createDefaultInterfaceConfig = (): InterfaceConfig => ({
  baudRate: null,
  dataBits: 8,
  maxSlaves: null,
  parity: "None",
  stopBits: 1,
  pullResistance: "None",
  timeoutMs: null,
  pollIntervalMs: null,
  retryCount: null,
});
