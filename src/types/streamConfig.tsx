// src/types/streamConfig.ts

// Define the shape for Temperature configuration
export interface TemperatureConfig {
  liveTemp: string; // This would likely come from a live data feed, but is stored for display
  substituteTemp: string;
  device: string;
  minOpTemp: string;
  baseTemp: string;
  maxOpTemp: string;
  tempUnit: "°C" | "°F" | "K";
}

// Define the shape for Pressure configuration
export interface PressureConfig {
  livePressure: string;
  substitutePressure: string;
  device: string;
  minOpPressure: string;
  basePressure: string;
  maxOpPressure: string;
  pressureUnit: "bar" | "psi" | "kPa" | "atm";
}

// Define the shape for Volume configuration
export interface VolumeConfig {
  operatingMode: string;
  gasMeter: string;
  qminAlarm: number | string;
  qmaxAlarm: number | string;
  qminWarn: number | string;
  qmaxWarn: number | string;
  creepMode: string;
  m3h: number | string;
  timeSeconds: number | string;
}

// Define the overall Stream Configuration object
export interface StreamConfig {
  temperature: TemperatureConfig;
  pressure: PressureConfig;
  volume: VolumeConfig;
  // Add other stream-level configs here, e.g., conversion
}

// Factory function to create a default configuration
export const createDefaultStreamConfig = (): StreamConfig => ({
  temperature: {
    liveTemp: "21.5 °C", // Example static value
    substituteTemp: "",
    device: "Temperature S1",
    minOpTemp: "",
    baseTemp: "",
    maxOpTemp: "",
    tempUnit: "°C",
  },
  pressure: {
    livePressure: "1.01 bar", // Example static value
    substitutePressure: "",
    device: "Pressure S1",
    minOpPressure: "",
    basePressure: "",
    maxOpPressure: "",
    pressureUnit: "bar",
  },
  volume: {
    operatingMode: "encoderOnly",
    gasMeter: "Encoder only",
    qminAlarm: "",
    qmaxAlarm: "",
    qminWarn: "",
    qmaxWarn: "",
    creepMode: "Time Limited",
    m3h: "",
    timeSeconds: "",
  },
});
