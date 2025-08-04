// src/interfaces/Stream.tsx

export type VolumeOperatingMode =
  | "encoderOnly"
  | "onePulse"
  | "twoPulse1-1"
  | "twoPulseX-Y"
  | "encoderWithOnePulseInput"
  | "onePulseInputWithEncoder"
  | "encoderWithTwoPulseInputs"
  | "twoPulseInputsWithEncoder";

export type TemperatureUnit = "C" | "F" | "K";
export type PressureUnit = "bar" | "psi" | "kPa" | "atm";

export interface Stream {
  id: number;
  name: string;
  stream: Stream;
}

export interface VolumeConfig {
  operating_mode: VolumeOperatingMode | null;
  gas_meter_1: string;
  gas_meter_2: string;
  flow_rate: string;
  creep_time_seconds?: number | null;
  // FIX: Changed type to allow 'null' to match the form's logic for empty inputs.
  max_total_volume?: number | null;
  // FIX: Changed type to allow 'null' to match the form's logic for empty inputs.
  min_operating_volume?: number | null;
  bidirectional?: boolean;
}

export interface TemperatureConfig {
  substitute_temperature: number | null;
  device_id: string | null;
  min_operating_temperature: number | null;
  max_operating_temperature: number | null;
  base_temperature: number | null;
  unit: TemperatureUnit;
}

export interface PressureConfig {
  substitute_pressure: number | null;
  device_id: string | null;
  min_operating_pressure: number | null;
  max_operating_pressure: number | null;
  base_pressure: number | null;
  unit: PressureUnit;
}

export interface StreamConfig {
  volume: VolumeConfig;
  temperature: TemperatureConfig;
  pressure: PressureConfig;
}

export interface FlowRateConfig {
  calculationMethod: string;
  device: string;
  min_alarm_flow_rate: string;
  max_alarm_flow_rate: string;
  min_warning_flow_rate: string;
  max_warning_flow_rate: string;
  creep_mode_enabled: string;
  creep_flow_rate: string;
  creep_time_seconds: string;
}
