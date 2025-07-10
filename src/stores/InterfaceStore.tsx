import { makeAutoObservable } from "mobx";
import type { Device } from "../interfaces/Device";
import type { Interface } from "./Interface";

export class InterfaceStore {
  public devices: Device[] = [];
  public configuration: Interface[] = [];
  constructor(id: number, name: string, status: boolean) {
    makeAutoObservable(this);
  }

  setConfiguration(configuration: Interface[]) {
    this.configuration = configuration;
  }

  addDevice(device: Device) {
    this.devices.push(device);
  }
}
