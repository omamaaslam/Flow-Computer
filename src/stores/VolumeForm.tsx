import { makeAutoObservable } from "mobx";

class VolumeFormStore {
  operatingMode = "encoderOnly";
  gasMeter = "Encoder only";
  qminAlarm = "";
  qmaxAlarm = "";
  qminWarn = "";
  qmaxWarn = "";
  creepMode = "Time Limited";
  flowRateLabel = "Time Limited";
  m3h = "";
  timeSeconds = "";

  constructor() {
    makeAutoObservable(this);
  }

  setField<K extends keyof this>(field: K, value: this[K]) {
    this[field] = value;
  }

  get formData() {
    return {
      operatingMode: this.operatingMode,
      gasMeter: this.gasMeter,
      qminAlarm: this.qminAlarm,
      qmaxAlarm: this.qmaxAlarm,
      qminWarn: this.qminWarn,
      qmaxWarn: this.qmaxWarn,
      creepMode: this.creepMode,
      flowRateLabel: this.flowRateLabel,
      m3h: this.m3h,
      timeSeconds: this.timeSeconds
    };
  }

  resetForm() {
    this.operatingMode = "encoderOnly";
    this.gasMeter = "Encoder only";
    this.qminAlarm = "";
    this.qmaxAlarm = "";
    this.qminWarn = "";
    this.qmaxWarn = "";
    this.creepMode = "Time Limited";
    this.flowRateLabel = "Time Limited";
    this.m3h = "";
    this.timeSeconds = "";
  }
}

export const volumeFormStore = new VolumeFormStore();