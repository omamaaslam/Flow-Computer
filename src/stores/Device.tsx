// src/stores/Device.tsx
import { makeAutoObservable } from "mobx";
import type { DeviceConfig } from "../types/device";

export class Device {
  public id: string;
  public name: string;
  public config: DeviceConfig;

  constructor(deviceData: any) {
    makeAutoObservable(this);

    // Step 1: ID aur Name set karein.
    this.id = deviceData.device_id;
    this.name = deviceData.device_type;

    // Step 2: Baaki saara flat object seedha 'config' mein daal dein.
    // Koi parsing, koi general/parameters nahi. Bilkul simple.
    this.config = deviceData;
  }

  // Update method ab flat objects ko merge karega.
  updateConfig(newConfig: Partial<DeviceConfig>) {
    // MobX will track changes to the properties of this.config
    Object.assign(this.config, newConfig);
  }
}
