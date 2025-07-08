// src/stores/Interface.ts
import { makeAutoObservable, action } from "mobx";
import { Device } from "./Device";
import type { InterfaceConfig } from "../types";

export class Interface {
  // Observables
  public id: string;
  public name: string;
  public devices: Device[] = [];
  public configurations: InterfaceConfig = {};

  constructor(id: string, name: string) {
    makeAutoObservable(this, {
      addDevice: action,
      updateConfig: action,
    });
    this.id = id;
    this.name = name;
  }

  // Action to add a device
  addDevice(device: Device) {
    this.devices.push(device);
  }

  updateConfig(newConfig: Partial<InterfaceConfig>) {
    Object.assign(this.configurations, newConfig);
  }

  // Getter to find a specific device
  getDeviceById(deviceId: string): Device | undefined {
    return this.devices.find((dev) => dev.id === deviceId);
  }
}
