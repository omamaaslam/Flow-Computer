import { makeAutoObservable } from "mobx";
import { Device } from "./Device";
import type { InterfaceConfig } from "../types/interfaceConfig";

export class Interface {
  public id: string; // ID string hai (e.g., "DI1")
  public name: string; // Name/type (e.g., "DigitalInputInterface")
  public config: InterfaceConfig;
  public devices: Device[] = [];

  constructor(interfaceData: any) {
    makeAutoObservable(this);
    // Destructuring se common properties alag karein
    const { interface_id, interface_type, devices, ...configData } =
      interfaceData;

    this.id = interface_id;
    this.name = interface_type;

    // Baaki bache hue saare key-value pairs config me daal dein
    this.config = configData;

    // Devices ko parse karein agar woh data me maujood hain
    if (devices && Array.isArray(devices)) {
      // Assuming Device constructor also takes a data object
      this.devices = devices.map((devData) => new Device(devData));
    }
  }

  // Yeh methods abhi bhi kaam karenge
  removeDevice(deviceId: string) {
    // Device ID string ho sakti hai
    this.devices = this.devices.filter((device) => device.id !== deviceId);
  }

  updateConfig(newConfig: Partial<InterfaceConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): InterfaceConfig {
    return this.config;
  }
}
