export interface TemperatureConfig {
  liveTemp: string;
  substituteTemp: string;
  device: string;
  minOpTemp: string;
  baseTemp: string;
  maxOpTemp: string;
  tempUnit: "°C" | "°F" | "K";
}

export interface PressureConfig {
  livePressure: string;
  substitutePressure: string;
  device: string;
  minOpPressure: string;
  basePressure: string;
  maxOpPressure: string;
  pressureUnit: "bar" | "psi" | "kPa" | "atm";
}

export interface VolumeConfig {
  operatingMode: string;
  gasMeter1: string;
  gasMeter2: string;
  maxFlowRate: number | string;
  maxTotalVolume: number | string;
  minOperationalVolume: number | string;
  isBiDirectional: "enable" | "disable";
}

export interface StreamConfig {
  temperature: TemperatureConfig;
  pressure: PressureConfig;
  volume: VolumeConfig;
}

export const createDefaultStreamConfig = (): StreamConfig => ({
  temperature: {
    liveTemp: "21.5 °C",
    substituteTemp: "",
    device: "Temperature S1",
    minOpTemp: "",
    baseTemp: "",
    maxOpTemp: "",
    tempUnit: "°C",
  },
  pressure: {
    livePressure: "1.01 bar",
    substitutePressure: "",
    device: "Pressure S1",
    minOpPressure: "",
    basePressure: "",
    maxOpPressure: "",
    pressureUnit: "bar",
  },
  volume: {
    operatingMode: "",
    gasMeter1: "Encoder only",
    gasMeter2: "Encoder only",
    maxFlowRate: "",
    maxTotalVolume: "",
    minOperationalVolume: "",
    isBiDirectional: "disable",
  },
});
