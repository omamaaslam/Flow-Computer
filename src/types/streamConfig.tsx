export interface TemperatureConfig {
  live_temperature: string;
  substitute_temperature: string;
  device: string;
  min_operating_temperature: string;
  base_temperature: string;
  max_operating_temperature: string;
  temp_unit: "°C" | "°F" | "K";
}

export interface PressureConfig {
  live_pressure: string;
  substitute_pressure: string;
  device: string;
  min_operating_pressure: string;
  base_pressure: string;
  max_operating_pressure: string;
  pressureUnit: "Bar" | "Pascal" | "PSI";
}

export interface VolumeConfig {
  operatingMode: string;
  gasMeter1: string;
  gasMeter2: string;
  maxFlowRate: number | string;
  max_total_volume: number | string;
  min_operating_volume: number | string;
  bidirectional: "enable" | "disable";
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

export interface ConversionRow {
  name: string;
  liveValue: string;
  unit: string;
  linkedDevice: string;
  keyboardInput: string;
}

export interface ConversionConfig {
  method: string;
  rows: ConversionRow[];
}

export interface StreamConfig {
  temperature: TemperatureConfig;
  pressure: PressureConfig;
  volume: VolumeConfig;
  flowRate: FlowRateConfig;
  conversion: ConversionConfig;
}

export const createDefaultStreamConfig = (): StreamConfig => ({
  temperature: {
    live_temperature: "21.5 °C",
    substitute_temperature: "",
    device: "Temperature S1",
    min_operating_temperature: "",
    base_temperature: "",
    max_operating_temperature: "",
    temp_unit: "°C",
  },
  pressure: {
    live_pressure: "1.01 Bar",
    substitute_pressure: "",
    device: "Pressure S1",
    min_operating_pressure: "",
    base_pressure: "",
    max_operating_pressure: "",
    pressureUnit: "Bar",
  },
  volume: {
    operatingMode: "",
    gasMeter1: "Encoder only",
    gasMeter2: "Encoder only",
    maxFlowRate: "",
    max_total_volume: "",
    min_operating_volume: "",
    bidirectional: "disable",
  },
  flowRate: {
    calculationMethod: "Software Based",
    device: "",
    min_alarm_flow_rate: "",
    max_alarm_flow_rate: "",
    min_warning_flow_rate: "",
    max_warning_flow_rate: "",
    creep_mode_enabled: "Disable",
    creep_flow_rate: "",
    creep_time_seconds: "",
  },
  conversion: {
    method: "GERG88_1",
    rows: [
      {
        name: "Ho_n",
        unit: "MJ/m³",
        liveValue: "12.345",
        linkedDevice: "",
        keyboardInput: "",
      },
      {
        name: "Carbon Dioxide",
        unit: "mol%",
        liveValue: "2.15",
        linkedDevice: "",
        keyboardInput: "",
      },
      {
        name: "Nitrogen",
        unit: "mol%",
        liveValue: "0.55",
        linkedDevice: "",
        keyboardInput: "",
      },
    ],
  },
});
