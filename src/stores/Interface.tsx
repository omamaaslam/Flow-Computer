// src/models/Interface.ts
import { makeAutoObservable } from "mobx";
import { Device } from "./Device";
import type { InterfaceConfig } from "../types/interfaceConfig";

export class Interface {
  public id: number;
  public name: string;
  public config: InterfaceConfig;
  public devices: Device[] = [];

  constructor(id: number, name: string, config: InterfaceConfig = {}) {
    makeAutoObservable(this);
    this.id = id;
    this.name = name;
    this.config = config;
  }

  addDevice(id: number, name: string, config: any) {
    const device = new Device(id, name, config);
    this.devices.push(device);
    return device;
  }

  // --- ADD THIS METHOD ---
  removeDevice(deviceId: number) {
    this.devices = this.devices.filter((device) => device.id !== deviceId);
  }
  // -----------------------

  updateConfig(newConfig: Partial<InterfaceConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): InterfaceConfig {
    return this.config;
  }
}
