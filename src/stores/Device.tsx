import { makeAutoObservable, action } from "mobx";

export interface DeviceConfig {
  pressureRange?: string;
}

export interface DeviceData {
  pressure?: number;
  temperature?: number;
}

export class Device {
  public id: string;
  public name: string;
  public configurations: DeviceConfig = {};
  public data: DeviceData = {};

  constructor(id: string, name: string) {
    makeAutoObservable(this, {
      updateData: action,
      updateConfig: action,
    });
    this.id = id;
    this.name = name;
  }

  updateData(newData: Partial<DeviceData>) {
    Object.assign(this.data, newData);
  }

  updateConfig(newConfig: Partial<DeviceConfig>) {
    Object.assign(this.configurations, newConfig);
  }
}
