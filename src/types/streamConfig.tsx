import type { InterfaceConfig } from "./interfaceConfig";

export interface IOCardConfig {
  card_type: string;
  interfaces: Record<string, InterfaceConfig>;
}

export type TemperatureUnit = "Celsius" | "Fahrenheit" | "Kelvin";
export type PressureUnit = "Bar" | "Psi" | "Kpa" | "Atm";

export type VolumeOperatingMode =
  | "EncoderOnlyVolumeConfig"
  | "OnePulseVolumeConfig"
  | "modbus";

export interface temperature_config {
  unit: TemperatureUnit;
  base_temperature: number | null;
  substitute_temperature: number | null;
  min_operating_temperature: number | null;
  max_operating_temperature: number | null;
  temp_linked_device_id: string;
}

export interface pressure_config {
  unit: PressureUnit;
  base_pressure: number | null;
  substitute_pressure: number;
  min_operating_pressure: number;
  max_operating_pressure: number;
  pressure_linked_device_id: string;
}

export interface flow_rate_config {
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

export interface volume_configuration {
  mode_type: VolumeOperatingMode | "";
  max_volume_step_limit: number | null;
  max_total_volume_limit?: number | null;
  encoder_device_id?: string;
  pulse_input_device_id?: string;
  min_operating_volume_limit: number | null;
  enable_bidirectional_volume: boolean;
}

export interface GasComponent {
  key: string;
  display_name: string;
  unit: string;
  live_value: number;
  value: number;
  linked_device_id?: string;
}

export interface CompressibilityKFactorConfig {
  active_method: string;
  gas_components: GasComponent[];
  methods: {
    [methodName: string]: {
      [componentKey: string]: GasComponent;
    };
  };
  constant_k_value: number;
}

export interface pipeline_profile_config {
  profile_name: string;
  stream_id: string;
}

export interface calculation_profile {
  active_profile_id: string;
  profiles: Record<string, pipeline_profile_config>;
}

/* ----------------------------- */
/*   Result Schema Integration   */
/* ----------------------------- */

// Generic gas measurement type
export interface GasMeasurement {
  value: number;
  faults: number;
  interference: boolean;
  recoveries: number;
}

// Full profile definition
export interface TestProfile {
  // Example gas components
  AR: number;
  AR_faults: number;
  AR_interference: boolean;
  AR_recoveries: number;

  C10H22: number;
  C10H22_faults: number;
  C10H22_interference: boolean;
  C10H22_recoveries: number;

  C2H6: number;
  C2H6_faults: number;
  C2H6_interference: boolean;
  C2H6_recoveries: number;

  C3H8: number;
  C3H8_faults: number;
  C3H8_interference: boolean;
  C3H8_recoveries: number;

  C6H14: number;
  C6H14_faults: number;
  C6H14_interference: boolean;
  C6H14_recoveries: number;

  C7H16: number;
  C7H16_faults: number;
  C7H16_interference: boolean;
  C7H16_recoveries: number;

  C8H18: number;
  C8H18_faults: number;
  C8H18_interference: boolean;
  C8H18_recoveries: number;

  C9H20: number;
  C9H20_faults: number;
  C9H20_interference: boolean;
  C9H20_recoveries: number;

  CH4: number;
  CH4_faults: number;
  CH4_interference: boolean;
  CH4_recoveries: number;

  CO: number;
  CO2: number;
  CO2_faults: number;
  CO2_interference: boolean;
  CO2_recoveries: number;
  CO_faults: number;
  CO_interference: boolean;
  CO_recoveries: number;

  H2: number;
  H2_faults: number;
  H2_interference: boolean;
  H2_recoveries: number;

  H2O: number;
  H2O_faults: number;
  H2O_interference: boolean;
  H2O_recoveries: number;

  H2S: number;
  H2S_faults: number;
  H2S_interference: boolean;
  H2S_recoveries: number;

  HE: number;
  HE_faults: number;
  HE_interference: boolean;
  HE_recoveries: number;

  HS: number;
  HS_faults: number;
  HS_interference: boolean;
  HS_recoveries: number;

  I_C4H10: number;
  I_C4H10_faults: number;
  I_C4H10_interference: boolean;
  I_C4H10_recoveries: number;

