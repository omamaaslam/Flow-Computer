import { makeAutoObservable } from "mobx";
import type { InterfaceConfig } from "../interfaces/interfaceConfig";
import type { Device } from "../interfaces/Device";

export class InterfaceStore {
  public devices:Device[] = [];
  public configuration: InterfaceConfig[] = [];
  constructor() {
    makeAutoObservable(this);
  }

  setConfiguration(configuration: InterfaceConfig[]) {
    this.configuration = configuration;
  }

  // addDevice(key: string, device: any) {
  //   this.devices.set(key, device);
  // }

  // getDevice(key: string) {
  //   return this.devices.get(key);
  // }

  // updateDevice(key: string, device: any): number {
  //   if (this.devices.has(key)) {
  //     this.devices.set(key, device);
  //     return 1;
  //   }
  //   return 0;
  // }

  // removeDevice(key: string) {
  //   this.devices.delete(key);
  // }
}
