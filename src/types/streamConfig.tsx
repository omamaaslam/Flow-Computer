import type { InterfaceConfig } from "./interfaceConfig";

export interface IOCardConfig {
  card_type: string;
  interfaces: Record<string, InterfaceConfig>;
}

// src/types/streamConfig.ts

// ===================================================================
// YEH NAYI AUR CENTRALIZED TYPE FILE HAI.
// Yeh file khaas taur par aapke WebSocket ke JSON structure ke liye banayi gayi hai.
// ===================================================================

// --- Calculator ke andar istemal hone wale Types ---
export type TemperatureUnit = "Celsius" | "Fahrenheit" | "Kelvin";
export type PressureUnit = "Bar" | "Psi" | "Kpa" | "Atm"; // JSON ke 'Bar', 'Celsius' se match karna zaroori hai

// --- Calculator ki har section ke liye alag Interface ---

export interface TemperatureCalculatorConfig {
  unit: TemperatureUnit;
  base_temperature: number;
  substitute_temperature: number;
  min_operating_temperature: number;
  max_operating_temperature: number;
  temp_linked_device_id: string; // JSON se property ka naam 'temp_linked_device_id' hai
}

export interface PressureCalculatorConfig {
  unit: PressureUnit;
  base_pressure: number;
  substitute_pressure: number;
  min_operating_pressure: number;
  max_operating_pressure: number;
  pressure_linked_device_id: string; // JSON se property ka naam 'pressure_linked_device_id' hai
}

export interface FlowRateCalculatorConfig {
  software_flow_rate_enabled: boolean; // JSON me yeh boolean hai, string nahi
  flow_rate_device_id: string;
  min_alarm_flow_rate: number;
  max_alarm_flow_rate: number;
  min_warning_flow_rate: number;
  max_warning_flow_rate: number;
  creep_mode_enabled: boolean; // JSON me yeh boolean hai, string nahi
  creep_flow_rate: number;
  creep_time_seconds: number;
}

// JSON me yeh null hain, isliye abhi 'any' type use kar rahe hain.
// Jab inka structure milega, to 'any' ko sahi interface se replace kar sakte hain.
export type VolumeConfiguration = any;
export type CompressibilityKFactorConfig = any;

// --- Poora Calculator Object ---
export interface CalculatorConfig {
  temperature_config: TemperatureCalculatorConfig;
  pressure_config: PressureCalculatorConfig;
  flow_rate_config: FlowRateCalculatorConfig;
  volume_configuration: VolumeConfiguration | null;
  compressibility_kfactor_config: CompressibilityKFactorConfig | null;
  calculation_profile: any | null;
}

// --- Top-Level Stream Object ---
export interface StreamData {
  stream_id: string;
  stream_name: string;
  calculator: CalculatorConfig;
  io_card: IOCardConfig;
}

// --- Default Values banane wala Function ---
// Yeh function hamesha ek valid CalculatorConfig object dega
export const createDefaultStreamConfig = (): CalculatorConfig => ({
  temperature_config: {
    unit: "Celsius",
    base_temperature: 15.0,
    substitute_temperature: 20.0,
    min_operating_temperature: -10.0,
    max_operating_temperature: 50.0,
    temp_linked_device_id: "",
  },
  pressure_config: {
    unit: "Bar",
    base_pressure: 1.01325,
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
  volume_configuration: null,
  compressibility_kfactor_config: null,
  calculation_profile: null,
});