  I_C5H12: number;
  I_C5H12_faults: number;
  I_C5H12_interference: boolean;
  I_C5H12_recoveries: number;

  N2: number;
  N2_faults: number;
  N2_interference: boolean;
  N2_recoveries: number;

  N_C4H10: number;
  N_C4H10_faults: number;
  N_C4H10_interference: boolean;
  N_C4H10_recoveries: number;

  N_C5H12: number;
  N_C5H12_faults: number;
  N_C5H12_interference: boolean;
  N_C5H12_recoveries: number;

  O2: number;
  O2_faults: number;
  O2_interference: boolean;
  O2_recoveries: number;

  SD: number;
  SD_faults: number;
  SD_interference: boolean;
  SD_recoveries: number;

  // System properties
  base_pressure: number;
  base_temperature: number;
  compressibility_delta_k_factor: number;
  compressibility_interference_flag: boolean;
  compressibility_k_factor: number;
  compressibility_last_k_factor: number;
  compressibility_logs: string[];

  correction_z_factor: number;
  correction_z_factor_delta: number;
  correction_z_factor_last: number;

  current_system_timestamp: number;
  current_timestamp: number;
  current_volume_original: number;

  delta_time: number;
  delta_volume_original: number;

  device_flow_rate: number;

  flow_creep_alarm: boolean;
  flow_creep_enable_flag: boolean;
  flow_creep_fault_count: number;
  flow_creep_interference_flag: boolean;
  flow_creep_recovery_count: number;
  flow_creep_start_time: number;

  flow_rate_fault_count: number;
  flow_rate_interference_flag: boolean;
  flow_rate_logs: string[];
  flow_rate_recovery_count: number;

  interference_flag: boolean;
  interference_flow_rate: number;
  interference_volume_forward: number;
  interference_volume_net: number;
  interference_volume_reverse: number;

  last_status_ok: boolean;
  last_timestamp: number;
  last_volume_original: number;

  method_name: string;

  operating_flow_rate: number;
  operating_pressure: number;
  operating_temperature: number;

  operating_total_volume_forward: number;
  operating_total_volume_net: number;
  operating_total_volume_reverse: number;

  operating_volume_forward: number;
  operating_volume_net: number;
  operating_volume_reverse: number;

  pressure_fault_count: number;
  pressure_interference_flag: boolean;
  pressure_logs: string[];
  pressure_recovery_count: number;

  software_flow_rate: number;

  standard_flow_rate: number;
  standard_interference_flow_rate: number;
  standard_interference_volume_forward: number;
  standard_interference_volume_net: number;
  standard_interference_volume_reverse: number;

  standard_total_volume_forward: number;
  standard_total_volume_net: number;
  standard_total_volume_reverse: number;

  standard_volume_forward: number;
  standard_volume_net: number;
  standard_volume_reverse: number;

  system_logs: string[];
  temperature_fault_count: number;
  temperature_interference_flag: boolean;
  temperature_logs: string[];
  temperature_recovery_count: number;

