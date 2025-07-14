// models/Device.tsx
import { makeAutoObservable } from "mobx";
import type { DeviceConfig } from "../types/device";

export class Device {
  public id: number;
  public name: string;
  public config: DeviceConfig;

  constructor(id: number, name: string, config: DeviceConfig) {
    makeAutoObservable(this);
    this.id = id;
    this.name = name;
    this.config = config;
  }

  updateGeneralConfig(updatedConfig: Partial<DeviceConfig["general"]>) {
    Object.assign(this.config.general, updatedConfig);
  }
}
