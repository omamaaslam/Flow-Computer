import type { InterfaceConfig } from "./interfaceConfig";
export interface IOCardConfig {
  card_type: string;
  interfaces: Record<string, InterfaceConfig>;
}

export type TemperatureUnit = "Celsius" | "Fahrenheit" | "Kelvin";
export type PressureUnit = "Bar" | "Psi" | "Kpa" | "Atm";

export type VolumeOperatingMode =
  | "encoderOnly"
  | "onePulse"
  | "twoPulse1-1"
  | "twoPulseX-Y"
  | "encoderWithOnePulseInput"
  | "onePulseInputWithEncoder"
  | "encoderWithTwoPulseInputs"
  | "modbus"
  | "twoPulseInputsWithEncoder";

export interface TemperatureCalculatorConfig {
  unit: TemperatureUnit;
  base_temperature: number | null;
  substitute_temperature: number | null;
  min_operating_temperature: number | null;
  max_operating_temperature: number | null;
  temp_linked_device_id: string;
}

export interface PressureCalculatorConfig {
  unit: PressureUnit;
  base_pressure: number | null;
  substitute_pressure: number;
  min_operating_pressure: number;
  max_operating_pressure: number;
  pressure_linked_device_id: string;
}

export interface FlowRateCalculatorConfig {
  software_flow_rate_enabled: boolean;
  flow_rate_device_id: string;
  min_alarm_flow_rate: number;
  max_alarm_flow_rate: number;
  min_warning_flow_rate: number;
  max_warning_flow_rate: number;
  creep_mode_enabled: boolean;
  creep_flow_rate: number;
  creep_time_seconds: number;
}

export interface VolumeConfiguration {
  operating_mode: VolumeOperatingMode | "";
  gas_meter_1: string;
  gas_meter_2: string;
  flow_rate: number | null;
  creep_time_seconds: number | null;
  max_total_volume: number | null;
  min_operating_volume: number | null;
  bidirectional: boolean;
}

// Updated to match the new JSON payload
export interface GasComponent {
  key: string;
  display_name: string;
  unit: string;
  value: number;
  linked_device_id: string;
}

export interface CompressibilityKFactorConfig {
  k_factor_method: string;
  gas_components: GasComponent[];
}

export interface pipeline_profile_config {
  name: string;
  device_id: string;
}

export interface CalculatorConfig {
  temperature_config: TemperatureCalculatorConfig;
  pressure_config: PressureCalculatorConfig;
  flow_rate_config: FlowRateCalculatorConfig;
  volume_configuration: VolumeConfiguration;
  compressibility_kfactor_config: CompressibilityKFactorConfig;
  pipeline_profile_configuration: pipeline_profile_config;
  calculation_profile: any | null;
}

export interface StreamData {
  stream_id: string;
  stream_name: string;
  calculator: CalculatorConfig;
  io_card: IOCardConfig;
}

export const createDefaultStreamConfig = (): CalculatorConfig => ({
  temperature_config: {
    unit: "Celsius",
    base_temperature: null,
    substitute_temperature: null,
    min_operating_temperature: null,
    max_operating_temperature: null,
    temp_linked_device_id: "",
  },
  pressure_config: {
    unit: "Bar",
    base_pressure: null,
    substitute_pressure: 1.0,
    min_operating_pressure: 0.8,
    max_operating_pressure: 10.0,
    pressure_linked_device_id: "",
  },
  flow_rate_config: {
    software_flow_rate_enabled: true,
    flow_rate_device_id: "",
    min_alarm_flow_rate: 0.1,
    max_alarm_flow_rate: 1000,
    min_warning_flow_rate: 0.5,
    max_warning_flow_rate: 900,
    creep_mode_enabled: false,
    creep_flow_rate: 0.05,
    creep_time_seconds: 60,
  },
  volume_configuration: {
    operating_mode: "",
    gas_meter_1: "",
    gas_meter_2: "",
    flow_rate: null,
    creep_time_seconds: null,
    max_total_volume: null,
    min_operating_volume: null,
    bidirectional: false,
  },
  compressibility_kfactor_config: {
    k_factor_method: "AGA8_DC92",
    gas_components: [
      {
        key: "CH4",
        display_name: "Methane",
        unit: "mol%",
        value: 95.0,
        linked_device_id: "",
      },
      {
        key: "C2H6",
        display_name: "Ethane",
        unit: "mol%",
        value: 3.0,
        linked_device_id: "",
      },
      {
        key: "N2",
        display_name: "Nitrogen",
        unit: "mol%",
        value: 2.0,
        linked_device_id: "",
      },
      {
        key: "CO2",
        display_name: "Carbon Dioxide",
        unit: "mol%",
        value: 0.0,
        linked_device_id: "",
      },
      {
        key: "C3H8",
        display_name: "Propane",
        unit: "mol%",
        value: 0.0,
        linked_device_id: "",
      },
      {
        key: "H2O",
        display_name: "Water",
        unit: "mol%",
        value: 0.0,
        linked_device_id: "",
      },
      {
        key: "H2S",
        display_name: "Hydrogen Sulfide",
        unit: "mol%",
        value: 0.0,
        linked_device_id: "",
      },
      {
        key: "H2",
        display_name: "Hydrogen",
        unit: "mol%",
        value: 0.0,
        linked_device_id: "",
      },
      {
        key: "CO",
        display_name: "Carbon Monoxide",
        unit: "mol%",
        value: 0.0,
        linked_device_id: "",
      },
      {
        key: "O2",
        display_name: "Oxygen",
        unit: "mol%",
        value: 0.0,
        linked_device_id: "",
      },
    ],
  },
  pipeline_profile_configuration: {
    name: "",
    device_id: "",
  },
  calculation_profile: null,
});
