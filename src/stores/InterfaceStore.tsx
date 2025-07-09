import { makeAutoObservable } from "mobx";
import type { InterfaceConfig } from "../interfaces/interfaceConfig";
import type { Device } from "../interfaces/Device";

export class InterfaceStore {
  public devices: Device[] = [];
  public configuration: InterfaceConfig[] = [];
  constructor(id: number, name: string, status: boolean) {
    makeAutoObservable(this);
  }

  setConfiguration(configuration: InterfaceConfig[]) {
    this.configuration = configuration;
  }

  addDevice(device: Device) {
    this.devices.push(device);
  }
}
