export type VolumeOperatingMode =
  | "Encoder Only"
  | "One pulse input"
  | "Two pulse inputs (1:1)"
  | "Two pulse inputs (x:y)"
  | "Encoder with one pulse input"
  | "One pulse input with encoder"
  | "Encoder with two pulse inputs"
  | "Two pulse inputs with encoder";

export type TemperatureUnit = "C" | "F" | "K";
export type PressureUnit = "bar" | "psi" | "kPa" | "atm";

export interface Stream {
  id: number;
  name: string;
  stream: Stream;
}



export interface VolumeConfig {
  operatingMode: VolumeOperatingMode | null;
  gasMeterSource: string;
  qMinAlarm: number | null;
  qMaxAlarm: number | null;
  qMinWarn: number | null;
  qMaxWarn: number | null;
  creepMode: string;
  flowRateLabel: string;
  m3h: number | null;
  timeSeconds: number | null;
}

export interface TemperatureConfig {
  substituteTemp: number | null;
  deviceId: string | null;
  minOpTemp: number | null;
  maxOpTemp: number | null;
  baseTemp: number | null;
  unit: TemperatureUnit;
}


export interface PressureConfig {
  substitutePressure: number | null;
  deviceId: string | null;
  minOpPressure: number | null;
  maxOpPressure: number | null;
  basePressure: number | null;
  unit: PressureUnit;
}

export interface StreamConfig {
  volume: VolumeConfig;
  temperature: TemperatureConfig;
  pressure: PressureConfig;
}