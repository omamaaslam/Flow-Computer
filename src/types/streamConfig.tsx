export interface temperatureConfig {
  live_temperature: string;
  substitute_temperature: string;
  device: string;
  min_operating_temperature: string;
  base_temperature: string;
  max_operating_temperature: string;
  temp_unit: "°C" | "°F" | "K";
}

export interface pressureConfig {
  live_pressure: string;
  substitute_pressure: string;
  device: string;
  min_operating_pressure: string;
  base_pressure: string;
  max_operating_pressure: string;
  pressureUnit: "Bar" | "Pascal" | "PSI";
}

export interface volumeConfiguration {
  operatingMode: string;
  gasMeter1: string;
  gasMeter2: string;
  maxFlowRate: number | string;
  max_total_volume: number | string;
  min_operating_volume: number | string;
  bidirectional: "enable" | "disable";
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

export interface ConversionRow {
  name: string;
  liveValue: string;
  unit: string;
  linkedDevice: string;
  keyboardInput: string;
}

export interface compressibilityKFactorConfig {
  method: string;
  rows: ConversionRow[];
}

export interface calculator {
  temperatureConfig: temperatureConfig;
  pressureConfig: pressureConfig;
  volumeConfiguration: volumeConfiguration;
  flowRateConfig: flowRateConfig;
  compressibilityKFactorConfig: compressibilityKFactorConfig;
}

export const createDefaultStreamConfig = (): calculator => ({
  temperatureConfig: {
    live_temperature: "21.5 °C",
    substitute_temperature: "",
    device: "Temperature S1",
    min_operating_temperature: "",
    base_temperature: "",
    max_operating_temperature: "",
    temp_unit: "°C",
  },
  pressureConfig: {
    live_pressure: "1.01 Bar",
    substitute_pressure: "",
    device: "Pressure S1",
    min_operating_pressure: "",
    base_pressure: "",
    max_operating_pressure: "",
    pressureUnit: "Bar",
  },
  volumeConfiguration: {
    operatingMode: "",
    gasMeter1: "Encoder only",
    gasMeter2: "Encoder only",
    maxFlowRate: "",
    max_total_volume: "",
    min_operating_volume: "",
    bidirectional: "disable",
  },
  flowRateConfig: {
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
  compressibilityKFactorConfig: {
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
