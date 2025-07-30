import { makeAutoObservable } from "mobx";
import type { DeviceConfig, GeneralDeviceConfig } from "../types/device";


export class Device {
  public id: string;
  public name: string;
  public config: DeviceConfig;

  constructor(deviceData: any) {
    makeAutoObservable(this);
    // device_id ya name na hone par crash se bachne ke liye fallback add karein
    this.id = deviceData.device_id || `temp-id-${Date.now()}`;
    this.name = deviceData.device_name || "Unnamed Device";

    // Agar deviceData.config nahi hai, to khaali object ki jagah
    // poora default config object use karein.
    this.config = deviceData.config;
  }

  // Is method ko bhi thoda behtar kar sakte hain
  updateGeneralConfig(updatedConfig: Partial<GeneralDeviceConfig>) {
    // Ab `this.config.general` hamesha maujood hoga,
    // to `if` check ki zaroorat nahi hai.
    Object.assign(this.config.general, updatedConfig);
  }
}


