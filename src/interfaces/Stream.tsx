// PATH: src/types/streamConfig.ts (ya src/interfaces/Stream.tsx)

export type VolumeOperatingMode =
  | "encoderOnly"
  | "OnePulse"
  | "twoPulse1-1"
  | "twoPulseX-Y"
  | "encoderWithOnePulseInput"
  | "onePulseInputWithEncoder"
  | "encoderWithTwoPulseInputs"
  | "twoPulseInputsWithEncoder";

export type TemperatureUnit = "C" | "F" | "K";
export type PressureUnit = "bar" | "psi" | "kPa" | "atm";

// Note: Interfaces ka naam aapke store ke import ke mutabiq rakha gaya hai
export interface volume_configuration {
  operating_mode: VolumeOperatingMode | null;
  gas_meter_1: string;
  gas_meter_2: string;
  flow_rate: string;
  creep_time_seconds: number | null;
  max_total_volume: number | null;
  min_operating_volume: number | null;
  bidirectional: boolean;
}

export interface temperatureConfig {
  substitute_temperature: number | null;
  device_id: string | null;
  min_operating_temperature: number | null;
  max_operating_temperature: number | null;
  base_temperature: number | null;
  unit: TemperatureUnit;
}

export interface pressureConfig {
  substitute_pressure: number | null;
  device_id: string | null;
  min_operating_pressure: number | null;
  max_operating_pressure: number | null;
  base_pressure: number | null;
  unit: PressureUnit;
}

export interface flowRateConfig {
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

export interface compressibilityKFactorConfig {
  calculation_method: string;
}

export interface stream_config {
  volume_configuration: volume_configuration;
  temperatureConfig: temperatureConfig;
  pressureConfig: pressureConfig;
  flowRateConfig: flowRateConfig;
  compressibilityKFactorConfig: compressibilityKFactorConfig;
}

// Yeh function sabse zaroori hai. Yeh har config ke liye default values deta hai.
export const createDefaultStreamConfig = (): stream_config => ({
  temperatureConfig: {
    substitute_temperature: null,
    device_id: "",
    min_operating_temperature: null,
    max_operating_temperature: null,
    base_temperature: null,
    unit: "C",
  },
  pressureConfig: {
    substitute_pressure: null,
    device_id: "",
    min_operating_pressure: null,
    max_operating_pressure: null,
    base_pressure: null,
    unit: "bar",
  },
  volume_configuration: {
    operating_mode: null,
    gas_meter_1: "Meter A",
    gas_meter_2: "Meter A",
    flow_rate: "",
    creep_time_seconds: null,
    max_total_volume: null,
    min_operating_volume: null,
    bidirectional: false,
  },
  flowRateConfig: {
    calculationMethod: "",
    device: "",
    min_alarm_flow_rate: "",
    max_alarm_flow_rate: "",
    min_warning_flow_rate: "",
    max_warning_flow_rate: "",
    creep_mode_enabled: "false",
    creep_flow_rate: "",
    creep_time_seconds: "",
  },
  compressibilityKFactorConfig: {
    calculation_method: "AGA8",
  },
});
