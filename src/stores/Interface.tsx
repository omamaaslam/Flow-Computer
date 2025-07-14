// models/Interface.tsx
import { makeAutoObservable } from "mobx";
import { Device } from "./Device";
import type { InterfaceConfig } from "../types/interfaceConfig";

export class Interface {
  public id: number;
  public name: string;
  public config: InterfaceConfig;
  public devices: Device[] = [];

  constructor(id: number, name: string, config: InterfaceConfig) {
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

  updateConfig(newConfig: Partial<InterfaceConfig>) {
    Object.assign(this.config, newConfig);
  }
}
