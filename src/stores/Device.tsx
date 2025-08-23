// src/stores/Device.tsx
import { makeAutoObservable } from "mobx";
import type { DeviceConfig } from "../types/device";

export class Device {
  public id: string;
  public name: any;
  public config: DeviceConfig;

  constructor(deviceData: DeviceConfig) {
    makeAutoObservable(this);

    this.id = deviceData.device_id;
    this.name = deviceData.device_type;
    this.config = deviceData;
  }

  updateConfig(newConfig: Partial<DeviceConfig>) {
    Object.assign(this.config, newConfig);
  }

  updateData(liveData: {
    status?: string;
    timestamp?: string;
    value?: string;
  }) {
    if (!this.config.data) {
      this.config.data = {};
    }
    Object.assign(this.config.data, liveData);
  }
}
