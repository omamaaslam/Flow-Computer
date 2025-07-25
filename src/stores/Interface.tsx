// src/models/Interface.ts
import { makeAutoObservable } from "mobx";
import { Device } from "./Device";
import type { InterfaceConfig } from "../types/interfaceConfig";
import type { DeviceConfig } from "../types/device";

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

  addDevice(id: number, name: string, config: DeviceConfig) {
    const device = new Device(id, name, config);
    this.devices.push(device);
    return this.devices;
  }

  removeDevice(deviceId: number) {
    this.devices = this.devices.filter((device) => device.id !== deviceId);
  }

  updateConfig(newConfig: Partial<InterfaceConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): InterfaceConfig {
    return this.config;
  }
}