  volume_fault_count: number;
  volume_interference_flag: boolean;
  volume_logs: string[];
  volume_recovery_count: number;
}

export interface StreamProfiles {
  [profileName: string]: TestProfile;
}

export interface Streams {
  [streamId: string]: StreamProfiles;
}

export interface stream_config {
  temperature_config: temperature_config;
  pressure_config: pressure_config;
  flow_rate_config: flow_rate_config;
  volume_configuration: volume_configuration;
  compressibility_kfactor_config: CompressibilityKFactorConfig;
  pipeline_profile_configuration: pipeline_profile_config;
  calculation_profile: any;
  result?: Streams;
}

export interface StreamData {
  stream_id: string;
  stream_name: string;
  calculator: stream_config;
  io_card: IOCardConfig;
  state: any;
}

export const createDefaultStreamConfig = (): stream_config => ({
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
    mode_type: "",
    max_volume_step_limit: null,
    min_operating_volume_limit: null,
    encoder_device_id: "",
    enable_bidirectional_volume: false,
  },
  compressibility_kfactor_config: {
    active_method: "Constant",
    constant_k_value: 1,
    methods: {},
    gas_components: [
      {
        key: "CH4",
        display_name: "Methane",
        unit: "mol%",
        live_value: 0.0,
        value: 95.0,
        linked_device_id: "",
      },
      {
        key: "C2H6",
        display_name: "Ethane",
        unit: "mol%",
        live_value: 0.0,
        value: 3.0,
        linked_device_id: "",
      },
      {
        key: "N2",
        display_name: "Nitrogen",
        unit: "mol%",
        live_value: 0.0,
        value: 2.0,
        linked_device_id: "",
      },
      {
        key: "CO2",
        display_name: "Carbon Dioxide",
        unit: "mol%",
        live_value: 0.0,
        value: 0.0,
        linked_device_id: "",
      },
      {
        key: "I-C4H10",
        display_name: "i-Butane",
        unit: "mol%",
        live_value: 0.0,
        value: 0.0,
        linked_device_id: "",
      },
      {
        key: "I-C5H12",
        display_name: "i-Pentane",
        unit: "mol%",
        live_value: 0.0,
        value: 0.0,
        linked_device_id: "",
      },
      {
        key: "C5H12",
        display_name: "n-Pentanes",
        unit: "mol%",
        live_value: 0.0,
        value: 0.0,
        linked_device_id: "",
      },
      {
        key: "C6H14",
        display_name: "Hexane",
        unit: "mol%",
        live_value: 0.0,
        value: 0.0,
        linked_device_id: "",
      },
      {
        key: "C7H16",
        display_name: "Heptane",
        unit: "mol%",
        live_value: 0.0,
        value: 0.0,
        linked_device_id: "",
      },
      {
        key: "C8H18",
        display_name: "Octane",
        unit: "mol%",
        live_value: 0.0,
        value: 0.0,
        linked_device_id: "",
      },
      {
        key: "C9H20",
        display_name: "Nonane",
        unit: "mol%",
        live_value: 0.0,
        value: 0.0,
        linked_device_id: "",
      },
      {
        key: "C10H22",
        display_name: "Decane",
        unit: "mol%",
        live_value: 0.0,
        value: 0.0,
        linked_device_id: "",
      },
      {
        key: "HE",
        display_name: "Helium",
        unit: "mol%",
        live_value: 0.0,
        value: 0.0,
        linked_device_id: "",
      },
      {
        key: "AR",
        display_name: "Argon",
        unit: "mol%",
        live_value: 0.0,
        value: 0.0,
        linked_device_id: "",
      },
      {
        key: "C3H8",
        display_name: "Propane",
        unit: "mol%",
        live_value: 0.0,
        value: 0.0,
        linked_device_id: "",
      },
      {
        key: "H2O",
        display_name: "Water",
        unit: "mol%",
        live_value: 0.0,
        value: 0.0,
        linked_device_id: "",
      },
      {
        key: "HS",
        display_name: "Calorific Value",
        unit: "mol%",
        live_value: 0.0,
        value: 0.0,
        linked_device_id: "",
      },
      {
        key: "RHOL",
        display_name: " Standard Air Density",
        unit: "mol%",
        live_value: 0.0,
        value: 0.0,
        linked_device_id: "",
      },
      {
        key: "H2S",
        display_name: "Hydrogen Sulfide",
        unit: "mol%",
        live_value: 0.0,
        value: 0.0,
        linked_device_id: "",
      },
      {
        key: "H2",
        display_name: "Hydrogen",
        unit: "mol%",
        live_value: 0.0,
        value: 0.0,
        linked_device_id: "",
      },
      {
        key: "CO",
        display_name: "Carbon Monoxide",
        unit: "mol%",
        live_value: 0.0,
        value: 0.0,
        linked_device_id: "",
      },
      {
        key: "O2",
        display_name: "Oxygen",
        unit: "mol%",
        live_value: 0.0,
        value: 0.0,
        linked_device_id: "",
      },
      {
        key: "SD",
        display_name: "Standard Density",
        unit: "kg/m³",
        live_value: 0.0,
        value: 0.0,
        linked_device_id: "",
      },
    ],
  },
  pipeline_profile_configuration: {
    profile_name: "pipeline1",
    stream_id: "",
  },
  calculation_profile: null,
  result: {},
});
