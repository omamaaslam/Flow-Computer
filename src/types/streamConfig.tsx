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

export interface FlowRateConfig {
  calculationMethod: string;
  device: string;
  minAlarmFlowrate: string;
  maxAlarmFlowrate: string;
  minWarningFlowrate: string;
  maxWarningFlowrate: string;
  creepMode: string;
  creepFlowrate: string;
  creepTime: string;
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
  flowRate: {
    calculationMethod: "Software Based",
    device: "",
    minAlarmFlowrate: "",
    maxAlarmFlowrate: "",
    minWarningFlowrate: "",
    maxWarningFlowrate: "",
    creepMode: "Disable",
    creepFlowrate: "",
    creepTime: "",
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
