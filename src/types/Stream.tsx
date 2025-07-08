export interface Stream {
  id: number;
  name: string;
  stream: Stream;
}

export interface streamConfig {
  volumn: Volumn;
  temperature: Temperature;
  pressure: Pressure;
}

export interface Volumn {
  opMode: string;
  gasMeter: string;
  qMinAlarm: number;
  qMaxalarm: number;
  qMinWarn: number;
  qMaxWarn: number;
  creepMode: string;
  flowRate: number;
}
export interface Temperature {
  subsTemp: number;
  deviceId: number;
  baseTemp: number;
  minOpTemp: number;
  maxOpTemp: number;
  tempUnit: string;
}
export interface Pressure {
  subsPress: number;
  deviceId: number;
  basePress: number;
  minOpPress: number;
  maxOpPress: number;
  pressUnit: string;
}
